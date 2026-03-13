"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, User, Plus, Search, X } from "lucide-react";
import { Location, LocationPagination, LocationRequest } from "@/api/admin/type";
import { getLocations } from "@/api/admin/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (locations: Location[]) => void;
};

export default function LocationSelectModal({ open, onClose, onConfirm }: Props) {

  const [data, setData] = useState<LocationPagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Location[]>([]);

  useEffect(() => {
    if (open) fetchLocations();
  }, [page, search, open]);

  const fetchLocations = async () => {

    const body: LocationRequest = {
      page,
      pageSize: 9,
      query: search
    };

    const res = await getLocations(body);

    setData(res.data.recommendations);
  };

  const handleAdd = (location: Location) => {

    if (selected.find((v) => v.id === location.id)) return;

    setSelected([...selected, location]);
  };

  const handleRemove = (id: number) => {
    setSelected(selected.filter((v) => v.id !== id));
  };

  const handleConfirm = () => {
    onConfirm(selected);
    onClose();
  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-275 max-h-[80vh] rounded-xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">

          <h2 className="text-xl font-semibold">
            Chọn địa điểm
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>


        {/* SEARCH */}
        <div className="p-4 border-b">

          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-80">

            <Search size={16} />

            <input
              placeholder="Search location..."
              className="outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>


        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {selected.length > 0 && (

            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6">

              <p className="font-medium mb-2">
                Địa điểm đã chọn
              </p>

              <div className="flex flex-wrap gap-2">

                {selected.map((v) => (

                  <div
                    key={v.id}
                    className="bg-white px-3 py-1 rounded-lg flex items-center gap-2 border text-sm"
                  >

                    {v.name}

                    <button
                      className="text-red-500"
                      onClick={() => handleRemove(v.id)}
                    >
                      ✕
                    </button>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* GRID */}
          <div className="grid grid-cols-3 gap-5">

            {data?.items.map((location) => {

              const image =
                location.coverImage?.[0] ??
                "https://placehold.co/600x400";

              return (

                <div
                  key={location.id}
                  className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition"
                >

                  <div className="relative h-36">

                    <Image
                      src={image}
                      alt={location.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  <div className="p-3 space-y-1">

                    <p className="font-semibold text-sm">
                      {location.name}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} />
                      {location.address}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <User size={12} />
                      {location.venueOwnerName}
                    </p>

                    <div className="flex justify-between items-center pt-2">

                      <span
                        className={`text-xs px-2 py-1 rounded ${location.isOpenNow
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {location.isOpenNow ? "Đang mở" : "Đóng"}
                      </span>

                      <button
                        onClick={() => handleAdd(location)}
                        className="cursor-pointer text-xs bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Thêm
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        </div>


        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="bg-violet-600 text-white px-5 py-2 rounded-lg"
          >
            Thêm ({selected.length})
          </button>

        </div>

      </div>

    </div>

  );
}