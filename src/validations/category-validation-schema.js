import { z as zod } from 'zod';

// Shared validation schemas for category forms
export const categoryFieldValidations = {
  title: zod
    .string()
    .min(1, { message: 'Title is required!' })
    .min(2, { message: 'Title must be at least 2 characters long!' })
    .max(100, { message: 'Title must not exceed 100 characters!' }),

  description: zod
    .string()
    .min(1, { message: 'Description is required!' })
    .min(10, { message: 'Description must be at least 10 characters long!' }),

  parentCategory: zod.string().optional(),

  image: zod
    .any()
    .refine((val) => val !== null && val !== undefined, {
      message: 'Image is required!',
    }),

  imageOptional: zod.any().optional(),
};

// Category create schema
export const CategorySchema = zod.object({
  title: categoryFieldValidations.title,
  description: categoryFieldValidations.description,
  parentCategory: categoryFieldValidations.parentCategory,
  image: categoryFieldValidations.image,
});

// Category edit schema (image optional)
export const CategoryEditSchema = zod.object({
  title: categoryFieldValidations.title,
  description: categoryFieldValidations.description,
  parentCategory: categoryFieldValidations.parentCategory,
  image: categoryFieldValidations.imageOptional,
});

