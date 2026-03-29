export async function geocodeAddress(address: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      // Nominatim yêu cầu User-Agent
      "User-Agent": "couple-mood-capstone",
    },
  });

  if (!res.ok) throw new Error("Geocode failed");

  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Không tìm thấy địa chỉ");
  }

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    displayName: data[0].display_name,
  };
}

export async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "couple-mood-capstone",
    },
  });

  if (!res.ok) throw new Error("Reverse geocode failed");

  const data = await res.json();

  if (!data || !data.display_name) {
    throw new Error("Không tìm thấy địa chỉ");
  }

  return {
    lat: Number(data.lat),
    lon: Number(data.lon),
    displayName: data.display_name,
    address: data.address,
  };
}
