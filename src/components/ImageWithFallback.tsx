"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function ImageWithFallback({
  src,
  alt,
  width = 800,
  height = 300,
  className,
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3E📷%3C/text%3E%3C/svg%3E`;

  return (
    <Image
      src={imgSrc || fallbackSvg}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSvg)}
    />
  );
}