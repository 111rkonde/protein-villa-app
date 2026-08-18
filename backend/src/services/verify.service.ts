import prisma from '../config/db';

export class VerifyService {
  static async verifyCode(code: string) {
    const formatted = code.toUpperCase().trim();

    const record = await prisma.verificationCode.findUnique({
      where: { code: formatted },
    });

    if (!record) {
      return {
        isAuthentic: false,
        code: formatted,
        message: 'Authenticity Verification Failed. This serial code is not registered in the Protein Villa central database. Beware of counterfeit products.',
      };
    }

    // Increment verification count
    const updated = await prisma.verificationCode.update({
      where: { id: record.id },
      data: {
        verificationCount: { increment: 1 },
        lastVerifiedAt: new Date(),
      },
    });

    let product = null;
    if (record.productId) {
      product = await prisma.product.findUnique({
        where: { id: record.productId },
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
          rating: true,
        },
      });
    }

    return {
      isAuthentic: true,
      code: updated.code,
      productName: updated.productName,
      batchNumber: updated.batchNumber,
      manufactureDate: updated.manufactureDate,
      expiryDate: updated.expiryDate,
      labTestPdfUrl: updated.labTestPdfUrl || 'https://www.proteinvilla.demo/certificates/lab-report-cert.pdf',
      verificationCount: updated.verificationCount,
      lastVerifiedAt: updated.lastVerifiedAt,
      product: product
        ? {
            ...product,
            images: JSON.parse(product.images || '[]'),
          }
        : null,
      message: '✓ 100% Genuine Certified. This product has passed rigorous 3rd-party HPLC purity lab testing.',
    };
  }
}
