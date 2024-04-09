import { z } from 'zod';

// Password pattern
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{8,}$/;

export const updateUserDataSchema = z.object({
  givenName: z
    .string({
      required_error: 'Given name is required',
    })
    .trim(),
  familyName: z
    .string({
      required_error: 'Family name is required',
    })
    .trim(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .trim()
    .email({ message: 'Email not valid' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .trim()
    .refine((value) => passwordPattern.test(value), {
      message:
        'Password must be at least 8 characters and include 1 number, 1 capital letter & 1 special character',
    }),
});

export const manageBalanceSchema = z.object({
  balance: z
    .number({
      required_error: 'Balance is required',
    })
    .refine((amount) => amount > 0, {
      message: 'Amount must be greater than 0',
    }),
});
