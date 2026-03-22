// Matches DB enum: incident_status
export type IncidentStatus = "open" | "in_progress" | "resolved";

// Matches DB enum: priority_level
export type PriorityLevel = "low" | "medium" | "high";

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  open: "Abierta",
  in_progress: "En proceso",
  resolved: "Resuelta",
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

export type StatusFilter = IncidentStatus | null;
export type PriorityFilter = PriorityLevel | null;

export interface IncidentFilters {
  status: StatusFilter;
  priority: PriorityFilter;
}

export const DEFAULT_FILTERS: IncidentFilters = {
  status: null,
  priority: null,
};
