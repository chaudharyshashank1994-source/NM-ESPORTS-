import React from 'react';

interface EsportsLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const EsportsLogo: React.FC<EsportsLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-lg', sub: 'text-[11px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Vector Crest */}
      <div className={`relative ${currentSize.icon} shrink-0 flex items-center justify-center`}>
        {glow && (
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-red-500/30 blur-md pointer-events-none"
            aria-hidden="true"
          />
        )}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)] relative z-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Rim Gradient */}
            <linearGradient id="shieldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>

            {/* Inner Dark Metal Background */}
            <radialGradient id="shieldBg" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#262626" />
              <stop offset="60%" stopColor="#171717" />
              <stop offset="100%" stopColor="#0A0A0A" />
            </radialGradient>

            {/* Wings / Flame Gradient */}
            <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="30%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>

            {/* Metallic NM Letters Gradient */}
            <linearGradient id="goldLetter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wing / Blade Left */}
          <path
            d="M 12 36 C 18 20 28 14 36 12 C 32 18 30 26 31 34 C 23 33 17 34 12 36 Z"
            fill="url(#flameGrad)"
            opacity="0.9"
          />
          <path
            d="M 6 48 C 12 36 22 28 30 26 C 26 34 26 42 28 48 C 20 47 13 47 6 48 Z"
            fill="url(#flameGrad)"
            opacity="0.75"
          />

          {/* Wing / Blade Right */}
          <path
            d="M 88 36 C 82 20 72 14 64 12 C 68 18 70 26 69 34 C 77 33 83 34 88 36 Z"
            fill="url(#flameGrad)"
            opacity="0.9"
          />
          <path
            d="M 94 48 C 88 36 78 28 70 26 C 74 34 74 42 72 48 C 80 47 87 47 94 48 Z"
            fill="url(#flameGrad)"
            opacity="0.75"
          />

          {/* Main Shield Outline & Shadow */}
          <path
            d="M 50 6 L 80 18 L 76 62 L 50 94 L 24 62 L 20 18 Z"
            fill="url(#shieldRim)"
            stroke="#FDE047"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner Shield Body */}
          <path
            d="M 50 11 L 74 21 L 70 59 L 50 88 L 30 59 L 26 21 Z"
            fill="url(#shieldBg)"
            stroke="#171717"
            strokeWidth="1.2"
          />

          {/* Center Crosshairs / Gaming Diamond Accent */}
          <path
            d="M 50 16 L 54 22 L 50 28 L 46 22 Z"
            fill="#F59E0B"
            opacity="0.8"
          />

          {/* NM Monogram Typography (Esports Beveled Geometry) */}
          {/* Letter N */}
          <path
            d="M 33 32 L 39 32 L 39 45 L 47 32 L 52 32 L 52 64 L 46 64 L 46 48 L 37 64 L 33 64 Z"
            fill="url(#goldLetter)"
            stroke="#78350F"
            strokeWidth="0.8"
            strokeLinejoin="bevel"
          />

          {/* Letter M */}
          <path
            d="M 51 32 L 58 32 L 63 48 L 68 32 L 75 32 L 75 64 L 69 64 L 69 46 L 65 57 L 61 57 L 57 46 L 57 64 L 51 64 Z"
            fill="url(#goldLetter)"
            stroke="#78350F"
            strokeWidth="0.8"
            strokeLinejoin="bevel"
          />

          {/* Bottom Banner Ribbon: ESPORTS */}
          <path
            d="M 22 72 L 78 72 L 74 84 L 50 88 L 26 84 Z"
            fill="#0F0F0F"
            stroke="url(#shieldRim)"
            strokeWidth="1"
          />
          <text
            x="50"
            y="81.5"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="7.5"
            fontWeight="900"
            letterSpacing="2.2"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ESPORTS
          </text>
        </svg>
      </div>

      {/* Optional Wordmark */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-black tracking-wider text-white flex items-center gap-1.5 ${currentSize.text}`}>
            <span>NM</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
              ESPORTS
            </span>
          </div>
          <span className={`text-neutral-400 font-bold uppercase tracking-widest ${currentSize.sub}`}>
            Free Fire Platform
          </span>
        </div>
      )}
    </div>
  );
};
