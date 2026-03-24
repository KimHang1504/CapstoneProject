"use client";

import Image from "next/image";
import { useState } from "react";
import placeHolder from "../../../../../../../public/mascot.png";

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
  const fallback = placeHolder;

  const isValidSrc = (url: string) => {
    if (!url) return false;

    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith("/");
    }
  };

  const [imgSrc, setImgSrc] = useState(
    isValidSrc(src) ? src : fallback
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg object-cover cursor-pointer"
        onClick={() => setOpen(true)}
        onError={() => {
          if (imgSrc !== fallback) {
            setImgSrc(fallback);
          }
        }}
      />

      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50"
          onClick={() => setOpen(false)}
        >
          <div className="flex items-center justify-center min-h-screen p-6">
            <div onClick={(e) => e.stopPropagation()}>
              <Image
                src={imgSrc}
                alt={alt}
                width={1200}
                height={800}
                className="max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}