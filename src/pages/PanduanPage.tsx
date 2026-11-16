import { DataTablePanel } from '../components/DataTablePanel.tsx';
import type { GenericRow } from '../types.ts';

interface PanduanPageProps {
  pop: [string, number, string][];
  ctrl: [string, string, string, string][];
}

const SCOPE_ITEMS = [
  {
    label: 'Sistem',
    value:
      'SIAKAD Universitas Mitra v3.4.7 modul KRS, nilai, presensi, keuangan/UKT, basis data PostgreSQL produksi, 2 peladen aplikasi, 1 peladen web, 1 peladen berkas, 1 peladen cadangan',
  },
  {
    label: 'Lingkungan',
    value: 'Produksi dan ruang peladen Gedung Rektorat',
  },
  {
    label: 'Periode bukti',
    value: '1 Juli – 30 September 2026',
  },
  {
    label: 'Auditi',
    value: 'UPT TIK, BAAK, Biro Kepegawaian, Biro Keuangan, Sarana dan Prasarana',
  },
  {
    label: 'Usulan pengecualian',
    value:
      'Lingkungan pengembangan/uji, sistem pembayaran UKT milik bank mitra, surel kampus, pengadaan pemasok, pengujian aktif',
  },
  {
    label: 'Batas etika',
    value: 'Pengujian aktif hanya pada akun simulasi dan dengan izin tertulis dosen',
  },
];

const EVIDENCE_TECHNIQUES: GenericRow[] = [
  {
    teknik: 'Pengujian ulang',
    keandalan: 5,
    cara_di_aplikasi:
      'Jalankan tombol Uji pulih pada halaman Cadangan & uji pulih (#cadangan) untuk memeriksa keutuhan arsip dan checksum SHA-256, atau uji pencatatan pada formulir login (#sandi) dan pembaruan nilai (#nilai, #log).',
  },
  {
    teknik: 'Inspeksi teknis / CAAT',
    keandalan: 4,
    cara_di_aplikasi:
      'Periksa tabel pada Konsol TIK (#akun sampai #kripto), gunakan filter, unduh CSV atau salin untuk Excel guna mencocokkan silang antarpopulasi (mis. akun pengguna vs status pegawai SIMPEG).',
  },
  {
    teknik: 'Observasi',
    keandalan: 3,
    cara_di_aplikasi:
      'Telaah catatan pemeriksaan fisik, kondisi ruang peladen, dan utilitas pendukung pada halaman Fasilitas ruang peladen (#fasilitas).',
  },
  {
    teknik: 'Telaah dokumen',
    keandalan: 2,
    cara_di_aplikasi:
      'Periksa kebijakan, SOP, dan standar internal pada Pustaka kebijakan (#dokumen) serta berita acara uji pulih, tinjauan akses, dan laporan insiden pada Konsol TIK.',
  },
  {
    teknik: 'Wawancara',
    keandalan: 1,
    cara_di_aplikasi:
      'Baca catatan tanya-jawab auditi pada Ruang wawancara (#wawancara) untuk memperoleh konteks operasional; wajib dikuatkan dengan bukti lain berkeandalan lebih tinggi.',
  },
];

export function PanduanPage({ pop, ctrl }: PanduanPageProps) {
  const popRows: GenericRow[] = pop.map(([populasi, ukuran, kendali]) => ({
    populasi,
    ukuran,
    kendali,
  }));

  const ctrlRows: GenericRow[] = ctrl.map(
    ([kode, kendali_iso, halaman_bukti, kriteria_internal]) => ({
      kode,
      kendali_iso,
      halaman_bukti,
      kriteria_internal,
    }),
  );

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
          Objek &amp; Lingkup Audit
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
          Gambaran objek audit, ukuran populasi, pemetaan 13 kendali kandidat, dan teknik pengumpulan bukti pada simulasi SIAKAD Mitra.
        </p>
      </header>

      {/* Gambaran objek */}
      <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
          <h2 className="text-[15.5px] font-semibold text-[var(--text-main)]">
            Gambaran objek &amp; ruang lingkup audit
          </h2>
        </div>
        <dl className="divide-y divide-[var(--border-color)] text-[13.5px]">
          {SCOPE_ITEMS.map((item) => (
            <div
              key={item.label}
              className="px-4 py-3 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4"
            >
              <dt className="font-semibold text-[var(--text-main)]">{item.label}</dt>
              <dd className="text-[var(--text-main)]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <DataTablePanel
        title="Ukuran populasi"
        cols={['populasi', 'ukuran', 'kendali']}
        rows={popRows}
        exportFilenamePrefix="panduan_ukuran_populasi"
        searchPlaceholder="Saring populasi..."
        maxHeightClass="max-h-[420px]"
      />

      <DataTablePanel
        title="13 kendali kandidat dan sumber buktinya"
        cols={['kode', 'kendali_iso', 'halaman_bukti', 'kriteria_internal']}
        rows={ctrlRows}
        exportFilenamePrefix="panduan_13_kendali"
        searchPlaceholder="Saring kendali..."
        maxHeightClass="max-h-[480px]"
      />

      <DataTablePanel
        title="Teknik pengumpulan bukti"
        cols={['teknik', 'keandalan', 'cara_di_aplikasi']}
        rows={EVIDENCE_TECHNIQUES}
        exportFilenamePrefix="panduan_teknik_bukti"
        hideToolbar
        maxHeightClass="max-h-none"
      />
    </div>
  );
}
