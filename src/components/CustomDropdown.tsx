import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Custom Dropdown ──────────────────────────────────────────────
export function CustomDropdown<T extends string>({
    value,
    onChange,
    options,
    placeholder,
    className
}: {
    value: T;
    onChange: (v: T) => void;
    options: { label: string; value: T; disabled?: boolean }[];
    placeholder?: string;
    className?: string;
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
        <div ref={ref} className={`relative ${className || ""}`}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center w-full gap-2 h-9 rounded-md border border-violet-100 bg-white px-4 text-sm
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
                    {options.map((opt) => {
                        const isSelected = opt.value === value;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                disabled={opt.disabled}
                                onClick={() => {
                                    if (!opt.disabled) {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }
                                }}
                                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition
                ${opt.disabled
                                        ? "text-slate-400 cursor-not-allowed bg-white"
                                        : isSelected
                                            ? "bg-violet-50 text-violet-600 font-medium"
                                            : "text-slate-700 hover:bg-violet-50 cursor-pointer"
                                    }
            `}
                            >
                                {opt.label}

                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

