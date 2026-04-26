export async function searchPhoton(query: string) {
    const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
    );

    const data = await res.json();
    console.log("searchPhoton:", searchPhoton);
    return data.features.map((item: any) => ({
        label: [
            item.properties.name,
            item.properties.street,
            item.properties.city,
            item.properties.country,
        ]
            .filter(Boolean)
            .join(", "),
        lat: item.geometry.coordinates[1],
        lon: item.geometry.coordinates[0],
    }));
}