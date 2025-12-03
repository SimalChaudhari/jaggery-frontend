import { z as zod } from 'zod';

// Shared validation schemas for user forms
export const userFieldValidations = {
  username: zod
    .string()
    .min(1, { message: 'Username is required!' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscore. No spaces allowed!' }),

  firstname: zod
    .string()
    .min(1, { message: 'First name is required!' })
    .regex(/^[a-zA-Z]+$/, { message: 'First name can only contain letters. No spaces, numbers, or special characters allowed!' }),

  lastname: zod
    .string()
    .min(1, { message: 'Last name is required!' })
    .regex(/^[a-zA-Z]+$/, { message: 'Last name can only contain letters. No spaces, numbers, or special characters allowed!' }),

  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),

  phoneNumber: zod
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{10,15}$/.test(val), {
      message: 'Phone number must be between 10 and 15 digits',
    }),

  mobile: zod
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10,15}$/, 'Mobile must be between 10 and 15 digits'),

  address: zod.string().optional(),
  city: zod.string().optional(),
  state: zod.string().optional(),
  country: zod.string().optional(),
  zipCode: zod.string().optional(),
  pincode: zod.string().optional(),
  status: zod.string(),
};

// Admin user form schema (create/edit)
export const NewUserSchema = zod.object({
  username: userFieldValidations.username,
  firstname: userFieldValidations.firstname,
  lastname: userFieldValidations.lastname,
  email: userFieldValidations.email,
  phoneNumber: userFieldValidations.phoneNumber,
  address: userFieldValidations.address,
  city: userFieldValidations.city,
  state: userFieldValidations.state,
  country: userFieldValidations.country,
  zipCode: userFieldValidations.zipCode,
  status: userFieldValidations.status,
});

// Quick edit form schema
export const UserQuickEditSchema = zod.object({
  username: userFieldValidations.username,
  firstname: userFieldValidations.firstname,
  lastname: userFieldValidations.lastname,
  email: userFieldValidations.email,
  phoneNumber: userFieldValidations.phoneNumber,
  address: userFieldValidations.address,
  city: userFieldValidations.city,
  state: userFieldValidations.state,
  country: userFieldValidations.country,
  zipCode: userFieldValidations.zipCode,
  status: userFieldValidations.status,
});

// Profile edit schema (optional fields)
export const ProfileSchema = zod.object({
  firstname: zod
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z]+$/.test(val), {
      message: 'First name can only contain letters. No spaces, numbers, or special characters allowed!',
    }),
  lastname: zod
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z]+$/.test(val), {
      message: 'Last name can only contain letters. No spaces, numbers, or special characters allowed!',
    }),
  username: zod
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9_]+$/.test(val), {
      message: 'Username can only contain letters, numbers, and underscore. No spaces allowed!',
    }),
  email: userFieldValidations.email,
  mobile: userFieldValidations.mobile,
  address: userFieldValidations.address,
  city: userFieldValidations.city,
  state: userFieldValidations.state,
  country: userFieldValidations.country,
  pincode: userFieldValidations.pincode,
});

