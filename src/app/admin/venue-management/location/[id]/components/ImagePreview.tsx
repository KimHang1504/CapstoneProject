"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImagePreview({
  src,
  alt,
  width = 400,
  height = 300,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
        onClick={() => setOpen(true)}
      />

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div className="min-h-screen flex items-center justify-center p-6">

            <div
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                width={1400}
                height={900}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />

              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white text-2xl bg-black/50 w-10 h-10 rounded-full"
              >
                ✕
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}