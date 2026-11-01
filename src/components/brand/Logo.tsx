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

  // Choose asset based on variant and transparency
  let assetSrc = '/brand/adaptiv-horizontal-nobg.png';

  if (variant === 'symbol') {
    assetSrc = transparent ? '/brand/adaptiv-symbol-nobg.png' : '/brand/adaptiv-logo.png';
  } else if (variant === 'vertical') {
    assetSrc = transparent ? '/brand/adaptiv-logo-nobg.png' : '/brand/adaptiv-logo.png';
  } else if (variant === 'white') {
    assetSrc = '/brand/adaptiv-horizontal-white.png';
  } else {
    // horizontal default
    assetSrc = transparent ? '/brand/adaptiv-horizontal-nobg.png' : '/brand/adaptiv-logo.png';
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={assetSrc}
        alt="Adaptiv Logo"
        referrerPolicy="no-referrer"
        className={`${heightClass} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
      />
      {showTagline && (
        <div className="hidden sm:flex flex-col border-l border-[#E3E8F8] pl-2.5">
          <span className="text-[10px] font-semibold tracking-wider text-[#3F55F0] uppercase">
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
