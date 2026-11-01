/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbilityPassport } from '../types/adaptiv';
import { Candidate, SEED_CANDIDATES, SEED_USERS } from '../data/seedData';

/** Public verification link; resolved in-app by the `?verifikasi=` route. */
export const verifyUrl = (publicCode: string) =>
  `${window.location.origin}${window.location.pathname}?verifikasi=${encodeURIComponent(publicCode)}`;

/**
 * Demo passport for a candidate listed in the industry portal. The first candidate is the live
 * passport (it follows the assessment flow); the rest scale the same shape to their own IA.
 */
export const passportForCandidate = (base: AbilityPassport, c: Candidate): AbilityPassport => {
  if (c.id === 'c1') return base;
  const ratio = c.iaScore / base.result.adaptationIndex;
  const score = Math.max(0, Math.min(4, Math.round((c.iaScore / 100) * 4)));
  const n = SEED_CANDIDATES.findIndex((x) => x.id === c.id);
  return {
    ...base,
    id: `pass-${c.id}`,
    publicCode: `ADAPT-2026-TITL-${String(891 + n * 37).padStart(4, '0')}`,
    participant: { ...SEED_USERS.participant1, id: `user-${c.id}`, name: c.name, nisn: c.nisn, class: c.className, avatarUrl: undefined, email: '' },
    result: { ...base.result, adaptationIndex: c.iaScore, level: c.level },
    dimensions: base.dimensions.map((d) => ({ ...d, score })),
    categoryMastery: base.categoryMastery.map((m) => ({ ...m, mastered: m.label === c.weakest ? false : m.mastered })),
    sessionHistory: base.sessionHistory?.map((h) => ({ ...h, adaptationIndex: Math.round(h.adaptationIndex * ratio * 10) / 10, level: c.level }))
  };
};

export const findPassportByCode = (base: AbilityPassport, code: string): AbilityPassport | undefined =>
  SEED_CANDIDATES.map((c) => passportForCandidate(base, c)).find((p) => p.publicCode === code);
