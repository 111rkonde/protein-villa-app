import prisma from '../config/db';
import { PaymentService } from './payment.service';

export interface CreateOrderInput {
  userId?: string;
  guestEmail?: string;
  items: Array<{
    productId: string;
    productName?: string;
    productImage?: string;
    size?: string;
    flavor?: string;
    unitPrice?: number; // Ignored by server — prices are fetched directly from DB
    quantity: number;
  }>;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    phone: string;
  };
  paymentMethod: 'COD' | 'CARD' | 'UPI';
  couponCode?: string;
  customerNotes?: string;
  paymentDetails?: {
    gatewayOrderId?: string;
    gatewayPaymentId?: string;
    gatewaySignature?: string;
  };
}

export class OrderService {
  /**
   * Secure, Atomic Order Creation with Zero-Trust Client Pricing
   */
  static async createOrder(data: CreateOrderInput) {
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    // Execute atomic transaction for inventory check, pricing calculation, coupon application, and order creation
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const verifiedItems: Array<{
        productId: string;
        productName: string;
        productImage: string | null;
        size: string;
        flavor: string;
        unitPrice: number;
        quantity: number;
        totalPrice: number;
      }> = [];

      // 1. SECURITY & PRICING: Fetch real product price and verify stock from DB
      for (const item of data.items) {
        if (!item.productId) {
          throw new Error('Invalid product identifier in order item.');
        }

        const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isAvailable) {
          throw new Error(`Product "${product?.name || item.productId}" is currently unavailable.`);
        }

        if (product.stockQuantity < quantity) {
          throw new Error(
            `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${quantity}.`
          );
        }

        // Calculate authentic unit price (ignoring any client-provided price)
        const authenticUnitPrice =
          product.discountPercent > 0
            ? Math.round(product.price * (1 - product.discountPercent / 100))
            : product.price;

        const itemTotal = authenticUnitPrice * quantity;
        subtotal += itemTotal;

        const parsedImages = JSON.parse(product.images || '[]');
        const productImage = item.productImage || parsedImages[0] || null;

        verifiedItems.push({
          productId: product.id,
          productName: product.name,
          productImage,
          size: item.size || 'Standard',
          flavor: item.flavor || 'Default',
          unitPrice: authenticUnitPrice,
          quantity,
          totalPrice: itemTotal,
        });

        // 2. ATOMIC STOCK DEDUCTION
        const newStock = product.stockQuantity - quantity;
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: newStock },
        });

        // 3. INVENTORY LOGGING
        await tx.inventoryLog.create({
          data: {
            productId: product.id,
            changeType: 'ORDER',
            quantityChanged: -quantity,
            previousStock: product.stockQuantity,
            newStock,
            note: `Order checkout for product ${product.name}`,
          },
        });
      }

      // 4. COUPON VALIDATION & ATOMIC USAGE INCREMENT
      let discount = 0;
      let appliedCouponCode: string | null = null;

      if (data.couponCode && data.couponCode.trim()) {
        const normalizedCode = data.couponCode.trim().toUpperCase();
        const coupon = await tx.coupon.findUnique({
          where: { code: normalizedCode },
        });

        if (coupon && coupon.isActive) {
          const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
          const limitReached = coupon.usageLimit && coupon.usageCount >= coupon.usageLimit;
          const meetsMinSpend = !coupon.minSpend || subtotal >= coupon.minSpend;

          if (!isExpired && !limitReached && meetsMinSpend) {
            discount = Math.round((subtotal * coupon.discountPercent) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }

            appliedCouponCode = coupon.code;

            // Increment coupon usage count atomically
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
      }

      // 5. TAX, SHIPPING & TOTAL RE-CALCULATION
      const discountedSubtotal = Math.max(0, subtotal - discount);
      const shippingFee = subtotal === 0 || discountedSubtotal >= 999 ? 0 : 99;
      const tax = Math.round(discountedSubtotal * 0.05); // 5% GST
      const total = discountedSubtotal + shippingFee + tax;

      // Generate unique tamper-proof order number and tracking code
      const orderNumber = `PV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const estDate = new Date();
      estDate.setDate(estDate.getDate() + 3);

      const paymentMethod = data.paymentMethod || 'COD';
      const isPrepaid = paymentMethod === 'CARD' || paymentMethod === 'UPI';

      // 6. CREATE ORDER RECORD
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId || null,
          guestEmail: data.guestEmail?.trim().toLowerCase() || null,
          subtotal,
          discount,
          couponCode: appliedCouponCode,
          shippingFee,
          tax,
          total,
          status: 'PENDING',
          paymentMethod,
          paymentStatus: isPrepaid ? 'PAID' : 'PENDING',
          trackingNumber,
          estimatedDelivery: estDate,
          shippingAddress: JSON.stringify(data.shippingAddress),
          customerNotes: data.customerNotes?.trim() || null,
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              productImage: item.productImage,
              size: item.size,
              flavor: item.flavor,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 7. RECORD PAYMENT RECEIPT / TRANSACTION
      if (isPrepaid) {
        const paymentIntent = PaymentService.createPaymentIntent({
          amount: total,
          orderNumber,
          paymentMethod,
          userId: data.userId,
          customerEmail: data.guestEmail,
        });

        await tx.payment.create({
          data: {
            orderId: createdOrder.id,
            userId: data.userId || null,
            amount: total,
            currency: 'INR',
            provider: paymentMethod === 'UPI' ? 'UPI_GATEWAY' : 'CARD_GATEWAY',
            method: paymentMethod,
            status: 'COMPLETED',
            transactionId: paymentIntent.gatewayOrderId,
            paymentSignature: paymentIntent.signature,
          },
        });
      }

      // 8. CLEAR USER CART & DISPATCH IN-APP NOTIFICATION
      if (data.userId) {
        await tx.notification.create({
          data: {
            userId: data.userId,
            title: 'Order Placed Successfully! 📦',
            message: `Your order #${orderNumber} for ₹${total.toLocaleString('en-IN')} has been placed.`,
            type: 'ORDER',
            link: `/orders/${createdOrder.id}`,
          },
        });

        const cart = await tx.cart.findUnique({ where: { userId: data.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return createdOrder;
    });

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
    };
  }

  static async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress || '{}'),
    }));
  }

  static async getOrderById(orderIdOrNumber: string, requestingUserId?: string, userRole?: string) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
      include: {
        items: true,
        payments: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    // SECURITY: If requesting user is not ADMIN, verify they own the order
    if (userRole !== 'ADMIN' && requestingUserId && order.userId && order.userId !== requestingUserId) {
      throw new Error('Unauthorized access to this order.');
    }

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
    };
  }

  static async trackOrderByNumber(orderNumber: string) {
    const cleanCode = (orderNumber || '').trim();
    if (!cleanCode) {
      throw new Error('Order identifier is required for tracking.');
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: cleanCode },
          { orderNumber: cleanCode },
          { orderNumber: cleanCode.toUpperCase() },
          { trackingNumber: cleanCode },
          { trackingNumber: cleanCode.toUpperCase() },
        ],
      },
      include: {
        items: true,
        payments: true,
      },
    });

    if (!order) {
      throw new Error(`No order found matching "${cleanCode}". Please verify your Order # or Tracking Code.`);
    }

    const statuses = [
      { key: 'PENDING', label: 'Order Placed', desc: 'We have received your order.' },
      { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Your order is verified and scheduled for packing.' },
      { key: 'PROCESSING', label: 'Processing & Packed', desc: 'Item packed in high-grade tamper-proof package.' },
      { key: 'SHIPPED', label: 'Shipped', desc: 'Handed over to courier partner with priority logistics.' },
      { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Courier agent is on the way to your address.' },
      { key: 'DELIVERED', label: 'Delivered', desc: 'Package successfully delivered.' },
    ];

    const currentIdx = statuses.findIndex((s) => s.key === order.status);
    const activeStep = currentIdx === -1 ? (order.status === 'CANCELLED' ? -1 : 0) : currentIdx;

    const timeline = statuses.map((step, idx) => ({
      ...step,
      completed: activeStep >= idx,
      current: activeStep === idx,
      date:
        activeStep >= idx
          ? new Date(order.createdAt.getTime() + idx * 86400000).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : null,
    }));

    return {
      orderNumber: order.orderNumber,
      trackingNumber: order.trackingNumber,
      status: order.status,
      total: order.total,
      itemCount: order.items.length,
      items: order.items,
      createdAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery,
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
      timeline,
      isCancelled: order.status === 'CANCELLED',
    };
  }

  static async getAllOrders(query: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 15));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search } },
        { trackingNumber: { contains: query.search } },
        { shippingAddress: { contains: query.search } },
        { user: { name: { contains: query.search } } },
        { user: { email: { contains: query.search } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const parsedOrders = orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress || '{}'),
    }));

    return { orders: parsedOrders, total, page, limit };
  }

  static async updateOrderStatus(
    orderId: string,
    status: string,
    trackingNumber?: string,
    estimatedDelivery?: string,
    adminId?: string
  ) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found.');
    }

    const updateData: any = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: { items: true, payments: true },
    });

    // Notify user
    if (order.userId) {
      await prisma.notification.create({
        data: {
          userId: order.userId,
          title: `Order Status Updated: ${status} 🚚`,
          message: `Your order #${order.orderNumber} status changed to ${status}.`,
          type: 'ORDER',
          link: `/orders/${order.id}`,
        },
      });
    }

    if (adminId) {
      await prisma.adminActivity.create({
        data: {
          adminId,
          action: 'UPDATE_ORDER_STATUS',
          targetType: 'ORDER',
          targetId: order.id,
          details: `Changed status of order #${order.orderNumber} from ${order.status} to ${status}`,
        },
      });
    }

    return {
      ...updated,
      shippingAddress: JSON.parse(updated.shippingAddress || '{}'),
    };
  }
}
