// Memeriksa bahwa tidak ada gulir horizontal pada halaman di lebar ponsel.
// Memakai build di dist/ (jalankan `npm run build` dulu). Browser: Chromium milik Playwright.
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4179;
const BASE = `http://127.0.0.1:${PORT}/`;
const WIDTHS = [320, 360, 390, 480, 768, 1024, 1280, 1440, 1920];

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
  stdio: 'ignore',
});
const stop = () => server.kill();
process.on('exit', stop);

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {
      /* belum siap */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Server preview tidak menyala');
}

// Elemen yang melewati tepi kanan viewport dan tidak berada di dalam wadah gulir/terpotong yang disengaja.
function measure(width) {
  const de = document.documentElement;
  const offenders = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.right <= width + 1) return;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      if (getComputedStyle(a).overflowX !== 'visible') return;
    }
    offenders.push(`${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).slice(0, 60)} (kanan=${Math.round(r.right)})`);
  });
  return { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, offenders: offenders.slice(0, 5) };
}

let failures = 0;
async function check(page, width, name) {
  await page.waitForTimeout(500); // tunggu animasi masuk selesai
  const r = await page.evaluate(measure, width);
  const bad = r.scrollWidth > r.clientWidth;
  if (bad) failures++;
  console.log(`${bad ? 'GAGAL' : 'ok   '} ${String(width).padStart(4)}px  ${name}${bad ? `  scrollWidth=${r.scrollWidth} > ${r.clientWidth}  ${JSON.stringify(r.offenders)}` : ''}`);
}

async function switchRole(page, label) {
  const burger = page.getByRole('button', { name: /Buka menu/ });
  const mobile = (await burger.count()) > 0;
  if (mobile) await burger.click();
  else await page.getByRole('button', { name: /Ganti peran simulasi/ }).click();
  const option = page.getByRole('button', { name: label }).first();
  if (await option.count()) await option.click();
  if (mobile && (await page.getByRole('button', { name: /Tutup menu/ }).count())) {
    await page.getByRole('button', { name: /Tutup menu/ }).click();
  }
  await page.waitForTimeout(300);
}

async function openTab(page, label, role) {
  const menu = page.getByRole('button', { name: /Buka menu/ });
  if (await menu.count()) {
    await menu.click();
  } else if (role && !(await page.getByRole('button', { name: label }).count())) {
    // Di desktop, tab Portal Industri dan Dasbor Lembaga hanya muncul untuk perannya masing-masing
    await switchRole(page, role);
  }
  // Ganti peran di desktop sudah membuka tab terkait; selain itu klik tab-nya
  const tab = page.getByRole('button', { name: label }).first();
  if (await tab.count()) await tab.click();
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(BASE);
    await check(page, width, 'beranda');
    await page.goto(`${BASE}?verifikasi=ADAPTIV-TIDAK-ADA`);
    await check(page, width, 'verifikasi (kode tidak dikenal)');
    await page.goto(`${BASE}?verifikasi=ADAPT-2026-TITL-0891`);
    await check(page, width, 'verifikasi (kode valid)');
    await page.goto(BASE);
    await page.getByRole('button', { name: 'Mulai Sekarang' }).first().click();

    // Telusuri sesi dari awal: fase 0 sampai 5 sebagai peserta, fase 6 (rubrik) sebagai penilai
    await page.getByRole('button', { name: 'Mulai Sesi Baru' }).click();
    const advance = page.locator('main button:enabled', { hasText: /\(Fase \d\)|^Simpan Refleksi/i });
    for (let phase = 0; phase <= 5; phase++) {
      await check(page, width, `demo: sesi fase ${phase}`);
      const lock = page.getByRole('button', { name: /Kunci & Kirim Prediksi/ });
      if (phase === 3 && (await lock.count())) await lock.click();
      else if (await advance.count()) await advance.first().click();
      await page.waitForTimeout(200);
    }
    await check(page, width, 'demo: sesi fase 6 (peserta)');
    await switchRole(page, /Penilai/);
    await check(page, width, 'demo: sesi fase 6 (rubrik penilai)');
    const finalize = page.getByRole('button', { name: /Finalisasi|Terbitkan|Selesaikan/i }).first();
    if ((await finalize.count()) && (await finalize.isEnabled())) {
      await finalize.click();
      await check(page, width, 'demo: sesi fase 7 (hasil)');
    }
    await switchRole(page, /Siswa|Peserta/);

    // Menu seluler atau menu peran
    const burger = page.getByRole('button', { name: /Buka menu/ });
    if (await burger.count()) {
      await burger.click();
      await check(page, width, 'demo: menu seluler terbuka');
      await page.getByRole('button', { name: /Tutup menu/ }).click();
    } else {
      await page.getByRole('button', { name: /Ganti peran simulasi/ }).click();
      await check(page, width, 'demo: menu peran terbuka');
      await page.keyboard.press('Escape');
    }

    for (const [label, name, role] of [
      [/Pustaka/, 'demo: pustaka', null],
      [/Paspor Kemampuan|Paspor/, 'demo: paspor', null],
      [/Portal Mitra|Industri/, 'demo: portal industri', /Mitra Industri/],
      [/Dasbor/, 'demo: dasbor lembaga', /Admin Lembaga/],
    ]) {
      await openTab(page, label, role);
      await check(page, width, name);
      if (name === 'demo: pustaka') {
        const basic = page.getByRole('button', { name: /Dasar/ }).first();
        if (await basic.count()) {
          await basic.click();
          await check(page, width, 'demo: pustaka, sirkuit dasar');
        }
      }
      if (name === 'demo: paspor') {
        const det = page.getByText('Lihat data grafik sebagai tabel');
        if (await det.count()) {
          await det.click();
          await check(page, width, 'demo: paspor, tabel data terbuka');
        }
      }
    }

    // Modal Brand Kit dari beranda
    await page.goto(BASE);
    const brand = page.getByRole('button', { name: /Brand Kit/ }).first();
    if (await brand.count()) {
      await brand.click();
      await check(page, width, 'beranda: modal Brand Kit');
    }
    await page.close();
  }
  await browser.close();
} finally {
  stop();
}

if (failures > 0) {
  console.error(`\n${failures} pemeriksaan gagal: ada gulir horizontal.`);
  process.exit(1);
}
console.log('\nTidak ada gulir horizontal.');
