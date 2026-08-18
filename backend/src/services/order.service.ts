import prisma from '../config/db';

export class OrderService {
  static async createOrder(data: {
    userId?: string;
    guestEmail?: string;
    items: Array<{
      productId: string;
      productName: string;
      productImage?: string;
      size: string;
      flavor: string;
      unitPrice: number;
      quantity: number;
    }>;
    shippingAddress: any;
    paymentMethod: string;
    couponCode?: string;
    customerNotes?: string;
  }) {
    // Calculate totals
    let subtotal = 0;
    for (const item of data.items) {
      subtotal += item.unitPrice * item.quantity;
    }

    let discount = 0;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        if (!coupon.minSpend || subtotal >= coupon.minSpend) {
          discount = Math.round((subtotal * coupon.discountPercent) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } },
          });
        }
      }
    }

    const discountedSubtotal = subtotal - discount;
    const shippingFee = discountedSubtotal >= 999 ? 0 : 99;
    const tax = Math.round(discountedSubtotal * 0.05); // 5% GST
    const total = discountedSubtotal + shippingFee + tax;

    const orderNumber = `PV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId || null,
        guestEmail: data.guestEmail || null,
        subtotal,
        discount,
        couponCode: data.couponCode || null,
        shippingFee,
        tax,
        total,
        status: 'PENDING',
        paymentMethod: data.paymentMethod || 'COD',
        paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        trackingNumber,
        estimatedDelivery: estDate,
        shippingAddress: JSON.stringify(data.shippingAddress),
        customerNotes: data.customerNotes || null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage || null,
            size: item.size || 'Standard',
            flavor: item.flavor || 'Default',
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            totalPrice: item.unitPrice * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Update product stock and inventory logs
    for (const item of data.items) {
      if (item.productId) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (product) {
          const newStock = Math.max(0, product.stockQuantity - item.quantity);
          await prisma.product.update({
            where: { id: item.productId },
            data: { stockQuantity: newStock },
          });

          await prisma.inventoryLog.create({
            data: {
              productId: item.productId,
              changeType: 'ORDER',
              quantityChanged: -item.quantity,
              previousStock: product.stockQuantity,
              newStock,
              note: `Order ${orderNumber}`,
            },
          });
        }
      }
    }

    // Send user in-app notification if registered user
    if (data.userId) {
      await prisma.notification.create({
        data: {
          userId: data.userId,
          title: 'Order Placed Successfully! 📦',
          message: `Your order #${orderNumber} for ₹${total.toLocaleString('en-IN')} has been placed.`,
          type: 'ORDER',
          link: `/orders/${order.id}`,
        },
      });

      // Clear user cart
      const cart = await prisma.cart.findUnique({ where: { userId: data.userId } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    }

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
    };
  }

  static async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((o) => ({
      ...o,
      shippingAddress: JSON.parse(o.shippingAddress || '{}'),
    }));
  }

  static async getOrderById(orderIdOrNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
      include: {
        items: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    return {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress || '{}'),
    };
  }

  static async trackOrderByNumber(orderNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber: orderNumber.trim() }, { trackingNumber: orderNumber.trim() }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new Error('Order not found with provided tracking or order number.');
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
      date: activeStep >= idx ? new Date(order.createdAt.getTime() + idx * 86400000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : null,
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
      include: { items: true },
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
