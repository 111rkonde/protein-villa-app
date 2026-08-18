import prisma from '../config/db';

export class CartService {
  static async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new Error('Either userId or sessionId is required to access cart.');
    }

    let cart;
    if (userId) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  discountPercent: true,
                  images: true,
                  stockQuantity: true,
                  isAvailable: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    discountPercent: true,
                    images: true,
                    stockQuantity: true,
                    isAvailable: true,
                  },
                },
              },
            },
          },
        });
      }
    } else {
      cart = await prisma.cart.findFirst({
        where: { sessionId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  discountPercent: true,
                  images: true,
                  stockQuantity: true,
                  isAvailable: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { sessionId },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    discountPercent: true,
                    images: true,
                    stockQuantity: true,
                    isAvailable: true,
                  },
                },
              },
            },
          },
        });
      }
    }

    return this.calculateCartTotals(cart);
  }

  static calculateCartTotals(cart: any, couponCode?: string, couponDiscountPercent?: number) {
    let subtotal = 0;
    const formattedItems = cart.items.map((item: any) => {
      const parsedImages = JSON.parse(item.product.images || '[]');
      const effectivePrice = item.price;
      const itemTotal = effectivePrice * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productSlug: item.product.slug,
        productImage: parsedImages[0] || '',
        price: effectivePrice,
        size: item.size,
        flavor: item.flavor,
        quantity: item.quantity,
        totalPrice: itemTotal,
        inStock: item.product.stockQuantity >= item.quantity,
      };
    });

    const discountRate = couponDiscountPercent || 0;
    const discount = Math.round((subtotal * discountRate) / 100);
    const discountedSubtotal = subtotal - discount;
    const shippingFee = subtotal === 0 || discountedSubtotal >= 999 ? 0 : 99;
    const tax = Math.round(discountedSubtotal * 0.05); // 5% GST on supplements
    const total = discountedSubtotal + shippingFee + tax;

    return {
      id: cart.id,
      items: formattedItems,
      itemCount: formattedItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
      subtotal,
      discount,
      couponCode: couponCode || null,
      shippingFee,
      freeShippingThreshold: 999,
      amountForFreeShipping: Math.max(0, 999 - subtotal),
      tax,
      total,
    };
  }

  static async addItem(
    params: { userId?: string; sessionId?: string },
    data: { productId: string; size?: string; flavor?: string; quantity?: number }
  ) {
    const cart = await this.getOrCreateCart(params.userId, params.sessionId);
    const product = await prisma.product.findUnique({ where: { id: data.productId } });

    if (!product || !product.isAvailable) {
      throw new Error('Product is unavailable.');
    }

    const size = data.size || 'Standard';
    const flavor = data.flavor || 'Default';
    const quantity = Math.max(1, data.quantity || 1);

    // Calculate effective discounted price
    const unitPrice =
      product.discountPercent > 0
        ? Math.round(product.price * (1 - product.discountPercent / 100))
        : product.price;

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        size,
        flavor,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          price: unitPrice,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          size,
          flavor,
          quantity,
          price: unitPrice,
        },
      });
    }

    return this.getOrCreateCart(params.userId, params.sessionId);
  }

  static async updateItemQuantity(
    params: { userId?: string; sessionId?: string },
    itemId: string,
    quantity: number
  ) {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getOrCreateCart(params.userId, params.sessionId);
  }

  static async removeItem(itemId: string) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Item removed from cart.' };
  }

  static async clearCart(cartId: string) {
    await prisma.cartItem.deleteMany({ where: { cartId } });
    return { message: 'Cart cleared successfully.' };
  }
}
