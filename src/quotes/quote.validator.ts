import { z } from "zod";

export const createQuoteSchema = z.object({
  address: z.string().min(5),
  monthlyConsumptionKwh: z.number().positive(),
  systemSizeKw: z.number().positive(),
  downPayment: z.number().min(0).default(0),
});
