export async function searchMapbox(query: string, signal?: AbortSignal) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&autocomplete=true&limit=5&language=vi&country=vn`,
    { signal }
  );

  const data = await res.json();

  return data.features.map((item: any) => ({
    label: item.place_name,
    lat: item.center[1],
    lon: item.center[0],
  }));
}