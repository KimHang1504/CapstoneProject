import { JwtPayload } from "@/api/auth/type";
import { jwtDecode } from "jwt-decode";

export const getUserFromToken = (token: string) => {
  const decoded = jwtDecode<JwtPayload>(token);
console.log(decoded);
  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    assignedVenueLocationId: decoded.assigned_venue_location_id,
  };
};