import { z as zod } from 'zod';

// Shared validation schemas for user forms - can be used anywhere in the app
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

  mobile: zod
    .string()
    .min(1, { message: 'Mobile number is required!' })
    .regex(/^[0-9]{10}$/, { message: 'Mobile must be 10 digits' }),

  status: zod.string(),
};

// Admin user form schema (create/edit)
export const NewUserSchema = zod.object({
  username: userFieldValidations.username,
  firstname: userFieldValidations.firstname,
  lastname: userFieldValidations.lastname,
  email: userFieldValidations.email,
  mobile: userFieldValidations.mobile,
  status: userFieldValidations.status,
});

// Quick edit form schema
export const UserQuickEditSchema = zod.object({
  username: userFieldValidations.username,
  firstname: userFieldValidations.firstname,
  lastname: userFieldValidations.lastname,
  email: userFieldValidations.email,
  mobile: userFieldValidations.mobile,
  status: userFieldValidations.status,
});

// Profile edit schema
export const ProfileSchema = zod.object({
  firstname: userFieldValidations.firstname,
  lastname: userFieldValidations.lastname,
  username: userFieldValidations.username,
  email: userFieldValidations.email,
  mobile: userFieldValidations.mobile,
});

// Sign-up form schema (for registration)
export const SignUpSchema = zod.object({
  username: userFieldValidations.username,
  firstName: userFieldValidations.firstname, // Note: camelCase for frontend
  lastName: userFieldValidations.lastname, // Note: camelCase for frontend
  email: userFieldValidations.email,
  mobile: userFieldValidations.mobile,
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

