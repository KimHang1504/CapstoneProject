import { LocationDisplayStatus } from "@/app/venue/location/status";
export type LocationStatusInput = {
    status: string;
    rejectionDetails?: { reason: string }[] | null;
};
export function resolveLocationStatus(
    loc: LocationStatusInput
): LocationDisplayStatus {
    const hasRejection = !!loc.rejectionDetails?.length;

    if (loc.status === "DRAFTED" && hasRejection) {
        return "REJECTED";
    }

    if (loc.status === "INACTIVE") {
        return hasRejection ? "CLOSED" : "EXPIRED";
    }

    return loc.status as LocationDisplayStatus;
}