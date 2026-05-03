"use client";

import { Funnel, RotateCcw, Search, ChevronDown, Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type Props = {
    defaultValues: {
        page: number;
        size: number;
        status: string;
        fromDate: string;
        toDate: string;
        sortBy: "createdAt" | "updatedAt";
        orderBy: "asc" | "desc";
    };
};

// ── Custom Dropdown ──────────────────────────────────────────────
function CustomDropdown<T extends string>({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: T;
    onChange: (v: T) => void;
    options: { label: string; value: T }[];
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const selected = options.find((o) => o.value === value);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 h-11 w-full rounded-md border border-violet-100 bg-white px-4 text-sm
                           hover:border-violet-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200
                           transition cursor-pointer text-slate-700 whitespace-nowrap"
            >
                <span className="flex-1 text-left">{selected?.label ?? placeholder}</span>
                <ChevronDown
                    size={14}
                    className={`text-violet-300 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 mt-1.5 bg-white border border-violet-100 rounded-md shadow-lg z-30 overflow-hidden min-w-full">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition
                                ${opt.value === value
                                    ? "bg-violet-50 text-violet-600 font-medium"
                                    : "text-slate-700 hover:bg-violet-50"
                                }`}
                        >
                            {opt.label}
                            {opt.value === value && <Check size={13} className="text-violet-500 shrink-0 ml-3" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Mini Date Picker ─────────────────────────────────────────────
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTHS_VI = ["Th.1","Th.2","Th.3","Th.4","Th.5","Th.6","Th.7","Th.8","Th.9","Th.10","Th.11","Th.12"];

function MiniDatePicker({
    value,
    onChange,
    min,
    max,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    min?: string;
    max?: string;
    placeholder: string;
}) {
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
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 h-11 w-full rounded-md border border-violet-100 bg-white px-4 text-sm
                           hover:border-violet-300 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200
                           transition cursor-pointer text-slate-700 whitespace-nowrap"
            >
                <Calendar size={14} className="text-violet-300 shrink-0" />
                <span className={`flex-1 text-left ${!selected ? "text-slate-400" : ""}`}>{displayValue}</span>
                <ChevronDown
                    size={14}
                    className={`text-violet-300 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
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

// ── Main Component ───────────────────────────────────────────────
const STATUS_OPTIONS = [
    { label: "Tất cả trạng thái", value: "" },
    { label: "Chờ đối soát", value: "PENDING" },
    { label: "Đã thanh toán", value: "PAID" },
    { label: "Đã huỷ", value: "CANCELLED" },
];

const ORDER_OPTIONS: { label: string; value: "asc" | "desc" }[] = [
    { label: "Mới nhất", value: "desc" },
    { label: "Cũ nhất", value: "asc" },
];

export default function SettlementFilter({ defaultValues }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState(defaultValues.status);
    const [fromDate, setFromDate] = useState(defaultValues.fromDate);
    const [toDate, setToDate] = useState(defaultValues.toDate);
    const [sortBy] = useState(defaultValues.sortBy);
    const [orderBy, setOrderBy] = useState<"asc" | "desc">(defaultValues.orderBy);
    const [size] = useState(String(defaultValues.size));

    const applyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        params.set("size", size);
        params.set("sortBy", sortBy);
        params.set("orderBy", orderBy);
        if (status) params.set("status", status); else params.delete("status");
        if (fromDate) params.set("fromDate", fromDate); else params.delete("fromDate");
        if (toDate) params.set("toDate", toDate); else params.delete("toDate");
        router.push(`${pathname}?${params.toString()}`);
    };

    const resetFilter = () => router.push(pathname);

    return (
        <div className="py-4 shadow-[0_10px_40px_rgba(168,85,247,0.08)]">
            <div className="mb-4 flex items-center gap-2">
                <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
                    <Funnel className="h-4 w-4" />
                </div>
                <h2 className="font-semibold text-slate-800">Bộ lọc đối soát</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">

                {/* Status */}
                <CustomDropdown
                    value={status}
                    onChange={setStatus}
                    options={STATUS_OPTIONS}
                    placeholder="Tất cả trạng thái"
                />

                {/* From Date */}
                <MiniDatePicker
                    value={fromDate}
                    onChange={setFromDate}
                    max={toDate || undefined}
                    placeholder="Từ ngày"
                />

                {/* To Date */}
                <MiniDatePicker
                    value={toDate}
                    onChange={setToDate}
                    min={fromDate || undefined}
                    placeholder="Đến ngày"
                />

                {/* Order By */}
                <CustomDropdown
                    value={orderBy}
                    onChange={setOrderBy}
                    options={ORDER_OPTIONS}
                />

                {/* Apply */}
                <button
                    type="button"
                    onClick={applyFilter}
                    className="inline-flex cursor-pointer h-11 items-center justify-center gap-2 rounded-md bg-purple-500 px-5 font-medium text-white transition hover:opacity-95"
                >
                    <Search className="h-4 w-4" />
                    Áp dụng
                </button>

                {/* Reset */}
                <button
                    type="button"
                    onClick={resetFilter}
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-violet-200 bg-white px-5 font-medium text-slate-700 transition hover:bg-violet-50"
                >
                    <RotateCcw className="h-4 w-4" />
                    Đặt lại
                </button>
            </div>
        </div>
    );
}
