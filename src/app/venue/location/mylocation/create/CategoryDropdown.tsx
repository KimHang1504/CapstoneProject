"use client";

import { useEffect, useRef, useState } from "react";
import { Category } from "@/api/category/type";
import { getCategories } from "@/api/category/api";

type Props = {
  selected: number[]
  onChange: (ids: number[]) => void
}

export default function CategoryDropdown({ selected, onChange }: Props) {

  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loading, setLoading] = useState(false)

  const ref = useRef<HTMLDivElement | null>(null)

  async function fetchCategories(pageNumber: number) {
    if (loading || !hasNextPage) return

    setLoading(true)

    try {
      const res = await getCategories(pageNumber, 10)

      setCategories(prev => [...prev, ...res.items])
      setHasNextPage(res.hasNextPage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(1)
  }, [])

  function toggleCategory(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const selectedCategories = categories.filter(c =>
    selected.includes(c.id)
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>

      {/* SELECTED PREVIEW */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full border border-[#E4D7FF] rounded-lg px-3 py-2 flex flex-wrap gap-2 cursor-pointer bg-white"
      >

        {selectedCategories.length === 0 && (
          <span className="text-gray-400 text-sm">
            Chọn danh mục phù hợp với địa điểm của bạn
          </span>
        )}

        {selectedCategories.map(cat => (
          <span
            key={cat.id}
            className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
          >
            {cat.name}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleCategory(cat.id)
              }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute z-10 mt-2 w-full bg-white border border-[#E4D7FF] rounded-lg shadow max-h-60 overflow-y-auto"
          onScroll={(e) => {
            const target = e.currentTarget

            const isBottom =
              target.scrollTop + target.clientHeight >= target.scrollHeight - 5

            if (isBottom && hasNextPage && !loading) {
              const nextPage = page + 1
              setPage(nextPage)
              fetchCategories(nextPage)
            }
          }}
        >

          {/* SEARCH */}
          <input
            placeholder="Tìm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b px-3 py-2 text-sm outline-none"
          />

          {/* LIST */}
          {categories
            .filter(c =>
              c.name.toLowerCase().includes(search.toLowerCase())
            )
            .map(cat => {

              const active = selected.includes(cat.id)

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-purple-50
                  ${active ? "bg-purple-100" : ""}`}
                >
                  {cat.name}
                </button>
              )
            })}

          {loading && (
            <p className="text-xs text-gray-400 text-center py-2">
              Đang tải...
            </p>
          )}

        </div>
      )}

    </div>
  )
}