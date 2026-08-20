import prisma from '../config/db';
import { encryptBankData, decryptBankData, maskAccountNumber } from '../utils/crypto';

export class BankService {
  /**
   * Resolves a guaranteed compliant UPI VPA.
   * If an email domain (e.g. @gmail.com) was provided, falls back to standard NPCI {Account}@{IFSC}.ifsc.npci
   */
  static resolveEffectiveVpa(
    upiVpa: string | null | undefined,
    accountNumber: string,
    ifscCode: string
  ): string {
    const cleanAcc = accountNumber.replace(/\s+/g, '');
    const cleanIfsc = ifscCode.trim().toUpperCase();
    const directNpciVpa = `${cleanAcc}@${cleanIfsc}.ifsc.npci`;

    if (!upiVpa || !upiVpa.trim()) {
      return directNpciVpa;
    }

    const trimmed = upiVpa.trim();
    const lower = trimmed.toLowerCase();

    // Check if the user entered an email address instead of a banking UPI PSP handle
    const emailDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com', '@icloud.com', '@rediffmail.com'];
    const isEmail = emailDomains.some((d) => lower.endsWith(d));

    if (isEmail) {
      return directNpciVpa;
    }

    return trimmed;
  }

  /**
   * Get all registered bank accounts (Admin only)
   * Decrypts encrypted ciphertexts for admin inspection with masked defaults
   */
  static async getAllBankAccounts() {
    const banks = await prisma.bankAccount.findMany({
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });

    return banks.map((bank) => {
      const rawNum = decryptBankData(bank.accountNumber).replace(/\s+/g, '');
      const directVpa = `${rawNum}@${bank.ifscCode.trim().toUpperCase()}.ifsc.npci`;
      const effectiveVpa = BankService.resolveEffectiveVpa(bank.upiVpa, rawNum, bank.ifscCode);
      return {
        ...bank,
        accountNumber: maskAccountNumber(bank.accountNumber),
        accountNumberFull: decryptBankData(bank.accountNumber),
        effectiveVpa,
        directVpa,
      };
    });
  }

  /**
   * Get the single active Primary Bank Account for live customer checkout & QR generation
   * Only returns masked account number for public zero-trust safety
   */
  static async getActivePrimaryBank() {
    let primaryBank = await prisma.bankAccount.findFirst({
      where: { isPrimary: true, isActive: true },
    });

    if (!primaryBank) {
      primaryBank = await prisma.bankAccount.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
    }

    if (!primaryBank) {
      return null;
    }

    const decryptedAccountNumber = decryptBankData(primaryBank.accountNumber).replace(/\s+/g, '');
    const cleanIfsc = primaryBank.ifscCode.trim().toUpperCase();
    const effectiveVpa = BankService.resolveEffectiveVpa(
      primaryBank.upiVpa,
      decryptedAccountNumber,
      cleanIfsc
    );

    return {
      id: primaryBank.id,
      bankName: primaryBank.bankName,
      accountHolder: primaryBank.accountHolder,
      upiVpa: effectiveVpa,
      effectiveVpa,
      accountNumber: maskAccountNumber(primaryBank.accountNumber),
      ifscCode: cleanIfsc,
      accountType: primaryBank.accountType,
      isPrimary: primaryBank.isPrimary,
    };
  }

  /**
   * Add a new Bank Account with high level encryption security
   */
  static async addBankAccount(data: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    upiVpa?: string;
    accountType?: string;
    isPrimary?: boolean;
    branchName?: string;
  }) {
    // If set as primary, unmark any previous primary bank accounts
    if (data.isPrimary) {
      await prisma.bankAccount.updateMany({
        data: { isPrimary: false },
      });
    }

    // Check if there are no bank accounts yet, default first to primary
    const count = await prisma.bankAccount.count();
    const shouldBePrimary = data.isPrimary ?? (count === 0);

    // Encrypt sensitive account number at rest with AES-256-GCM
    const encryptedAccountNumber = encryptBankData(data.accountNumber.trim());

    const bank = await prisma.bankAccount.create({
      data: {
        bankName: data.bankName.trim(),
        accountHolder: data.accountHolder.trim(),
        accountNumber: encryptedAccountNumber,
        ifscCode: data.ifscCode.trim().toUpperCase(),
        upiVpa: data.upiVpa ? data.upiVpa.trim().toLowerCase() : undefined,
        accountType: data.accountType || 'CURRENT',
        isPrimary: shouldBePrimary,
        isActive: true,
        branchName: data.branchName?.trim() || null,
      },
    });

    return {
      ...bank,
      accountNumber: maskAccountNumber(bank.accountNumber),
      accountNumberFull: decryptBankData(bank.accountNumber),
    };
  }

  /**
   * Set a specific Bank Account as the PRIMARY Priority Settlement Bank
   */
  static async setPrimaryBank(bankId: string) {
    const target = await prisma.bankAccount.findUnique({
      where: { id: bankId },
    });

    if (!target) {
      throw new Error('Bank account not found.');
    }

    // Atomic transaction: Demote all to false, promote target to true
    await prisma.$transaction([
      prisma.bankAccount.updateMany({
        data: { isPrimary: false },
      }),
      prisma.bankAccount.update({
        where: { id: bankId },
        data: { isPrimary: true, isActive: true },
      }),
    ]);

    const updated = await prisma.bankAccount.findUnique({ where: { id: bankId } });
    if (!updated) throw new Error('Failed to fetch updated bank account.');

    return {
      ...updated,
      accountNumber: maskAccountNumber(updated.accountNumber),
      accountNumberFull: decryptBankData(updated.accountNumber),
    };
  }

  /**
   * Update Bank Account details with encryption
   */
  static async updateBankAccount(
    bankId: string,
    data: {
      bankName?: string;
      accountHolder?: string;
      accountNumber?: string;
      ifscCode?: string;
      upiVpa?: string;
      accountType?: string;
      isActive?: boolean;
      branchName?: string;
    }
  ) {
    const updatePayload: any = { ...data };
    if (data.accountNumber) {
      updatePayload.accountNumber = encryptBankData(data.accountNumber.trim());
    }
    if (data.ifscCode) {
      updatePayload.ifscCode = data.ifscCode.toUpperCase();
    }
    if (data.upiVpa) {
      updatePayload.upiVpa = data.upiVpa.toLowerCase();
    }

    const updated = await prisma.bankAccount.update({
      where: { id: bankId },
      data: updatePayload,
    });

    return {
      ...updated,
      accountNumber: maskAccountNumber(updated.accountNumber),
      accountNumberFull: decryptBankData(updated.accountNumber),
    };
  }

  /**
   * Delete a Bank Account
   */
  static async deleteBankAccount(bankId: string) {
    const bank = await prisma.bankAccount.findUnique({
      where: { id: bankId },
    });

    if (!bank) {
      throw new Error('Bank account not found.');
    }

    await prisma.bankAccount.delete({
      where: { id: bankId },
    });

    // If deleted bank was primary, promote the next available bank
    if (bank.isPrimary) {
      const nextBank = await prisma.bankAccount.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      if (nextBank) {
        await prisma.bankAccount.update({
          where: { id: nextBank.id },
          data: { isPrimary: true },
        });
      }
    }

    return { message: 'Bank account removed securely.' };
  }
}
