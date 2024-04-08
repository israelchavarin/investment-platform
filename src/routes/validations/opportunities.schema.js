import { z } from 'zod';

export const opportunityCreationSchema = z.object({
  opportunityReference: z
    .string({
      required_error: 'Reference is required',
    })
    .trim(),
  investmentGoal: z
    .number({
      required_error: 'Goal is required',
    })
    .refine((amount) => amount > 0, {
      message: 'Goal must be greater than 0',
    }),
  limitToInvestPerTransaction: z
    .number({
      required_error: 'Limit is required',
    })
    .refine((amount) => amount > 0, {
      message: 'Limit must be greater than 0',
    }),
});

export const investmentSchema = z.object({
  opportunityReference: z
    .string({
      required_error: 'Reference is required',
    })
    .trim(),
  investmentAmount: z
    .number({
      required_error: 'Amount is required',
    })
    .refine((amount) => amount > 0, {
      message: 'Amount must be greater than 0',
    }),
});
