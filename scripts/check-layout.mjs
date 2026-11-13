// Memeriksa bahwa tidak ada gulir horizontal pada halaman di lebar ponsel.
// Memakai build di dist/ (jalankan `npm run build` dulu). Browser: Chromium milik Playwright.
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4179;
const BASE = `http://127.0.0.1:${PORT}/`;
const WIDTHS = [320, 360, 390, 768];

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
  await page.waitForTimeout(700); // tunggu animasi masuk selesai
  const r = await page.evaluate(measure, width);
  const bad = r.scrollWidth > r.clientWidth;
  if (bad) failures++;
  console.log(`${bad ? 'GAGAL' : 'ok   '} ${String(width).padStart(4)}px  ${name}${bad ? `  scrollWidth=${r.scrollWidth} > ${r.clientWidth}  ${JSON.stringify(r.offenders)}` : ''}`);
}

async function openTab(page, label) {
  const menu = page.getByRole('button', { name: /Buka menu/ });
  if (await menu.count()) await menu.click();
  await page.getByRole('button', { name: label }).first().click();
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
    await check(page, width, 'demo: sesi penilaian');
    for (const [label, name] of [
      [/Pustaka Tugas/, 'demo: pustaka'],
      [/Paspor Kemampuan \(Radar/, 'demo: paspor'],
      [/Portal Mitra/, 'demo: portal industri'],
      [/Dasbor Manajemen/, 'demo: dasbor lembaga'],
    ]) {
      await openTab(page, label);
      await check(page, width, name);
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
