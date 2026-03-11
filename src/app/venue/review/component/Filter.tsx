"use client"

import { useState } from "react"

type FilterType = "all" | "today" | "day" | "month"

type Props = {
  onChange: (params: {
    date?: string
    month?: number
    year?: number
  }) => void
}

export default function ReviewFilter({ onChange }: Props) {
  const [type, setType] = useState<FilterType>("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<number>()
  const [selectedYear, setSelectedYear] = useState<number>()

  const handleTypeChange = (newType: FilterType) => {
    setType(newType)

    if (newType === "all") {
      onChange({})
    }

    if (newType === "today") {
      const today = new Date().toISOString().split("T")[0]
      onChange({ date: today })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
      
      <span className="text-sm text-gray-500">
        Lọc theo:
      </span>

      {/* Toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {[
          { label: "Tất cả", value: "all" },
          { label: "Hôm nay", value: "today" },
          { label: "Chọn ngày", value: "day" },
          { label: "Theo tháng", value: "month" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleTypeChange(item.value as FilterType)}
            className={`px-4 py-1.5 text-sm rounded-lg transition-all
              ${
                type === item.value
                  ? "bg-white shadow-sm text-black"
                  : "text-gray-500 hover:text-black"
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Custom Day */}
      {type === "day" && (
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            const value = e.target.value
            setSelectedDate(value)
            if (value) {
              onChange({ date: value })
            }
          }}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      )}

      {/* Month */}
      {type === "month" && (
        <div className="flex gap-2">
          <select
            onChange={(e) => {
              const month = Number(e.target.value)
              setSelectedMonth(month)
              if (month && selectedYear) {
                onChange({ month, year: selectedYear })
              }
            }}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm"
          >
            <option value="">Tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Năm"
            onChange={(e) => {
              const year = Number(e.target.value)
              setSelectedYear(year)
              if (selectedMonth && year) {
                onChange({ month: selectedMonth, year })
              }
            }}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm w-24"
          />
        </div>
      )}
    </div>
  )
}
