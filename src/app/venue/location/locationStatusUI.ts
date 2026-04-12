// /domain/location/locationStatusUI.ts

import { LocationStatusInput, resolveLocationStatus } from "./resolver";
import { locationStatusMeta } from "./locationStatusMeta";

export function getLocationStatusUI(loc: LocationStatusInput) {
  const status = resolveLocationStatus(loc);

  return {
    status,
    ...locationStatusMeta[status],
  };
}