// Matches DB enum: property_type
export type PropertyType = "apartment" | "house" | "condominium" | "other";

// Filter-only concept (not stored in DB)
export type IncidentStatus = "none" | "open" | "resolved" | null;

export interface PropertyFilters {
  types: PropertyType[];
  incidentStatus: IncidentStatus;
}

export const DEFAULT_FILTERS: PropertyFilters = {
  types: [],
  incidentStatus: null,
};
