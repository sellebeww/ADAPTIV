// Menjaga tes tetap deterministik: zona waktu tetap UTC di proses tes dan worker-nya.
export default function setup() {
  process.env.TZ = 'UTC';
}
