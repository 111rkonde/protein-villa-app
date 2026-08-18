import prisma from '../config/db';

export class WishlistService {
  static async getWishlist(userId: string) {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        ...item.product,
        images: JSON.parse(item.product.images || '[]'),
        nutritionInfo: JSON.parse(item.product.nutritionInfo || '{}'),
        goalTags: JSON.parse(item.product.goalTags || '[]'),
        flavorOptions: JSON.parse(item.product.flavorOptions || '[]'),
        sizeOptions: JSON.parse(item.product.sizeOptions || '[]'),
      },
    }));
  }

  static async toggleWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      return { inWishlist: false, message: 'Removed from wishlist.' };
    } else {
      await prisma.wishlist.create({
        data: { userId, productId },
      });
      return { inWishlist: true, message: 'Added to wishlist.' };
    }
  }

  static async removeFromWishlist(userId: string, productId: string) {
    await prisma.wishlist.deleteMany({
      where: { userId, productId },
    });
    return { message: 'Item removed from wishlist.' };
  }
}
