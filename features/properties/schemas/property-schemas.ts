import { z } from "zod";

const currentYear = new Date().getFullYear();

export const propertySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  type: z.enum(["apartment", "house", "condominium", "other"]).nullable().optional(),
  size: z
    .string()
    .optional()
    .refine((v) => !v || (Number(v) > 0 && !isNaN(Number(v))), "Debe ser mayor que 0"),
  year: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        (Number.isInteger(Number(v)) &&
          Number(v) >= 1800 &&
          Number(v) <= currentYear),
      `Debe ser un año entre 1800 y ${currentYear}`,
    ),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const documentSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  type: z.enum(["deed", "insurance", "invoice", "other"]),
  date: z.string().min(1, "La fecha es obligatoria"),
  url: z.string().min(1, "La URL es obligatoria"),
  notes: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;
