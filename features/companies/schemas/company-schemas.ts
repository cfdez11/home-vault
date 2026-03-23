import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  phone: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Introduce un email válido",
    ),
  category: z
    .enum([
      "electricista",
      "fontanero",
      "climatizacion",
      "albanileria",
      "limpieza",
      "otros",
    ])
    .nullable()
    .optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;
