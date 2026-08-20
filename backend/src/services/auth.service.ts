import prisma from '../config/db';
import { hashPassword, comparePassword, dummyPasswordCompare } from '../utils/password';
import { signToken, verifyToken } from '../utils/jwt';
import { TokenPayload } from '../types';

interface FailedAttemptRecord {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// In-memory failed login tracking for brute-force & credential stuffing defense
const failedLoginMap = new Map<string, FailedAttemptRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await hashPassword(data.password);

    // SECURITY: Public registration is ALWAYS strictly assigned the 'USER' role
    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: data.phone?.trim() || null,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        weight: true,
        height: true,
        fitnessGoal: true,
        activityLevel: true,
        dailyProteinTarget: true,
        createdAt: true,
      },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
      name: user.name,
    };

    const token = signToken(tokenPayload);

    return { user, token };
  }

  static async login(email: string, pass: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const now = Date.now();

    // 1. BRUTE-FORCE LOCKOUT CHECK
    const lockRecord = failedLoginMap.get(normalizedEmail);
    if (lockRecord && lockRecord.lockedUntil && lockRecord.lockedUntil > now) {
      const remainingMin = Math.ceil((lockRecord.lockedUntil - now) / 60000);
      throw new Error(
        `Account temporarily locked due to multiple failed login attempts. Please try again in ${remainingMin} minute(s).`
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // 2. TIMING ATTACK MITIGATION
    if (!user) {
      await dummyPasswordCompare(pass);
      this.recordFailedAttempt(normalizedEmail);
      throw new Error('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) {
      this.recordFailedAttempt(normalizedEmail);
      throw new Error('Invalid email or password.');
    }

    // 3. RESET FAILED ATTEMPTS ON SUCCESSFUL LOGIN
    failedLoginMap.delete(normalizedEmail);

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
      name: user.name,
    };

    const token = signToken(tokenPayload);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      weight: user.weight,
      height: user.height,
      fitnessGoal: user.fitnessGoal,
      activityLevel: user.activityLevel,
      dailyProteinTarget: user.dailyProteinTarget,
      createdAt: user.createdAt,
    };

    return { user: safeUser, token };
  }

  private static recordFailedAttempt(email: string) {
    const now = Date.now();
    const current = failedLoginMap.get(email) || { attempts: 0, lastAttempt: now };
    const newAttempts = current.attempts + 1;
    const isLocked = newAttempts >= MAX_FAILED_ATTEMPTS;

    failedLoginMap.set(email, {
      attempts: newAttempts,
      lastAttempt: now,
      lockedUntil: isLocked ? now + LOCKOUT_DURATION_MS : undefined,
    });
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        weight: true,
        height: true,
        fitnessGoal: true,
        activityLevel: true,
        dailyProteinTarget: true,
        createdAt: true,
        proteinGoal: true,
        addresses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }

  static async updateProfile(userId: string, data: any) {
    // Prevent modifying role or id via profile update
    const sanitizedData = { ...data };
    delete sanitizedData.role;
    delete sanitizedData.id;
    delete sanitizedData.password;
    delete sanitizedData.email;

    const user = await prisma.user.update({
      where: { id: userId },
      data: sanitizedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        weight: true,
        height: true,
        fitnessGoal: true,
        activityLevel: true,
        dailyProteinTarget: true,
        updatedAt: true,
      },
    });

    return user;
  }

  static async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Timing attack mitigation
    if (!user) {
      await dummyPasswordCompare('dummy-password');
      return { message: 'If an account exists with this email, a password reset instruction has been generated.' };
    }

    const resetToken = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      name: user.name,
    });

    return {
      message: 'If an account exists with this email, a password reset instruction has been generated.',
      resetToken,
    };
  }

  static async resetPassword(token: string, newPass: string) {
    const decoded = verifyToken(token);
    const hashedPassword = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successfully. You may now log in with your new password.' };
  }
}
