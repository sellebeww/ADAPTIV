/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/** Wall switch plate; `rockers` = 1 (saklar biasa) or 2 (saklar tukar). */
export const WallSwitch: React.FC<{ rockers?: 1 | 2; className?: string }> = ({ rockers = 1, className }) => {
  const id = `sw-${rockers}`;
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-plate`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DDE3F5" />
        </linearGradient>
        <linearGradient id={`${id}-key`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F6FD" />
          <stop offset="1" stopColor="#CBD3EC" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="74" rx="10" fill={`url(#${id}-plate)`} stroke="#C9D2EE" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1.6" fill="#AEB8DA" />
      <circle cx="54" cy="70" r="1.6" fill="#AEB8DA" />
      {rockers === 1 ? (
        <rect x="19" y="18" width="26" height="44" rx="5" fill={`url(#${id}-key)`} stroke="#B9C3E6" />
      ) : (
        <>
          <rect x="11" y="18" width="19" height="44" rx="4.5" fill={`url(#${id}-key)`} stroke="#B9C3E6" />
          <rect x="34" y="18" width="19" height="44" rx="4.5" fill={`url(#${id}-key)`} stroke="#B9C3E6" />
        </>
      )}
    </svg>
  );
};

/** Light bulb; `on` lights the glass and draws the glow. */
export const Bulb: React.FC<{ on?: boolean; className?: string }> = ({ on = true, className }) => (
  <svg viewBox="0 0 64 80" className={className} aria-hidden>
    <defs>
      <radialGradient id="bulb-glass" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stopColor={on ? '#FFF6B8' : '#F1F4FF'} />
        <stop offset="1" stopColor={on ? '#FFD23F' : '#D5DCF2'} />
      </radialGradient>
      <radialGradient id="bulb-glow" cx="0.5" cy="0.4" r="0.5">
        <stop offset="0" stopColor="#FFE680" stopOpacity="0.85" />
        <stop offset="1" stopColor="#FFE680" stopOpacity="0" />
      </radialGradient>
    </defs>
    {on && <circle cx="32" cy="32" r="31" fill="url(#bulb-glow)" />}
    <path
      d="M32 8c-11 0-19 8-19 19 0 7 3.5 11.5 7 15.5 2 2.3 3 4.5 3 7.5h18c0-3 1-5.2 3-7.5 3.5-4 7-8.5 7-15.5 0-11-8-19-19-19z"
      fill="url(#bulb-glass)"
      stroke={on ? '#E0A800' : '#B6BDD6'}
      strokeWidth="1.8"
    />
    <path d="M26 36l6-8 6 8M32 28v-2" fill="none" stroke={on ? '#D98E00' : '#A3ACCB'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="23" y="53" width="18" height="6" rx="2" fill="#AEB8DA" />
    <rect x="25" y="60" width="14" height="5" rx="2" fill="#8E9AC4" />
    <path d="M28 65h8l-1.5 5h-5z" fill="#6F7CAE" />
    {on && (
      <g stroke="#FFC400" strokeWidth="2" strokeLinecap="round">
        <path d="M5 14l5 3M59 14l-5 3M2 30h6M62 30h-6" />
      </g>
    )}
  </svg>
);

/** Outline trophy with sparkle, as in the passport section of the reference. */
export const TrophyArt: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 130" className={className} aria-hidden>
    <defs>
      <linearGradient id="trophy-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4A8BFF" />
        <stop offset="1" stopColor="#2A38B8" />
      </linearGradient>
    </defs>
    <g fill="none" stroke="url(#trophy-g)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M34 20h44v26c0 14-10 24-22 24S34 60 34 46z" fill="#EAF0FF" />
      <path d="M34 28H18c0 16 6 26 18 28M78 28h16c0 16-6 26-18 28" />
      <path d="M56 70v18M40 104h32M44 88h24l4 16H40z" />
      <path d="M56 32l3.5 7.5 8 1-6 5.5 1.8 8L56 50l-7.3 3.9 1.8-8-6-5.5 8-1z" fill="#FFFFFF" strokeWidth="2.5" />
    </g>
    <path d="M104 62l2.5 7.5L114 72l-7.5 2.5L104 82l-2.5-7.5L94 72l7.5-2.5z" fill="#6E8DFF" />
    <path d="M14 96l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z" fill="#9DB4FF" />
  </svg>
);

/** Large translucent blue swoosh + tick marks behind the hero visual. */
export const HeroSwoosh: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 520 480" className={className} aria-hidden>
    <defs>
      <linearGradient id="swoosh-a" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#2455F0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#7C9BFF" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="swoosh-b" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4A8BFF" stopOpacity="0.35" />
        <stop offset="1" stopColor="#2455F0" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path d="M520 0v480H240C330 400 300 250 380 160 430 105 480 70 520 0z" fill="url(#swoosh-a)" />
    <path d="M400 0C470 40 500 120 440 210 390 285 330 330 250 380 330 270 300 130 400 0z" fill="url(#swoosh-b)" />
    <g stroke="#2455F0" strokeWidth="6" strokeLinecap="round">
      <path d="M452 42l-6 20M486 56l16-10" />
    </g>
  </svg>
);
