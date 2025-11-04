'use client';

import Image from 'next/image';
import { ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Wrapper for Next.js Image component that falls back to regular img in development
 * to avoid Vercel Blob private IP issues
 */
export default function OptimizedImage({ src, alt, width, height, className, ...props }: OptimizedImageProps) {
  // In development, use regular img tag to avoid private IP errors with Vercel Blob
  if (process.env.NODE_ENV === 'development') {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...props}
      />
    );
  }

  // In production, use Next.js Image component for optimization
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}
