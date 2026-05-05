"use client";

import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTHS_VI = ["Th.1","Th.2","Th.3","Th.4","Th.5","Th.6","Th.7","Th.8","Th.9","Th.10","Th.11","Th.12"];

type Props = {
    value: string;
    onChange: (v: string) => void;
    min?: string;
    max?: string;
    placeholder: string;
    disabled?: boolean;
    error?: boolean;
    label?: string;
};

export default function MiniDatePicker({
    value,
    onChange,
    min,
    max,
    placeholder,
    disabled = false,
    error = false,
    label,
}: Props) {
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(() => value ? parseInt(value.slice(0, 4)) : new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.slice(5, 7)) - 1 : new Date().getMonth());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selected = value ? new Date(value + "T00:00:00") : null;
    const minDate = min ? new Date(min + "T00:00:00") : null;
    const maxDate = max ? new Date(max + "T00:00:00") : null;

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
        else setViewMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
        else setViewMonth((m) => m + 1);
    };

    const selectDay = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        onChange(str);
        setOpen(false);
    };

    const isDisabled = (day: number) => {
        const d = new Date(viewYear, viewMonth, day);
        if (minDate && d < minDate) return true;
        if (maxDate && d > maxDate) return true;
        return false;
    };

    const isSelected = (day: number) =>
        !!selected &&
        selected.getFullYear() === viewYear &&
        selected.getMonth() === viewMonth &&
        selected.getDate() === day;

    const displayValue = selected
        ? `${String(selected.getDate()).padStart(2, "0")}/${String(selected.getMonth() + 1).padStart(2, "0")}/${selected.getFullYear()}`
        : placeholder;

    return (
        <div ref={ref} className="relative w-full">
            {label && (
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                className={`flex items-center gap-2 h-11 w-full rounded-md border bg-white px-4 text-sm
                           transition cursor-pointer whitespace-nowrap
                           ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                           ${error
                    ? "border-red-500 hover:border-red-300 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200 text-red-700"
                    : "border-violet-100 hover:border-violet-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 text-slate-700"
                }`}
            >
                <Calendar size={14} className={error ? "text-red-400 shrink-0" : "text-violet-300 shrink-0"} />
                <span className={`flex-1 text-left ${!selected ? "text-slate-400" : ""}`}>{displayValue}</span>
                <ChevronDown
                    size={14}
                    className={`${error ? "text-red-300" : "text-violet-300"} transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && !disabled && (
                <div className="absolute left-0 mt-1.5 bg-white border border-violet-100 rounded-md shadow-xl z-30 p-3 w-[220px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <button type="button" onClick={prevMonth} className="p-1 rounded-lg hover:bg-violet-50 transition">
                            <ChevronLeft size={13} className="text-slate-500" />
                        </button>
                        <span className="text-[11px] font-semibold text-slate-700">
                            {MONTHS_VI[viewMonth]} {viewYear}
                        </span>
                        <button type="button" onClick={nextMonth} className="p-1 rounded-lg hover:bg-violet-50 transition">
                            <ChevronRight size={13} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {WEEKDAYS.map((d) => (
                            <div key={d} className="text-center text-[9px] font-medium text-slate-400 py-0.5">{d}</div>
                        ))}
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-y-0.5">
                        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <button
                                key={day}
                                type="button"
                                disabled={isDisabled(day)}
                                onClick={() => selectDay(day)}
                                className={`text-[11px] h-7 w-full rounded-lg transition font-medium
                                    ${isSelected(day) ? "bg-violet-500 text-white" : ""}
                                    ${!isSelected(day) && !isDisabled(day) ? "hover:bg-violet-50 text-slate-700" : ""}
                                    ${isDisabled(day) ? "text-slate-300 cursor-not-allowed" : ""}
                                `}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
