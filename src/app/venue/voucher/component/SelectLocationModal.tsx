"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getMyVenueLocations } from "@/api/venue/location/api";
import { MyVenueLocation } from "@/api/venue/location/type";

type Props = {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  onClose: () => void;
};

export default function SelectVenueModal({ selectedIds, onChange, onClose }: Props) {
  const [locations, setLocations] = useState<MyVenueLocation[]>([]);
  const [tempSelected, setTempSelected] = useState<number[]>([]);

  useEffect(() => {
    setTempSelected(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getMyVenueLocations();
        const active = res.filter((l) => l.status === "ACTIVE");
        setLocations(active);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  const toggle = (id: number) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirm = () => {
    onChange(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-violet-50 to-purple-50">
          <h2 className="text-base font-semibold text-violet-900">
            Chọn địa điểm
          </h2>
          <p className="text-xs text-violet-500 mt-1">
            Đã chọn {tempSelected.length} / {locations.length}
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {locations.length === 0 ? (
            <div className="text-center py-10 text-violet-300 text-sm">
              Không có địa điểm đang hoạt động
            </div>
          ) : (
            locations.map((loc) => {
              const isSelected = tempSelected.includes(loc.id);

              return (
                <label
                  key={loc.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
                                    ${isSelected
                      ? "border-violet-300 bg-violet-50"
                      : "border-gray-200 hover:bg-violet-50/40"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(loc.id)}
                    className="sr-only"
                  />

                  {/* checkbox pastel */}
                  <div className={`w-4 h-4 rounded border flex items-center justify-center
                                        ${isSelected
                      ? "bg-violet-400 border-violet-400"
                      : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </div>

                  {/* image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-violet-50 shrink-0">
                    <Image
                      src={loc.coverImage?.[0] || "/placeholder.png"}
                      alt={loc.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* info */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate
                                            ${isSelected ? "text-violet-900" : "text-gray-800"}`}
                    >
                      {loc.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {loc.address}
                    </p>
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 flex gap-3 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-violet-100 text-violet-600 hover:bg-violet-50 text-sm"
          >
            Hủy
          </button>

          <button
            onClick={confirm}
            disabled={tempSelected.length === 0}
            className="flex-1 py-2 rounded-lg bg-violet-400 hover:bg-violet-500 text-white text-sm disabled:opacity-40"
          >
            Xác nhận
          </button>
        </div>

      </div>
    </div>
  );
}