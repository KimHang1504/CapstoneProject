"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusDropdownProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}

const statusOptions: StatusOption[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Đang chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Bị từ chối" },
  // DRAFT, ACTIVE, INACTIVE statuses are excluded from admin view
];

export default function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = statusOptions.find((opt) => opt.value === (value || ""));
  const displayLabel = selectedOption?.label || "Tất cả trạng thái";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue || undefined);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer justify-between gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition min-w-[200px]"
      >
        <span className="text-sm text-gray-700">{displayLabel}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {statusOptions.map((option) => {
            const isSelected = option.value === (value || "");
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left cursor-pointer hover:bg-pink-50 transition ${
                  isSelected ? "bg-pink-50 text-pink-600 font-medium" : "text-gray-700"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={16} className="text-pink-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
