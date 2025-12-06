import { z as zod } from 'zod';

// Shared validation schemas for address forms - can be used anywhere in the app
export const addressFieldValidations = {
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

  pincode: zod
    .string()
    .min(1, { message: 'Pincode is required!' })
    .regex(/^[0-9]{4,10}$/, { message: 'Pincode must be between 4 and 10 digits!' }),

  label: zod
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === '') return true; // Allow empty
      return val.trim().length >= 2; // Minimum length if provided
    }, {
      message: 'Label must be at least 2 characters long!',
    }),

  isDefault: zod.boolean().optional(),
};

// Address form schema (for create/edit)
export const AddressSchema = zod.object({
  address: addressFieldValidations.address,
  city: addressFieldValidations.city,
  state: addressFieldValidations.state,
  country: addressFieldValidations.country,
  pincode: addressFieldValidations.pincode,
  label: addressFieldValidations.label,
  isDefault: addressFieldValidations.isDefault,
});

