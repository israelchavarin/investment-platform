import { z } from 'zod';

const investmentSchema = z.object({
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

export default investmentSchema;
