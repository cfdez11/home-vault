export type CompanyCategory =
  | "electricista"
  | "fontanero"
  | "climatizacion"
  | "albanileria"
  | "limpieza"
  | "otros";

export type IncidentStatus = "none" | "open" | null;

export interface CompanyFilters {
  categories: CompanyCategory[];
  incidentStatus: IncidentStatus;
}

export const DEFAULT_FILTERS: CompanyFilters = {
  categories: [],
  incidentStatus: null,
};

export const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  electricista: "Electricista",
  fontanero: "Fontanero",
  climatizacion: "Climatización",
  albanileria: "Albañilería",
  limpieza: "Limpieza",
  otros: "Otros",
};
