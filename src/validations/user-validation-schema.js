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

  phoneNumber: zod
    .string()
    .min(1, { message: 'Phone number is required!' })
    .regex(/^[0-9]{10}$/, { message: 'Phone number must be between 10 digits' }),
    // .regex(/^[0-9]{10,15}$/, { message: 'Phone number must be between 10 and 15 digits' }),

  mobile: zod
    .string()
    .min(1, { message: 'Mobile number is required!' })
    .regex(/^[0-9]{10}$/, { message: 'Mobile must be between 10 digits' }),
    // .regex(/^[0-9]{10,15}$/, { message: 'Mobile must be between 10 and 15 digits' }),

  address: zod
    .string()
    .min(1, { message: 'Address is required!' })
    .min(3, { message: 'Address must be at least 3 characters long!' }),
  city: zod
    .string()
    .min(1, { message: 'City is required!' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'City can only contain letters and spaces!' }),
  state: zod
    .string()
    .min(1, { message: 'State is required!' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'State can only contain letters and spaces!' }),
  country: zod
    .string()
    .min(1, { message: 'Country is required!' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Country can only contain letters and spaces!' }),
  zipCode: zod
    .string()
    .min(1, { message: 'Zip code is required!' })
    .regex(/^[0-9]{4,10}$/, { message: 'Zip code must be between 4 and 10 digits!' }),
  pincode: zod
    .string()
    .min(1, { message: 'Pincode is required!' })
    .regex(/^[0-9]{4,10}$/, { message: 'Pincode must be between 4 and 10 digits!' }),
  status: zod.string(),
  // Optional versions for admin forms
  addressOptional: zod
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      return val.trim().length >= 3; // Minimum length
    }, {
      message: 'Address must be at least 3 characters long!',
    }),
  cityOptional: zod
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      return /^[a-zA-Z\s]+$/.test(val.trim()); // Only letters and spaces
    }, {
      message: 'City can only contain letters and spaces!',
    }),
  stateOptional: zod
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      return /^[a-zA-Z\s]+$/.test(val.trim()); // Only letters and spaces
    }, {
      message: 'State can only contain letters and spaces!',
    }),
  countryOptional: zod
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      return /^[a-zA-Z\s]+$/.test(val.trim()); // Only letters and spaces
    }, {
      message: 'Country can only contain letters and spaces!',
    }),
  pincodeOptional: zod
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      return /^[0-9]{4,10}$/.test(val.trim()); // 4-10 digits
    }, {
      message: 'Pincode must be between 4 and 10 digits!',
    }),
  // addressOptional: zod.string().optional(),
  // cityOptional: zod.string().optional(),
  // stateOptional: zod.string().optional(),
  // countryOptional: zod.string().optional(),
  // zipCodeOptional: zod.string().optional(),
  // pincodeOptional: zod.string().optional(),
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

// Profile edit schema
export const ProfileSchema = zod.object({
  firstname: userFieldValidations.firstname,
  lastname: userFieldValidations.lastname,
  username: userFieldValidations.username,
  email: userFieldValidations.email,
  mobile: userFieldValidations.mobile,
  address: userFieldValidations.address,
  city: userFieldValidations.city,
  state: userFieldValidations.state,
  country: userFieldValidations.country,
  pincode: userFieldValidations.pincode,
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

