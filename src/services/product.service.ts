import { prisma } from '../db/prisma';
import { NotFoundError } from '../utils/errors';
import logger from '../utils/logger';

interface ProductFilters {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ProductService {
  async getAllProducts(filters: ProductFilters) {
    try {
      const {
        categoryId,
        search,
        minPrice,
        maxPrice,
        isFeatured,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filters;

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        isActive: true,
      };

      if (categoryId) {
        where.categoryId = categoryId;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) {
          where.price.gte = minPrice;
        }
        if (maxPrice !== undefined) {
          where.price.lte = maxPrice;
        }
      }

      if (isFeatured !== undefined) {
        where.isFeatured = isFeatured;
      }

      // Get products
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            reviews: {
              select: {
                rating: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        prisma.product.count({ where }),
      ]);

      // Calculate average rating for each product
      const productsWithRatings = products.map((product) => {
        const ratings = product.reviews.map((r) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        const { reviews, ...productData } = product;
        return {
          ...productData,
          averageRating: Number(avgRating.toFixed(1)),
          reviewCount: ratings.length,
        };
      });

      logger.info(`Fetched ${products.length} products`);

      return {
        products: productsWithRatings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Get products error: ${error}`);
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!product || !product.isActive) {
        throw new NotFoundError('Product not found');
      }

      // Calculate average rating
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...product,
        averageRating: Number(avgRating.toFixed(1)),
        reviewCount: ratings.length,
      };
    } catch (error) {
      logger.error(`Get product error: ${error}`);
      throw error;
    }
  }

  async getProductBySlug(slug: string) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          sku: slug,
          isActive: true,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundError('Product not found');
      }

      // Calculate average rating
      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return {
        ...product,
        averageRating: Number(avgRating.toFixed(1)),
        reviewCount: ratings.length,
      };
    } catch (error) {
      logger.error(`Get product by slug error: ${error}`);
      throw error;
    }
  }

  async getFeaturedProducts(limit: number = 10) {
    try {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          isFeatured: true,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Calculate average rating for each product
      const productsWithRatings = products.map((product) => {
        const ratings = product.reviews.map((r) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;

        const { reviews, ...productData } = product;
        return {
          ...productData,
          averageRating: Number(avgRating.toFixed(1)),
          reviewCount: ratings.length,
        };
      });

      return productsWithRatings;
    } catch (error) {
      logger.error(`Get featured products error: ${error}`);
      throw error;
    }
  }

  async getCategories() {
    try {
      const categories = await prisma.category.findMany({
        where: {
          isActive: true,
        },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        image: category.image,
        productCount: category._count.products,
      }));
    } catch (error) {
      logger.error(`Get categories error: ${error}`);
      throw error;
    }
  }

  async getCategoryBySlug(slug: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!category || !category.isActive) {
        throw new NotFoundError('Category not found');
      }

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        image: category.image,
        productCount: category._count.products,
      };
    } catch (error) {
      logger.error(`Get category error: ${error}`);
      throw error;
    }
  }
}

export const productService = new ProductService();
