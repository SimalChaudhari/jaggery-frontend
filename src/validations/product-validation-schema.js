import { z as zod } from 'zod';

// Shared validation schemas for product forms
export const productFieldValidations = {
  title: zod
    .string()
    .min(1, { message: 'Title is required!' })
    .min(2, { message: 'Title must be at least 2 characters long!' })
    .max(200, { message: 'Title must not exceed 200 characters!' }),

  description: zod
    .string()
    .min(1, { message: 'Description is required!' })
    .min(10, { message: 'Description must be at least 10 characters long!' }),

  benefits: zod
    .string()
    .min(1, { message: 'Benefits is required!' })
    .min(10, { message: 'Benefits must be at least 10 characters long!' }),

  ingredients: zod
    .string()
    .min(1, { message: 'Ingredients is required!' })
    .min(5, { message: 'Ingredients must be at least 5 characters long!' }),

  storageConditions: zod
    .string()
    .min(1, { message: 'Storage conditions is required!' })
    .min(5, { message: 'Storage conditions must be at least 5 characters long!' }),

  actualPrice: zod
    .number()
    .min(0, { message: 'Actual price must be greater than or equal to 0' })
    .refine((val) => val >= 0, {
      message: 'Actual price cannot be negative!',
    }),

  discountPrice: zod
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: 'Discount price cannot be negative!',
    }),

  isSale: zod.boolean().default(false),

  inStock: zod.boolean().default(true),

  categories: zod
    .array(zod.string())
    .min(1, { message: 'At least one category is required!' }),

  useCases: zod
    .array(zod.string())
    .min(1, { message: 'At least one use case is required!' }),

  sizes: zod
    .array(zod.string())
    .min(1, { message: 'At least one size is required!' }),

  sizePrices: zod
    .array(
      zod.object({
        sizeId: zod.string().min(1, { message: 'Size ID is required!' }),
        actualPrice: zod
          .number()
          .min(0, { message: 'Size actual price must be greater than or equal to 0' }),
        discountPrice: zod
          .number()
          .optional()
          .refine((val) => val === undefined || val >= 0, {
            message: 'Size discount price cannot be negative!',
          }),
      })
    )
    .min(1, { message: 'At least one size price is required!' }),

  images: zod
    .array(zod.any())
    .min(1, { message: 'At least one image is required!' }),

  imagesOptional: zod.array(zod.any()).optional(),
};

// Product create schema
export const ProductSchema = zod.object({
  title: productFieldValidations.title,
  description: productFieldValidations.description,
  benefits: productFieldValidations.benefits,
  ingredients: productFieldValidations.ingredients,
  storageConditions: productFieldValidations.storageConditions,
  actualPrice: productFieldValidations.actualPrice,
  discountPrice: productFieldValidations.discountPrice,
  isSale: productFieldValidations.isSale,
  inStock: productFieldValidations.inStock,
  categories: productFieldValidations.categories,
  useCases: productFieldValidations.useCases,
  sizes: productFieldValidations.sizes,
  sizePrices: productFieldValidations.sizePrices,
  images: productFieldValidations.images,
});

// Product edit schema (images optional)
export const ProductEditSchema = zod.object({
  title: productFieldValidations.title,
  description: productFieldValidations.description,
  benefits: productFieldValidations.benefits,
  ingredients: productFieldValidations.ingredients,
  storageConditions: productFieldValidations.storageConditions,
  actualPrice: productFieldValidations.actualPrice,
  discountPrice: productFieldValidations.discountPrice,
  isSale: productFieldValidations.isSale,
  inStock: productFieldValidations.inStock,
  categories: productFieldValidations.categories,
  useCases: productFieldValidations.useCases,
  sizes: productFieldValidations.sizes,
  sizePrices: productFieldValidations.sizePrices,
  images: productFieldValidations.imagesOptional,
});

