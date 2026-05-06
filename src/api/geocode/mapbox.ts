export async function searchMapbox(query: string, signal?: AbortSignal) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${token}&autocomplete=true&limit=5&language=vi&country=vn`,
    { signal }
  );

  const data = await res.json();

  const clean = (str: string) =>
    str
      .replace(/\b\d{5,6}\b/g, "") // remove postcode
      .replace(/\b(Việt Nam|Vietnam)\b/gi, "") // remove country
      .replace(/\s*,\s*,/g, ",")
      .replace(/,\s*$/, "")
      .replace(/\s+/g, " ")
      .trim();

  return data.features.map((item: any) => {
    const context = item.context || [];

    const labelParts = [
      item.text,
      ...context
        .filter(
          (c: any) =>
            !c.id.startsWith("postcode") &&
            !c.id.startsWith("country") // 🔥 remove Vietnam
        )
        .map((c: any) => c.text),
    ];

    return {
      label: clean(labelParts.join(", ")),
      lat: item.center[1],
      lon: item.center[0],
    };
  });
}

export async function geocodeAddressMapbox(query: string, signal?: AbortSignal) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${token}&limit=1&language=vi&country=vn`,
    { signal }
  );

  const data = await res.json();

  if (!data.features?.length) {
    throw new Error("No result");
  }

  const feature = data.features[0];

  return {
    lat: feature.center[1],
    lon: feature.center[0],
    displayName: feature.place_name,
  };
}

export async function reverseGeocodeMapbox(lat: number, lon: number) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${token}&language=vi`
  );

  const data = await res.json();

  const feature = data.features?.[0];

  return {
    displayName: feature?.place_name || "",
  };
}