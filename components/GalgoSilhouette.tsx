import type { CSSProperties } from 'react';

type GalgoSilhouetteProps = {
  className?: string;
  style?: CSSProperties;
  title?: string;
};

export function GalgoSilhouette({ className = '', style, title = 'Galgo Español silhouette' }: GalgoSilhouetteProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 170 80"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="galgo-body-clip">
          <path d="M38 28 C34 24 20 16 5 7 C12 18 26 27 36 33 Z" />
          <path d="M92 26 C84 27 78 29 70 29 C62 28 56 24 50 24 C45 24 41 25 38 28 C36 31 36 34 40 35 C44 35 48 34 52 34 C60 33 68 36 76 41 C82 45 88 47 94 45 C99 43 101 38 103 33 C108 30.5 114 28.5 122 26.5 C128 25.5 133 25 136 25 C141 24.5 147 23.5 151.5 22.8 L152.5 21 C148 19.6 142 18.6 137 17.8 C133 17 130 16 128 15.4 C126 11 120 8.8 114 11.6 C116.5 14.6 119 16.8 123.5 18.3 C118 19.8 108 22 98 24.5 C95 25.2 93.5 25.6 92 26 Z" />
        </clipPath>
        <clipPath id="galgo-leg-clip">
          <path d="M44 31 L32 43 L20 53 L9 60" />
          <path d="M48 32 L38 48 L29 58 L19 65" />
          <path d="M92 33 L104 42 L118 45 L132 40" />
          <path d="M89 35 L98 47 L110 53 L122 53" />
        </clipPath>
      </defs>

      <g clipPath="url(#galgo-body-clip)">
        <rect x="0" y="0" width="34" height="80" fill="var(--verm)" />
        <rect x="34" y="0" width="34" height="80" fill="var(--amber)" />
        <rect x="68" y="0" width="34" height="80" fill="var(--green)" />
        <rect x="102" y="0" width="34" height="80" fill="var(--cyan)" />
        <rect x="136" y="0" width="34" height="80" fill="var(--cobalt)" />
      </g>

      <g
        fill="none"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#galgo-leg-clip)"
      >
        <path d="M44 31 L32 43 L20 53 L9 60" stroke="var(--amber)" />
        <path d="M48 32 L38 48 L29 58 L19 65" stroke="var(--verm)" />
        <path d="M92 33 L104 42 L118 45 L132 40" stroke="var(--cyan)" />
        <path d="M89 35 L98 47 L110 53 L122 53" stroke="var(--green)" />
      </g>
    </svg>
  );
}
