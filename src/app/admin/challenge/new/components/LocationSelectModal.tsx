"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Plus, Search, X } from "lucide-react";
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

      <div className="bg-white w-275 max-h-[80vh] rounded-2xl shadow-lg flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-violet-100">

          <h2 className="text-xl font-semibold text-gray-800">
            Chọn địa điểm
          </h2>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 transition">
            <X size={24} />
          </button>

        </div>


        {/* SEARCH */}
        <div className="p-4 border-b border-violet-100">

          <div className="flex items-center gap-3 border border-violet-200 rounded-xl px-4 py-3 bg-white hover:border-violet-300 transition">

            <Search size={18} className="text-violet-500" />

            <input
              placeholder="Tìm kiếm địa điểm..."
              className="outline-none w-full bg-transparent text-sm placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>


        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">

          {selected.length > 0 && (

            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6">

              <p className="font-medium text-gray-800 mb-3">
                Đã chọn ({selected.length})
              </p>

              <div className="flex flex-wrap gap-2">

                {selected.map((v) => (

                  <div
                    key={v.id}
                    className="bg-white px-3 py-2 rounded-lg flex items-center gap-2 border border-violet-200 text-sm font-medium text-gray-700 hover:border-violet-300 transition"
                  >

                    {v.name}

                    <button
                      className="text-red-500 hover:text-red-700 ml-1"
                      onClick={() => handleRemove(v.id)}
                    >
                      <X size={16} />
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

              const isSelected = selected.some(v => v.id === location.id);

              return (

                <div
                  key={location.id}
                  className={`bg-white border-2 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer ${isSelected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-gray-200 hover:border-violet-300'}`}
                >

                  <div className="relative h-36">

                    <Image
                      src={image}
                      alt={location.name}
                      fill
                      className="object-cover"
                    />

                    {location.isOpenNow && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Đang mở</div>
                    )}

                  </div>

                  <div className="p-3 space-y-2">

                    <p className="font-semibold text-sm text-gray-800 line-clamp-2">
                      {location.name}
                    </p>

                    <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
                      <MapPin size={12} />
                      {location.address}
                    </p>

                    <p className="text-xs text-gray-500">
                      {location.venueOwnerName}
                    </p>

                    <button
                      onClick={() => handleAdd(location)}
                      disabled={isSelected}
                      className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${isSelected ? 'bg-violet-100 text-violet-600 cursor-not-allowed' : 'bg-linear-to-r from-violet-500 to-purple-600 text-white hover:shadow-md'}`}
                    >
                      {isSelected ? (
                        <>✓ Đã chọn</>
                      ) : (
                        <>
                          <Plus size={14} />
                          Thêm
                        </>
                      )}
                    </button>

                  </div>

                </div>

              );

            })}

          </div>

        </div>


        {/* FOOTER */}
        <div className="p-4 border-t border-violet-100 bg-gray-50 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border border-violet-200 text-violet-600 rounded-lg hover:bg-violet-50 transition font-medium text-sm"
          >
            Huỷ
          </button>

          <button
            onClick={handleConfirm}
            disabled={selected.length === 0}
            className="px-4 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition font-medium text-sm"
          >
            Thêm {selected.length > 0 ? `(${selected.length})` : ''}
          </button>

        </div>

      </div>

    </div>

  );
}