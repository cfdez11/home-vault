import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  status: z.enum(["open", "in_progress", "resolved"]),
  priority: z.enum(["low", "medium", "high"]).nullable().optional(),
  date: z.string().min(1, "La fecha es obligatoria"),
  cost: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0),
      "Debe ser un número válido",
    ),
  companyName: z.string().optional(),
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;
