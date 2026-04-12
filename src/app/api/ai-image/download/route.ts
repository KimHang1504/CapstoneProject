import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const imageUrl = body?.url;

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { message: "Missing image url" },
        { status: 400 }
      );
    }

    if (!/^https?:\/\//i.test(imageUrl)) {
      return NextResponse.json(
        { message: "Invalid image url" },
        { status: 400 }
      );
    }

    const upstream = await fetch(imageUrl, { cache: "no-store" });

    if (!upstream.ok) {
      return NextResponse.json(
        { message: "Cannot download AI image" },
        { status: 502 }
      );
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("content-type") || "image/png";

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("AI image download proxy error:", error);
    return NextResponse.json(
      { message: "Failed to proxy AI image" },
      { status: 500 }
    );
  }
}
