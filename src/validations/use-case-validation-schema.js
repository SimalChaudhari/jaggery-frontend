import { z as zod } from 'zod';

// Shared validation schemas for use case forms
export const useCaseFieldValidations = {
  title: zod
    .string()
    .min(1, { message: 'Title is required!' })
    .min(2, { message: 'Title must be at least 2 characters long!' })
    .max(100, { message: 'Title must not exceed 100 characters!' }),

  image: zod
    .any()
    .refine((val) => val !== null && val !== undefined, {
      message: 'Image is required!',
    }),

  imageOptional: zod.any().optional(),
};

// Use case create schema
export const UseCaseSchema = zod.object({
  title: useCaseFieldValidations.title,
  image: useCaseFieldValidations.image,
});

// Use case edit schema (image optional)
export const UseCaseEditSchema = zod.object({
  title: useCaseFieldValidations.title,
  image: useCaseFieldValidations.imageOptional,
});

