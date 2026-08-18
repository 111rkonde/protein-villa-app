import prisma from '../config/db';

export class ProductService {
  static async getProducts(query: {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minProtein?: number;
    goal?: string;
    rating?: number;
    inStock?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'newest';
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      isAvailable: true,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
        { shortDescription: { contains: query.search } },
      ];
    }

    if (query.category) {
      where.OR = [
        { categoryId: query.category },
        { category: { slug: query.category } },
        { category: { name: { contains: query.category } } },
      ];
    }

    if (query.brand) {
      where.OR = [
        { brandId: query.brand },
        { brand: { slug: query.brand } },
        { brand: { name: { contains: query.brand } } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.price.lte = Number(query.maxPrice);
    }

    if (query.rating) {
      where.rating = { gte: Number(query.rating) };
    }

    if (query.inStock) {
      where.stockQuantity = { gt: 0 };
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured === true;
    }

    if (query.isBestSeller !== undefined) {
      where.isBestSeller = query.isBestSeller === true;
    }

    if (query.goal) {
      where.goalTags = { contains: query.goal };
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (query.sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (query.sortBy === 'rating') {
      orderBy = { rating: 'desc' };
    } else if (query.sortBy === 'popular') {
      orderBy = { reviewCount: 'desc' };
    } else if (query.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          category: { select: { id: true, name: true, slug: true, icon: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Parse JSON fields
    const parsedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      nutritionInfo: JSON.parse(p.nutritionInfo || '{}'),
      goalTags: JSON.parse(p.goalTags || '[]'),
      flavorOptions: JSON.parse(p.flavorOptions || '[]'),
      sizeOptions: JSON.parse(p.sizeOptions || '[]'),
    }));

    return { products: parsedProducts, total, page, limit };
  }

  static async getProductByIdOrSlug(idOrSlug: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        brand: true,
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!product) {
      throw new Error('Product not found.');
    }

    return {
      ...product,
      images: JSON.parse(product.images || '[]'),
      nutritionInfo: JSON.parse(product.nutritionInfo || '{}'),
      goalTags: JSON.parse(product.goalTags || '[]'),
      flavorOptions: JSON.parse(product.flavorOptions || '[]'),
      sizeOptions: JSON.parse(product.sizeOptions || '[]'),
    };
  }

  static async createProduct(data: any, adminId?: string) {
    const slug =
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        brandId: data.brandId,
        categoryId: data.categoryId,
        description: data.description,
        shortDescription: data.shortDescription,
        price: Number(data.price),
        discountPercent: Number(data.discountPercent || 0),
        stockQuantity: Number(data.stockQuantity || 50),
        lowStockThreshold: Number(data.lowStockThreshold || 10),
        isFeatured: Boolean(data.isFeatured),
        isBestSeller: Boolean(data.isBestSeller),
        isAvailable: data.isAvailable !== false,
        images: JSON.stringify(data.images || []),
        nutritionInfo: JSON.stringify(data.nutritionInfo || {}),
        goalTags: JSON.stringify(data.goalTags || []),
        flavorOptions: JSON.stringify(data.flavorOptions || []),
        sizeOptions: JSON.stringify(data.sizeOptions || []),
        model3dType: data.model3dType || 'standard_jar',
        model3dColor: data.model3dColor || '#10b981',
        model3dLabel: data.model3dLabel || data.name.substring(0, 16).toUpperCase(),
        verificationCode: data.verificationCode || `PV-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${data.name.substring(0, 4).toUpperCase()}`,
      },
      include: {
        brand: true,
        category: true,
      },
    });

    if (adminId) {
      await prisma.adminActivity.create({
        data: {
          adminId,
          action: 'CREATE_PRODUCT',
          targetType: 'PRODUCT',
          targetId: product.id,
          details: `Created product: ${product.name}`,
        },
      });
    }

    return product;
  }

  static async updateProduct(id: string, data: any, adminId?: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Product not found.');
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.brandId !== undefined) updateData.brandId = data.brandId;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.discountPercent !== undefined) updateData.discountPercent = Number(data.discountPercent);
    if (data.stockQuantity !== undefined) updateData.stockQuantity = Number(data.stockQuantity);
    if (data.lowStockThreshold !== undefined) updateData.lowStockThreshold = Number(data.lowStockThreshold);
    if (data.isFeatured !== undefined) updateData.isFeatured = Boolean(data.isFeatured);
    if (data.isBestSeller !== undefined) updateData.isBestSeller = Boolean(data.isBestSeller);
    if (data.isAvailable !== undefined) updateData.isAvailable = Boolean(data.isAvailable);
    if (data.model3dType !== undefined) updateData.model3dType = data.model3dType;
    if (data.model3dColor !== undefined) updateData.model3dColor = data.model3dColor;
    if (data.model3dLabel !== undefined) updateData.model3dLabel = data.model3dLabel;

    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.nutritionInfo !== undefined) updateData.nutritionInfo = JSON.stringify(data.nutritionInfo);
    if (data.goalTags !== undefined) updateData.goalTags = JSON.stringify(data.goalTags);
    if (data.flavorOptions !== undefined) updateData.flavorOptions = JSON.stringify(data.flavorOptions);
    if (data.sizeOptions !== undefined) updateData.sizeOptions = JSON.stringify(data.sizeOptions);

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { brand: true, category: true },
    });

    if (adminId) {
      await prisma.adminActivity.create({
        data: {
          adminId,
          action: 'UPDATE_PRODUCT',
          targetType: 'PRODUCT',
          targetId: updated.id,
          details: `Updated product: ${updated.name}`,
        },
      });
    }

    return updated;
  }

  static async deleteProduct(id: string, adminId?: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Product not found.');
    }

    await prisma.product.delete({ where: { id } });

    if (adminId) {
      await prisma.adminActivity.create({
        data: {
          adminId,
          action: 'DELETE_PRODUCT',
          targetType: 'PRODUCT',
          targetId: id,
          details: `Deleted product: ${existing.name}`,
        },
      });
    }

    return { message: 'Product deleted successfully.' };
  }

  static async getRecommendations(goal?: string, limit: number = 4) {
    let where: any = { isAvailable: true };
    if (goal) {
      where.goalTags = { contains: goal };
    } else {
      where.isFeatured = true;
    }

    let products = await prisma.product.findMany({
      where,
      include: { brand: true, category: true },
      take: limit,
      orderBy: { rating: 'desc' },
    });

    if (products.length < limit) {
      const more = await prisma.product.findMany({
        where: { isAvailable: true },
        include: { brand: true, category: true },
        take: limit,
        orderBy: { reviewCount: 'desc' },
      });
      products = [...products, ...more.filter((m) => !products.some((p) => p.id === m.id))].slice(0, limit);
    }

    return products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      nutritionInfo: JSON.parse(p.nutritionInfo || '{}'),
      goalTags: JSON.parse(p.goalTags || '[]'),
      flavorOptions: JSON.parse(p.flavorOptions || '[]'),
      sizeOptions: JSON.parse(p.sizeOptions || '[]'),
    }));
  }

  static async compareProducts(ids: string[]) {
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: { brand: true, category: true },
    });

    return products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      nutritionInfo: JSON.parse(p.nutritionInfo || '{}'),
      goalTags: JSON.parse(p.goalTags || '[]'),
      flavorOptions: JSON.parse(p.flavorOptions || '[]'),
      sizeOptions: JSON.parse(p.sizeOptions || '[]'),
    }));
  }
}
