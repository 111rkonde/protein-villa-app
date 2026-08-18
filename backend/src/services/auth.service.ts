import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { TokenPayload } from '../types';

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        phone: data.phone,
        role: data.role || 'USER',
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
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    const isMatch = await comparePassword(pass, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

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
    const user = await prisma.user.update({
      where: { id: userId },
      data,
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
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // We don't reveal if user doesn't exist for security
    if (!user) {
      return { message: 'If an account exists, a reset link has been generated.' };
    }

    // In a real environment, send email. Here return a demo reset token
    const resetToken = signToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      name: user.name,
    });

    return {
      message: 'Password reset link generated.',
      resetToken, // Provided for easy development / demo testing
    };
  }

  static async resetPassword(token: string, newPass: string) {
    const { verifyToken } = await import('../utils/jwt');
    const decoded = verifyToken(token);
    const hashedPassword = await hashPassword(newPass);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successfully. You may now log in with your new password.' };
  }
}
