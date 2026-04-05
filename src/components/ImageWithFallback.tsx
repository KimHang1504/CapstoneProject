"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
};

export default function ImageWithFallback({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  fill = false,
  sizes
}: Props) {
  const [hasError, setHasError] = useState(false);

  const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%23999' text-anchor='middle' dominant-baseline='middle' font-family='Arial'%3E📷%3C/text%3E%3Ctext x='50%25' y='70%25' font-size='16' fill='%23999' text-anchor='middle' font-family='Arial'%3EKhông có ảnh%3C/text%3E%3C/svg%3E`;

  if (hasError || !src) {
    return (
      <img
        src={fallbackSvg}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
