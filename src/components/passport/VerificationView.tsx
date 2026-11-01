/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, BadgeCheck, ShieldAlert } from 'lucide-react';
import { AbilityPassport } from '../../types/adaptiv';
import { Logo } from '../brand/Logo';

/** Public page opened by the passport QR code / `?verifikasi=CODE` link. */
export const VerificationView: React.FC<{ code: string; passport?: AbilityPassport; onClose: () => void }> = ({ code, passport, onClose }) => (
  <div className="min-h-screen grid place-items-center bg-[#F6F8FF] p-4">
    <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E3E8F8] shadow-xl p-8 space-y-6">
      <Logo variant="horizontal" transparent size="md" />

      {passport ? (
        <>
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
            <BadgeCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Paspor Kemampuan terverifikasi</p>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">Kode ini terdaftar di Adaptiv dan diterbitkan oleh lembaga pendidikan di bawah.</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {[
              ['Nama', passport.participant.name],
              ['Kelas', passport.participant.class ?? '-'],
              ['Lembaga', passport.participant.institutionName],
              ['Diterbitkan', passport.issuedAt],
              ['Kompetensi', passport.competency.name],
              ['Tingkat Adaptasi', passport.result.level],
              ['Indeks Adaptasi', `${passport.result.adaptationIndex} / 100`],
              ['Kode', passport.publicCode]
            ].map(([k, v]) => (
              <div key={k} className={k === 'Kompetensi' ? 'col-span-2' : undefined}>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-[#5B6585]">{k}</dt>
                <dd className="mt-1 font-semibold text-[#0F1B4A] break-words">{v}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 p-4">
          <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-900">Kode tidak ditemukan</p>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">
              Tidak ada paspor dengan kode <span className="font-mono">{code}</span>. Periksa kembali tautan atau QR code.
            </p>
          </div>
        </div>
      )}

      <button onClick={onClose} className="inline-flex items-center gap-2 text-sm font-semibold text-[#3F55F0] hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Adaptiv
      </button>
    </div>
  </div>
);
