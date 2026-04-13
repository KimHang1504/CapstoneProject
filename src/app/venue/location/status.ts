export type LocationStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "DRAFTED";

export type LocationDisplayStatus =
  | LocationStatus
  | "REJECTED"
  | "CLOSED"
  | "EXPIRED";