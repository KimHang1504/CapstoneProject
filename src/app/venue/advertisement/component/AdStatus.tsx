import { Advertisement } from "@/api/venue/advertisement/type";

export type FEAdStatus =
    | "DRAFT"
    | "PENDING"
    | "REJECTED"
    | "APPROVED"
    | "RUNNING"
    | "EXPIRED";

export function getAdStatus(ad: Advertisement): FEAdStatus {
    const now = new Date();

    if (ad.status === "DRAFT") return "DRAFT";
    if (ad.status === "PENDING") return "PENDING";
    if (ad.status === "REJECTED") return "REJECTED";

    if (ad.status === "APPROVED") {
        const venues = ad.venueLocationAds ?? [];

        const isRunning = venues.some(v =>
            v.status === "ACTIVE" &&
            new Date(v.startDate) <= now &&
            new Date(v.endDate) > now
        );

        if (isRunning) return "RUNNING";

        const isExpired = venues.length > 0 && venues.every(v =>
            new Date(v.endDate) <= now
        );

        if (isExpired) return "EXPIRED";

        return "APPROVED";
    }

    return "DRAFT";
}