import { z } from 'zod';

const opportunityCreationSchema = z.object({
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

export default opportunityCreationSchema;
