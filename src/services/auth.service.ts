import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import config from '../config';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../utils/errors';
import logger from '../utils/logger';

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async signup(data: SignupData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      // Create empty cart for user
      await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });

      // Generate tokens
      const accessToken = this.generateAccessToken(user.id, user.email, user.role);
      const refreshToken = await this.generateRefreshToken(user.id);

      logger.info(`New user registered: ${user.email}`);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error(`Signup error: ${error}`);
      throw error;
    }
  }

  async login(data: LoginData) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedError('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user.id, user.email, user.role);
      const refreshToken = await this.generateRefreshToken(user.id);

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error(`Login error: ${error}`);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      jwt.verify(refreshToken, config.jwt.refreshSecret);

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        throw new UnauthorizedError('Refresh token expired');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role
      );

      return { accessToken };
    } catch (error) {
      logger.error(`Refresh token error: ${error}`);
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      // Delete refresh token from database
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      logger.info('User logged out');
    } catch (error) {
      logger.error(`Logout error: ${error}`);
      throw error;
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      logger.error(`Get profile error: ${error}`);
      throw error;
    }
  }

  async updateProfile(userId: string, data: Partial<SignupData>) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
        },
      });

      logger.info(`User profile updated: ${user.email}`);

      return user;
    } catch (error) {
      logger.error(`Update profile error: ${error}`);
      throw error;
    }
  }

  private generateAccessToken(id: string, email: string, role: string): string {
    // @ts-expect-error - JWT sign types are complex, this is valid usage
    return jwt.sign({ id, email, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    // @ts-expect-error - JWT sign types are complex, this is valid usage
    const token = jwt.sign({ id: userId }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }
}

export const authService = new AuthService();
