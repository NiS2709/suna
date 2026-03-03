
'use client';

import { cn } from '@/lib/utils';

interface NexusLogoProps {
  size?: number;
  variant?: 'symbol' | 'logomark';
  className?: string;
}

export function NexusLogo({ size = 24, variant = 'symbol', className }: NexusLogoProps) {
  const logoSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('flex-shrink-0', className)}
    >
      <path
        d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
        stroke="#64FFDA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 7L12 12L22 7"
        stroke="#64FFDA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22V12"
        stroke="#64FFDA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 4.5L7 9.5"
        stroke="#64FFDA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'logomark') {
    return logoSvg;
  }

  return logoSvg;
}
