"use client";

import { useEffect, useState } from "react";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

type Props = {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onClose: () => void;
};

export default function SelectLocationModal({
  selectedIds,
  onChange,
  onClose,
}: Props) {
  const [locations, setLocations] = useState<MyVenueLocation[]>([]);
  const [tempSelected, setTempSelected] = useState<number[]>(selectedIds);

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await getMyVenueLocations();

      const active = res.filter(
        (l) => l.status === "ACTIVE"
      );

      setLocations(active);
    };

    fetchLocations();
  }, []);

  const toggle = (id: number) => {
    if (tempSelected.includes(id)) {
      setTempSelected(tempSelected.filter((i) => i !== id));
    } else {
      setTempSelected([...tempSelected, id]);
    }
  };

  const confirm = () => {
    onChange(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-100">

        <h2 className="text-lg font-semibold mb-4">
          Select locations
        </h2>

        <div className="space-y-2 max-h-75 overflow-y-auto">
          {locations.map((loc) => (
            <label key={loc.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={tempSelected.includes(loc.id)}
                onChange={() => toggle(loc.id)}
              />
              {loc.name}
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={confirm}>Confirm</button>
        </div>

      </div>
    </div>
  );
}