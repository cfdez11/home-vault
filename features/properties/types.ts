export type PropertyType =
  | "apartamento"
  | "casa"
  | "condominio"
  | "chalet"
  | "otros";

export type IncidentStatus = "none" | "open" | "solved" | null;

export interface PropertyFilters {
  types: PropertyType[];
  incidentStatus: IncidentStatus;
}

export const DEFAULT_FILTERS: PropertyFilters = {
  types: [],
  incidentStatus: null,
};
