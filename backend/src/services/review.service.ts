import prisma from '../config/db';

export class ReviewService {
  static async getProductReviews(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    const avgRating = total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : 5.0;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (distribution[r.rating as keyof typeof distribution] !== undefined) {
        distribution[r.rating as keyof typeof distribution]++;
      }
    });

    return {
      reviews,
      total,
      averageRating: Number(avgRating.toFixed(1)),
      ratingDistribution: distribution,
    };
  }

  static async addReview(
    userId: string,
    userName: string,
    userAvatar: string | undefined,
    data: { productId: string; rating: number; title?: string; comment: string }
  ) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) {
      throw new Error('Product not found.');
    }

    // Check if user already reviewed
    const existing = await prisma.review.findFirst({
      where: { userId, productId: data.productId },
    });

    let review;
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating: data.rating,
          title: data.title,
          comment: data.comment,
        },
      });
    } else {
      review = await prisma.review.create({
        data: {
          userId,
          userName,
          userAvatar,
          productId: data.productId,
          rating: data.rating,
          title: data.title,
          comment: data.comment,
          isVerifiedPurchase: true,
          isApproved: true,
        },
      });
    }

    // Recalculate product rating & count
    const allReviews = await prisma.review.findMany({
      where: { productId: data.productId, isApproved: true },
    });
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        rating: Number(avg.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return review;
  }

  static async deleteReview(reviewId: string, userId?: string, isAdmin: boolean = false) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new Error('Review not found.');
    }

    if (!isAdmin && review.userId !== userId) {
      throw new Error('You are not authorized to delete this review.');
    }

    await prisma.review.delete({ where: { id: reviewId } });

    // Update product rating stats
    const allReviews = await prisma.review.findMany({
      where: { productId: review.productId, isApproved: true },
    });
    const avg = allReviews.length > 0 ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length : 5.0;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Number(avg.toFixed(1)),
        reviewCount: allReviews.length,
      },
    });

    return { message: 'Review deleted successfully.' };
  }
}
