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
