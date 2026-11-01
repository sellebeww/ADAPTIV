/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'symbol' | 'vertical' | 'white';
  transparent?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  transparent = true,
  className = '',
  size = 'md',
  showTagline = false
}) => {
  // Size mapping
  const heightClass = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20'
  }[size];

  const wordmarkHeight = {
    sm: 'h-5',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12'
  }[size];

  // The *-horizontal-* PNGs have an opaque white box baked behind the wordmark, so the
  // transparent and white lockups are composed from the clean symbol + wordmark instead.
  const composed = variant === 'white' || (variant === 'horizontal' && transparent);

  // Choose asset based on variant and transparency
  let assetSrc = '/brand/adaptiv-logo.png';

  if (variant === 'symbol') {
    assetSrc = transparent ? '/brand/adaptiv-symbol-nobg.png' : '/brand/adaptiv-logo.png';
  } else if (variant === 'vertical') {
    assetSrc = transparent ? '/brand/adaptiv-logo-nobg.png' : '/brand/adaptiv-logo.png';
  }

  const whiten = variant === 'white' ? ' brightness-0 invert' : '';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {composed ? (
        <span
          role="img"
          aria-label="Adaptiv"
          className="inline-flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
        >
          <img
            src="/brand/adaptiv-symbol-nobg.png"
            alt=""
            referrerPolicy="no-referrer"
            className={`${heightClass} w-auto object-contain${whiten}`}
          />
          <img
            src="/brand/adaptiv-wordmark-nobg.png"
            alt=""
            referrerPolicy="no-referrer"
            className={`${wordmarkHeight} w-auto object-contain${whiten}`}
          />
        </span>
      ) : (
        <img
          src={assetSrc}
          alt="Adaptiv Logo"
          referrerPolicy="no-referrer"
          className={`${heightClass} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        />
      )}
      {showTagline && (
        <div className="hidden sm:flex flex-col border-l border-[#E3E8F8] pl-2.5">
          <span className="text-[11px] font-semibold tracking-wider text-[#3F55F0] uppercase">
            Dynamic Assessment
          </span>
          <span className="text-xs text-[#5B6585] font-medium leading-none">
            Vokasi & Keterampilan
          </span>
        </div>
      )}
    </div>
  );
};
