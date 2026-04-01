"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix cho icon marker của Leaflet trong Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

type Props = {
  latitude?: number
  longitude?: number
  onLocationChange: (lat: number, lon: number) => void
}

function LocationMarker({ onLocationChange }: { onLocationChange: (lat: number, lon: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null)

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
      onLocationChange(lat, lng)
    },
  })

  return position === null ? null : <Marker position={position} />
}

export default function MapPicker({ latitude, longitude, onLocationChange }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  // Vị trí mặc định: Trung tâm Việt Nam (Huế)
  const defaultLat = 16.0544
  const defaultLon = 108.2022

  // Chỉ dùng latitude/longitude nếu có giá trị hợp lệ (khác 0, khác null, khác undefined)
  const hasValidLocation = latitude && longitude && (latitude !== 0 || longitude !== 0)
  
  const centerLat = hasValidLocation ? latitude : defaultLat
  const centerLon = hasValidLocation ? longitude : defaultLon

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="mt-4 h-96 w-full rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        Đang tải bản đồ...
      </div>
    )
  }

  return (
    <div className="mt-4 h-96 w-full rounded-xl overflow-hidden border border-gray-200">
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={hasValidLocation ? 13 : 6}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Luôn hiển thị marker - hoặc tại vị trí đã chọn hoặc tại vị trí mặc định */}
        <Marker position={[centerLat, centerLon]} />
        <LocationMarker onLocationChange={onLocationChange} />
      </MapContainer>
    </div>
  )
}
