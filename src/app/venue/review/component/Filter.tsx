"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"

type FilterType = "all" | "today" | "custom"

type Props = {
  onChange: (params: {
    date?: string
    month?: number
    year?: number
  }) => void
}

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
]

function formatDateVN(dateStr: string) {
  if (!dateStr) return ""
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

type PickerMode = "day" | "month"

function DateTimePicker({
  onApply,
  onClose,
}: {
  onApply: (params: { date?: string; month?: number; year?: number }) => void
  onClose: () => void
}) {
  const today = new Date()
  const [mode, setMode] = useState<PickerMode>("day")

  // Day mode state
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState("")

  // Month mode state
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear())

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    const mm = String(viewMonth + 1).padStart(2, "0")
    const dd = String(day).padStart(2, "0")
    return selectedDate === `${viewYear}-${mm}-${dd}`
  }

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day

  const canApply =
    mode === "day" ? !!selectedDate : selectedMonth !== null && !!selectedYear

  const handleApply = () => {
    if (mode === "day" && selectedDate) {
      onApply({ date: selectedDate })
    } else if (mode === "month" && selectedMonth !== null && selectedYear) {
      onApply({ month: selectedMonth, year: selectedYear })
    }
    onClose()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-80 overflow-hidden select-none">
      {/* Mode tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setMode("day")}
          className={`flex-1 py-2.5 text-sm font-medium transition cursor-pointer ${
            mode === "day"
              ? "text-black border-b-2 border-black"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Theo ngày
        </button>
        <button
          onClick={() => setMode("month")}
          className={`flex-1 py-2.5 text-sm font-medium transition cursor-pointer ${
            mode === "month"
              ? "text-black border-b-2 border-black"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Theo tháng
        </button>
      </div>

      <div className="p-4">
        {/* Day picker */}
        {mode === "day" && (
          <>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <ChevronLeft size={15} className="text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-800">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <ChevronRight size={15} className="text-gray-600" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, idx) => (
                <div key={idx} className="flex items-center justify-center">
                  {day ? (
                    <button
                      onClick={() => {
                        const mm = String(viewMonth + 1).padStart(2, "0")
                        const dd = String(day).padStart(2, "0")
                        setSelectedDate(`${viewYear}-${mm}-${dd}`)
                      }}
                      className={`w-8 h-8 rounded-full text-sm transition cursor-pointer
                        ${isSelected(day)
                          ? "bg-black text-white font-semibold"
                          : isToday(day)
                          ? "border border-black text-black font-semibold hover:bg-gray-100"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {day}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            {selectedDate && (
              <p className="text-xs text-center text-gray-500 mt-3">
                Đã chọn: <span className="font-medium text-black">{formatDateVN(selectedDate)}</span>
              </p>
            )}
          </>
        )}

        {/* Month picker */}
        {mode === "month" && (
          <>
            {/* Year selector */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedYear(y => y - 1)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <ChevronLeft size={15} className="text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-800">{selectedYear}</span>
              <button
                onClick={() => setSelectedYear(y => y + 1)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <ChevronRight size={15} className="text-gray-600" />
              </button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTH_NAMES.map((name, idx) => {
                const m = idx + 1
                const isCurrentMonth =
                  today.getMonth() + 1 === m && today.getFullYear() === selectedYear
                const isSel = selectedMonth === m
                return (
                  <button
                    key={m}
                    onClick={() => setSelectedMonth(m)}
                    className={`py-2 rounded-xl text-sm transition cursor-pointer
                      ${isSel
                        ? "bg-black text-white font-semibold"
                        : isCurrentMonth
                        ? "border border-black text-black font-semibold hover:bg-gray-100"
                        : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={onClose}
          className="flex-1 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition cursor-pointer"
        >
          Huỷ
        </button>
        <button
          onClick={handleApply}
          disabled={!canApply}
          className="flex-1 py-2 text-sm bg-black text-white rounded-xl hover:bg-gray-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Áp dụng
        </button>
      </div>
    </div>
  )
}

export default function ReviewFilter({ onChange }: Props) {
  const [type, setType] = useState<FilterType>("all")
  const [showPicker, setShowPicker] = useState(false)
  const [label, setLabel] = useState("")
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleTypeChange = (newType: FilterType) => {
    setType(newType)
    setShowPicker(false)
    setLabel("")

    if (newType === "all") onChange({})
    if (newType === "today") {
      const today = new Date().toISOString().split("T")[0]
      onChange({ date: today })
    }
    if (newType === "custom") {
      setShowPicker(true)
    }
  }

  const handleApply = (params: { date?: string; month?: number; year?: number }) => {
    onChange(params)
    if (params.date) {
      setLabel(formatDateVN(params.date))
    } else if (params.month && params.year) {
      setLabel(`T${params.month}/${params.year}`)
    }
  }

  const handleClear = () => {
    setType("all")
    setLabel("")
    setShowPicker(false)
    onChange({})
  }

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
      <span className="text-sm text-gray-500">Lọc theo:</span>

      {/* Toggle tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {[
          { label: "Tất cả", value: "all" },
          { label: "Hôm nay", value: "today" },
          { label: "Chọn thời gian", value: "custom" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleTypeChange(item.value as FilterType)}
            className={`px-4 py-1.5 text-sm rounded-lg transition-all cursor-pointer
              ${type === item.value
                ? "bg-white shadow-sm text-black"
                : "text-gray-500 hover:text-black"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Selected label + clear */}
      {type === "custom" && label && (
        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5">
          <Calendar size={13} className="text-gray-500" />
          <span className="text-sm text-gray-800 font-medium">{label}</span>
          <button onClick={handleClear} className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600 transition">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Picker trigger button (when no label yet) */}
      {type === "custom" && !label && (
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowPicker(v => !v)}
            className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 text-sm bg-white hover:bg-gray-50 transition cursor-pointer focus:outline-none"
          >
            <Calendar size={15} className="text-gray-500" />
            <span className="text-gray-400">Chọn ngày / tháng...</span>
          </button>

          {showPicker && (
            <div className="absolute top-full left-0 mt-2 z-50">
              <DateTimePicker
                onApply={handleApply}
                onClose={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* Re-open picker when label exists */}
      {type === "custom" && label && (
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowPicker(v => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer transition"
          >
            Thay đổi
          </button>
          {showPicker && (
            <div className="absolute top-full left-0 mt-2 z-50">
              <DateTimePicker
                onApply={handleApply}
                onClose={() => setShowPicker(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
