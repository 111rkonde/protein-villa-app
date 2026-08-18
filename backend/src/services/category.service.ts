import prisma from '../config/db';

export class CategoryService {
  static async getAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isAvailable: true },
          take: 12,
        },
      },
    });
  }

  static async create(data: { name: string; description?: string; image?: string; icon?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        icon: data.icon,
      },
    });
  }

  static async update(id: string, data: { name?: string; description?: string; image?: string; icon?: string }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
