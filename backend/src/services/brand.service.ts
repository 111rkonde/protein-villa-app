import prisma from '../config/db';

export class BrandService {
  static async getAll() {
    return prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async create(data: { name: string; logo?: string; description?: string; website?: string }) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return prisma.brand.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo,
        description: data.description,
        website: data.website,
      },
    });
  }

  static async update(id: string, data: any) {
    return prisma.brand.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.brand.delete({ where: { id } });
  }
}
