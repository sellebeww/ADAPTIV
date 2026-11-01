/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useInView,
  useReducedMotion,
  type Variants
} from 'motion/react';
import {
  ArrowRight,
  Play,
  ShieldCheck,
  GraduationCap,
  BarChart3,
  ClipboardList,
  Repeat,
  Lock,
  Wrench,
  Star,
  Brain,
  Settings2,
  Trophy,
  UserCheck,
  CircleCheck,
  TrendingUp,
  Users,
  UserRound,
  Factory,
  Landmark,
  Crown,
  ChevronDown,
  QrCode
} from 'lucide-react';
import { Logo } from '../brand/Logo';
import { WallSwitch, Bulb, TrophyArt, HeroSwoosh } from './Illustrations';

interface CompanyProfileProps {
  onEnterDemo: (tab?: string) => void;
  onOpenBrandKit: () => void;
}

const EASE = [0.23, 1, 0.32, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.08 }
  })
};

/** Scroll-triggered wrapper so every section animates in once. */
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  index?: number;
  id?: string;
}> = ({ children, className, index = 0, id }) => (
  <motion.div
    id={id}
    className={className}
    variants={fadeUp}
    custom={index}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: '-80px' }}
  >
    {children}
  </motion.div>
);

const CountUp: React.FC<{ to: number; decimals?: number; className?: string }> = ({
  to,
  decimals = 0,
  className
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setVal(v)
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {val.toFixed(decimals)}
    </span>
  );
};

/** Pentagon radar; polygon grows from the centre when scrolled into view. */
const Radar: React.FC<{
  scores: number[];
  labels: string[];
  size?: number;
  showLabels?: boolean;
}> = ({ scores, labels, size = 220, showLabels = true }) => {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const c = size / 2;
  const maxR = size * 0.32;
  const pad = 48; // horizontal room so side labels never clip
  const pt = (i: number, r: number) => {
    const a = ((Math.PI * 2) / 5) * i - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  };
  const poly = (f: (i: number) => number) =>
    scores.map((_, i) => pt(i, f(i)).join(',')).join(' ');
  const target = poly((i) => (scores[i] / 4) * maxR);
  const origin = poly(() => 0);

  return (
    <svg ref={ref} viewBox={`${-pad} -8 ${size + pad * 2} ${size + 16}`} className="w-full h-auto overflow-visible" role="img" aria-label="Grafik radar lima dimensi adaptasi">
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon key={s} points={poly(() => s * maxR)} fill="none" stroke="#D6DDF5" strokeWidth="1" />
      ))}
      {scores.map((_, i) => {
        const [x, y] = pt(i, maxR);
        return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="#D6DDF5" strokeWidth="1" />;
      })}
      <motion.polygon
        initial={{ points: origin, opacity: 0 }}
        animate={inView ? { points: target, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
        fill="#4A8BFF"
        fillOpacity="0.28"
        stroke="#3F55F0"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {scores.map((s, i) => {
        const [x, y] = pt(i, (s / 4) * maxR);
        return (
          <motion.circle
            key={i}
            r="4"
            fill="#3F55F0"
            stroke="#fff"
            strokeWidth="1.5"
            initial={{ cx: c, cy: c, opacity: 0 }}
            animate={inView ? { cx: x, cy: y, opacity: 1 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          />
        );
      })}
      {showLabels &&
        labels.map((l, i) => {
          const [x, y] = pt(i, maxR + 14);
          // Side labels hang outward from the vertex instead of centring on it.
          const anchor = x > c + 4 ? 'start' : x < c - 4 ? 'end' : 'middle';
          return (
            <text
              key={l}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-[#3B4670]"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              {l}
            </text>
          );
        })}
    </svg>
  );
};

const STEPS = [
  { icon: ClipboardList, title: 'Tugas Dasar', desc: 'Kerjakan tugas awal.' },
  { icon: Repeat, title: 'Kondisi Diubah', desc: 'Satu kondisi berubah (tepat satu).' },
  { icon: Lock, title: 'Prediksi Terkunci', desc: 'Tuliskan risiko & rencana kerja sebelum bertindak.' },
  { icon: Wrench, title: 'Penyesuaian Mandiri', desc: 'Gunakan petunjuk bertahap jika perlu.' },
  { icon: BarChart3, title: 'Evaluasi Diri', desc: 'Bandingkan prediksi dengan hasil.' },
  { icon: Star, title: 'Penilaian & Umpan Balik', desc: 'Dapatkan hasil & tindak lanjut.' }
];

const DIMENSIONS = [
  { icon: Brain, title: 'Prediksi', weight: 20, tone: 'from-[#E1EEFF] to-[#F2F7FF]', fg: 'text-[#2563EB]' },
  { icon: Settings2, title: 'Penyesuaian', weight: 30, tone: 'from-[#EEE5FF] to-[#F7F2FF]', fg: 'text-[#7C3AED]' },
  { icon: Trophy, title: 'Hasil', weight: 25, tone: 'from-[#DDF6E5] to-[#F0FBF3]', fg: 'text-[#16A34A]' },
  { icon: UserCheck, title: 'Kemandirian', weight: 15, tone: 'from-[#FFEBD6] to-[#FFF6EC]', fg: 'text-[#EA7A12]' },
  { icon: CircleCheck, title: 'Evaluasi', weight: 10, tone: 'from-[#FFE1E4] to-[#FFF1F2]', fg: 'text-[#E11D48]' }
];

const AUDIENCE = [
  { icon: Users, title: 'Peserta', sub: '(Siswa)' },
  { icon: UserRound, title: 'Penilai', sub: '(Guru/Instruktur)' },
  { icon: Factory, title: 'Mitra Industri', sub: '' },
  { icon: Landmark, title: 'Admin Lembaga', sub: '' },
  { icon: Crown, title: 'Super Admin', sub: '' }
];

const FAQS = [
  {
    q: 'Bagaimana Adaptiv memastikan penilai tidak mengubah lebih dari 1 kondisi sekaligus?',
    a: 'Setiap variasi tugas melewati Task Equivalence Checklist dan ditinjau rekan sejawat. Penilai hanya dapat memilih variasi yang mengisolasi tepat satu variabel, sehingga hasil evaluasi tidak bias.'
  },
  {
    q: 'Apakah sekolah atau BLK perlu membeli peralatan dan sensor baru?',
    a: 'Tidak. Adaptiv agnostik terhadap perangkat keras: memakai papan latihan, multimeter, dan komponen yang sudah ada di bengkel. Bukti praktik berupa foto/video diunggah lewat smartphone peserta.'
  },
  {
    q: 'Bagaimana keabsahan dan privasi Paspor Kemampuan siswa?',
    a: 'Setiap paspor punya kode verifikasi unik dan QR code. Selaras dengan UU PDP, siswa di bawah 18 tahun memegang kontrol atas izin akses mitra industri.'
  },
  {
    q: 'Berapa lama satu sesi penilaian dinamis?',
    a: 'Satu sesi berurutan (fase 0 sampai 7) umumnya 35–50 menit, pas dengan jam praktikum blok maupun Uji Kompetensi Keahlian.'
  }
];

const RADAR_LABELS = ['Prediksi', 'Penyesuaian', 'Hasil', 'Kemandirian', 'Evaluasi'];

export const CompanyProfile: React.FC<CompanyProfileProps> = ({ onEnterDemo, onOpenBrandKit }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [switched, setSwitched] = useState(false);
  const reduce = useReducedMotion();

  // Loop the "single → two-way switch" request card so the problem/solution panel stays alive.
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setSwitched((s) => !s), 2600);
    return () => clearInterval(t);
  }, [reduce]);

  const float = (delay = 0, dist = 8) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -dist, 0] },
          transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay }
        };

  return (
    <div className="bg-[#F6F8FF] text-[#0F1B4A] font-sans overflow-x-hidden">
      {/* ───────── HERO ───────── */}
      <section id="beranda" className="relative scroll-mt-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-[#3F55F0]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute top-10 right-0 w-[34rem] h-[34rem] rounded-full bg-[#4A8BFF]/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14 pb-14 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Uji Kemampuan{' '}
              <span className="bg-gradient-to-r from-[#2A38B8] via-[#3F55F0] to-[#4A8BFF] bg-clip-text text-transparent">
                Beradaptasi
              </span>
              , Raih Masa Depan Lebih Siap
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="text-base sm:text-lg text-[#3B4670] leading-relaxed max-w-xl"
            >
              Platform <em className="pr-0.5">dynamic assessment</em>{' '}
              untuk pendidikan vokasi (SMK) dan industri, yang menguji
              kemampuan beradaptasi siswa saat kondisi kerja berubah — bukan sekadar hafalan prosedur.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => onEnterDemo('sesi')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2455F0] hover:bg-[#1E3FC4] text-white text-sm font-bold shadow-lg shadow-[#2455F0]/30 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Mulai Penilaian
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onEnterDemo('sesi')}
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/80 border border-[#2455F0]/50 text-[#2455F0] text-sm font-bold hover:bg-white transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-[#2455F0]" />
                Lihat Demo
              </button>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-x-8 gap-y-3 pt-3"
            >
              {[
                { icon: ShieldCheck, a: 'Terpercaya', b: 'oleh Industri' },
                { icon: GraduationCap, a: 'Mendukung', b: 'Pendidikan Vokasi' },
                { icon: BarChart3, a: 'Berbasis', b: 'Analisis Mendalam' }
              ].map(({ icon: Icon, a, b }) => (
                <li key={a} className="flex items-center gap-2.5 text-xs leading-tight text-[#3B4670]">
                  <span className="w-9 h-9 rounded-full bg-[#E4EAFF] text-[#2455F0] grid place-items-center">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>
                    <b className="block text-[#0F1B4A]">{a}</b>
                    {b}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="lg:col-span-6 relative"
          >
            <HeroSwoosh className="absolute -right-10 -top-14 w-[115%] h-auto -z-0 pointer-events-none" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-[#3F55F0]/20 ring-4 ring-white aspect-[4/3] bg-[#DCE5FF]">
              <img
                src="/images/hero/hero-vocational-lab.jpg"
                alt="Siswa SMK merakit panel kendali listrik di laboratorium"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-[#3F55F0]/25 via-transparent to-transparent" />
            </div>

            {/* IA card */}
            <motion.div
              {...float(0, 8)}
              className="absolute -top-4 left-2 sm:-left-6 w-44 rounded-3xl bg-white/90 backdrop-blur-md border border-white shadow-xl p-4"
            >
              <p className="text-[11px] font-bold text-[#0F1B4A]">Indeks Adaptasi (IA)</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="relative w-[72px] h-[72px] shrink-0">
                  <svg viewBox="0 0 72 72" className="-rotate-90 w-full h-full" aria-hidden>
                    <circle cx="36" cy="36" r="30" fill="none" stroke="#E4EAFF" strokeWidth="8" />
                    <motion.circle
                      cx="36"
                      cy="36"
                      r="30"
                      fill="none"
                      stroke="url(#iaGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 30}
                      initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - 0.82) }}
                      transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
                    />
                    <defs>
                      <linearGradient id="iaGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#16A34A" />
                        <stop offset="100%" stopColor="#4A8BFF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-center leading-none">
                    <div>
                      <CountUp to={82} className="text-xl font-black" />
                      <span className="block text-[8px] text-[#5B6585]">/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-1 h-10" aria-hidden>
                  {[40, 62, 85].map((h, i) => (
                    <motion.span
                      key={h}
                      className="w-2 rounded-sm bg-[#3F55F0]"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.7, ease: EASE, delay: 0.9 + i * 0.12 }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs font-extrabold text-[#2A38B8] leading-tight">Mahir Beradaptasi</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────── MASALAH → SOLUSI ───────── */}
      <section id="tentang" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Reveal className="relative rounded-[2rem] bg-gradient-to-br from-white via-[#EEF2FF] to-[#E2E9FF] border border-white shadow-lg shadow-[#3F55F0]/5 p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center overflow-hidden">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">Masalahnya?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Portofolio dan ujian biasa hanya membuktikan siswa bisa{' '}
              <span className="text-[#2455F0]">mengulang</span> langkah yang sama.
            </h2>
            <p className="text-sm text-[#3B4670] leading-relaxed">
              Adaptiv memberi tugas dasar, lalu mengubah tepat satu kondisi: bahan, alat, ukuran, beban, waktu,
              spesifikasi, lingkungan, atau komponen rusak.
            </p>
          </div>

          <div aria-hidden className="hidden lg:flex lg:col-span-1 justify-center">
            <svg viewBox="0 0 80 40" className="w-20 text-[#7C8FF0]">
              <motion.path
                d="M2 32 C 22 4, 52 4, 74 20 M74 20 L64 18 M74 20 L68 29"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">Solusi!</span>
            <h3 className="text-xl font-extrabold leading-tight">Adaptiv: Penilaian Adaptasi untuk Dunia Kerja Nyata</h3>
            <p className="text-xs text-[#3B4670] leading-relaxed">
              Siswa harus menyesuaikan diri, dan prosesnya dinilai melalui skenario yang dinamis dan realistis.
            </p>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white shadow-xl border border-[#E3E8F8] p-4">
              <p className="text-[11px] font-bold">Permintaan Klien:</p>
              <p className="text-[11px] text-[#3B4670] leading-snug">
                Ubah saklar menjadi <b>saklar tukar</b> (kendali 2 arah).
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <motion.div animate={{ scale: switched ? 0.92 : 1, opacity: switched ? 0.5 : 1 }}>
                  <WallSwitch rockers={1} className="w-12 h-15" />
                </motion.div>
                <ArrowRight className="w-5 h-5 text-[#2455F0] shrink-0" />
                <motion.div animate={{ scale: switched ? 1.05 : 0.92, opacity: switched ? 1 : 0.5 }}>
                  <WallSwitch rockers={2} className="w-12 h-15" />
                </motion.div>
                <motion.div animate={{ scale: switched ? 1.1 : 1 }} transition={{ duration: 0.5 }}>
                  <Bulb on={switched} className="w-12 h-15" />
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────── ALUR PENILAIAN ───────── */}
      <section id="fitur" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Reveal className="text-center space-y-2 mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">Alur Penilaian</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">6 Langkah Sederhana, Penilaian Mendalam</h2>
        </Reveal>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 rounded-3xl bg-white/80 border border-[#E3E8F8] shadow-sm lg:divide-x divide-[#E3E8F8]"
        >
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <motion.li key={title} variants={fadeUp} className="group relative p-5 text-center space-y-2 hover:bg-[#F3F6FF] transition-colors first:rounded-l-3xl last:rounded-r-3xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#2455F0] text-white text-[11px] font-bold grid place-items-center shadow-md ring-4 ring-[#F6F8FF]">
                {i + 1}
              </span>
              <Icon className="w-6 h-6 mx-auto mt-2 text-[#1E2A63] transition-transform duration-300 group-hover:scale-125 group-hover:text-[#2455F0]" />
              <h3 className="text-[13px] font-extrabold">{title}</h3>
              <p className="text-[11px] text-[#5B6585] leading-snug">{desc}</p>
            </motion.li>
          ))}
        </motion.ol>
      </section>

      {/* ───────── 5 DIMENSI ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 grid lg:grid-cols-12 gap-8 items-start">
        <Reveal className="lg:col-span-4 space-y-3 lg:pt-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">Sistem Penilaian</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">5 Dimensi Penilaian dengan Indeks Adaptasi</h2>
          <p className="text-sm text-[#3B4670] leading-relaxed">
            Dinilai dari 5 dimensi utama dengan bobot berbeda, dan digabung menjadi <b>Indeks Adaptasi (IA)</b> 0–100.
          </p>
          <button
            onClick={() => onEnterDemo('sesi')}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#2455F0] text-[#2455F0] text-sm font-bold hover:bg-[#2455F0] hover:text-white transition-colors"
          >
            Pelajari Detail
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>

        <div className="lg:col-span-8 space-y-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 sm:grid-cols-5 gap-3"
          >
            {DIMENSIONS.map(({ icon: Icon, title, weight, tone, fg }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`rounded-3xl bg-gradient-to-b ${tone} p-4 text-center border border-white shadow-sm`}
              >
                <Icon className={`w-8 h-8 mx-auto ${fg}`} />
                <p className={`mt-2 text-sm font-extrabold ${fg}`}>{title}</p>
                <p className={`text-3xl font-black ${fg}`}>
                  <CountUp to={weight} />%
                </p>
                <p className="text-[11px] text-[#5B6585] font-medium">0–4</p>
              </motion.div>
            ))}
          </motion.div>

          <Reveal className="grid sm:grid-cols-2 rounded-2xl bg-white/80 border border-[#E3E8F8] divide-y sm:divide-y-0 sm:divide-x divide-[#E3E8F8]">
            <div className="flex items-center gap-3 p-4">
              <TrendingUp className="w-6 h-6 text-[#2455F0] shrink-0" />
              <div>
                <p className="text-xs font-extrabold">Transfer Gap</p>
                <p className="text-[11px] text-[#5B6585]">Selisih antara tugas dasar dan tugas yang berubah.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <BarChart3 className="w-6 h-6 text-[#2455F0] shrink-0" />
              <div>
                <p className="text-xs font-extrabold">Level Adaptasi</p>
                <p className="text-[11px] text-[#5B6585]">
                  Dari <b>Tergantung Prosedur</b> hingga <b>Mahir Beradaptasi</b>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── PASPOR KEMAMPUAN ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-[#E8EEFF] via-[#EEF2FF] to-[#DCE6FF] border border-white shadow-lg shadow-[#3F55F0]/5 p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center overflow-hidden">
          <motion.div
            aria-hidden
            animate={reduce ? {} : { rotate: [0, 6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#4A8BFF]/20 blur-2xl"
          />

          {/* Passport mock */}
          <Reveal className="lg:col-span-7">
            <motion.div
              whileHover={reduce ? {} : { rotateX: 3, rotateY: -3 }}
              style={{ transformPerspective: 900 }}
              className="rounded-3xl bg-white shadow-2xl p-5 border border-[#E3E8F8]"
            >
              <div className="text-sm font-extrabold mb-3 flex items-center gap-2">
                <img src="/brand/adaptiv-symbol-nobg.png" alt="" className="h-6 w-auto" /> Paspor Kemampuan
              </div>
              <div className="grid sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3 w-full max-w-md mx-auto self-center">
                  <Radar scores={[3, 4, 3, 3, 4]} labels={RADAR_LABELS} showLabels size={260} />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div className="rounded-2xl bg-[#F3F6FF] p-3">
                    <p className="text-[10px] text-[#5B6585] font-semibold">Level Anda</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-9 h-9 rounded-full bg-[#FFE9A8] text-[#B7791F] grid place-items-center">
                        <Crown className="w-5 h-5" />
                      </span>
                      <p className="text-sm font-extrabold leading-tight">Cakap Beradaptasi</p>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-[#DCE3F8] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#2455F0]"
                        initial={{ width: 0 }}
                        whileInView={{ width: '72%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
                      />
                    </div>
                    <p className="text-right text-[10px] font-bold mt-1">72 / 100</p>
                  </div>
                  <div className="rounded-2xl bg-[#F3F6FF] p-3">
                    <p className="text-[10px] font-semibold mb-1">Tren Skill</p>
                    <svg viewBox="0 0 120 40" className="w-full" aria-hidden>
                      <motion.polyline
                        points="2,32 25,26 48,30 72,16 96,20 118,6"
                        fill="none"
                        stroke="#2455F0"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
                      />
                    </svg>
                  </div>
                  <div className="rounded-2xl bg-[#F3F6FF] p-3 flex items-center gap-3">
                    <span className="w-14 h-14 shrink-0 rounded-xl bg-white border border-[#E3E8F8] grid place-items-center text-[#0F1B4A]">
                      <QrCode className="w-10 h-10" aria-hidden />
                    </span>
                    <p className="text-[11px] font-bold leading-tight">
                      Verifikasi QR
                      <span className="block font-medium text-[#5B6585]">Cek keaslian paspor</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </Reveal>

          <Reveal index={1} className="lg:col-span-5 space-y-4 relative">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">Hasil Nyata</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">Paspor Kemampuan untuk Masa Depan</h2>
            <p className="text-sm text-[#3B4670] leading-relaxed">
              Hasil penilaian akan masuk ke Paspor Kemampuan, dilengkapi grafik radar, tren skill, dan verifikasi QR.
            </p>
            <ul className="space-y-2">
              {['Visualisasi lengkap', 'Terpercaya & transparan', 'Siap untuk dunia industri'].map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.12 }}
                  className="flex items-center gap-2 text-sm font-semibold"
                >
                  <CircleCheck className="w-5 h-5 text-[#2455F0]" /> {t}
                </motion.li>
              ))}
            </ul>
            <motion.div {...float(0.5, 6)} className="absolute -right-2 -bottom-24 hidden lg:block" aria-hidden>
              <TrophyArt className="w-28 h-auto" />
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ───────── UNTUK SIAPA ───────── */}
      <section id="untuk-siapa" className="scroll-mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <Reveal className="rounded-3xl bg-white/80 border border-[#E3E8F8] p-5 grid lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-4">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">Untuk Siapa?</span>
            <p className="text-xs text-[#3B4670] mt-2">Adaptiv hadir untuk semua pihak yang peduli pada kualitas SDM vokasi.</p>
          </div>
          <ul className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {AUDIENCE.map(({ icon: Icon, title, sub }) => (
              <motion.li
                key={title}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center gap-1 rounded-2xl p-3 hover:bg-[#F3F6FF] transition-colors"
              >
                <Icon className="w-7 h-7 text-[#1E2A63]" />
                <span className="text-[11px] font-bold leading-tight">{title}</span>
                {sub && <span className="text-[10px] text-[#5B6585] leading-tight">{sub}</span>}
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="scroll-mt-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <Reveal className="text-center space-y-2 mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DDE6FF] text-[#2A38B8] text-[11px] font-bold">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Pertanyaan Seputar Adaptiv</h2>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <Reveal key={f.q} index={i} className="rounded-2xl bg-white border border-[#E3E8F8] overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left text-sm font-bold hover:bg-[#F6F8FF] transition-colors"
                >
                  {f.q}
                  <ChevronDown className={`w-4 h-4 text-[#2455F0] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs text-[#5B6585] leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#2A38B8] via-[#2455F0] to-[#4A8BFF] text-white p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          <motion.div
            aria-hidden
            animate={reduce ? {} : { x: ['-30%', '130%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-white/10 blur-md"
          />
          <Logo variant="white" size="lg" />
          <span aria-hidden className="hidden lg:block w-px self-stretch bg-white/30" />
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-snug">
              Siap mengukur kemampuan adaptasi untuk masa depan yang lebih siap?
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Mulai sekarang dan jadilah bagian dari pendidikan vokasi yang lebih adaptif.
            </p>
          </div>
          <button
            onClick={() => onEnterDemo('sesi')}
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#2455F0] text-sm font-bold shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Mulai Sekarang
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </Reveal>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-[#E3E8F8] bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5B6585]">
          <p>© 2026 Adaptiv. Hak cipta dilindungi undang-undang.</p>
          <button onClick={onOpenBrandKit} className="font-semibold text-[#2455F0] hover:underline">
            Unduh Brand Kit
          </button>
        </div>
      </footer>
    </div>
  );
};
