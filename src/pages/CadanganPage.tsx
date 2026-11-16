import { useState } from 'react';
import { DataTablePanel } from '../components/DataTablePanel.tsx';
import type {
  BackupConfigRow,
  BackupLogRow,
  BackupTestRow,
  GenericRow,
} from '../types.ts';

export interface RestoreTestBanner {
  tanggal: string;
  berkas: string;
  hasil: 'BERHASIL' | 'GAGAL';
  catatan: string;
  berita_acara: string;
}

interface CadanganPageProps {
  cfg: BackupConfigRow[];
  tests: BackupTestRow[];
  rows: BackupLogRow[];
  lastTestResult: RestoreTestBanner | null;
  onRunRestoreTest: (row: BackupLogRow) => Promise<void>;
}

const CFG_COLS = ['kunci', 'nilai', 'catatan'];
const TESTS_COLS = ['tanggal', 'berkas', 'hasil', 'pelaksana', 'berita_acara', 'catatan'];
const LOG_COLS = [
  'tanggal',
  'mulai',
  'selesai',
  'ukuran_mb',
  'status',
  'lokasi',
  'berkas',
  'checksum',
];

export function CadanganPage({
  cfg,
  tests,
  rows,
  lastTestResult,
  onRunRestoreTest,
}: CadanganPageProps) {
  const [runningFile, setRunningFile] = useState<string | null>(null);

  const handleTest = async (row: BackupLogRow) => {
    const key = `${row.tanggal}-${row.berkas}`;
    setRunningFile(key);
    try {
      await onRunRestoreTest(row);
    } finally {
      setRunningFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
              Cadangan &amp; uji pulih
            </h1>
            <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
              Konfigurasi pencadangan, berita acara uji pulih, dan log cadangan harian 92 hari.
            </p>
          </div>
          <span className="inline-flex items-center rounded bg-[var(--accent-soft)] border border-[var(--border-color)] px-2.5 py-1 text-[12px] font-medium text-[var(--accent)] whitespace-nowrap">
            Kendali terkait: K-05
          </span>
        </div>
      </header>

      {/* Mandatory yellow warning banner */}
      <div
        role="note"
        className="rounded-lg border border-[var(--status-yellow-border)] bg-[var(--status-yellow-bg)] px-4 py-3 text-[13px] text-[var(--status-yellow-text)]"
      >
        <strong>Pengujian ulang (reperformance).</strong> Tombol <strong>Uji pulih</strong> memeriksa isi berkas cadangan simulasi (kelengkapan arsip dan checksum SHA-256) dan mencatat hasilnya pada tabel berita acara.
      </div>

      {/* Latest restore test result banner */}
      {lastTestResult && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-[13px] ${
            lastTestResult.hasil === 'BERHASIL'
              ? 'bg-[var(--status-green-bg)] text-[var(--status-green-text)] border-[var(--status-green-border)]'
              : 'bg-[var(--status-red-bg)] text-[var(--status-red-text)] border-[var(--status-red-border)]'
          }`}
        >
          <div className="font-semibold">
            Hasil Uji Pulih ({lastTestResult.berita_acara}) — {lastTestResult.hasil}
          </div>
          <div className="mt-0.5 text-[12.5px]">
            Tanggal uji: <span className="font-mono tabular-nums">{lastTestResult.tanggal}</span> | Berkas:{' '}
            <span className="font-mono">{lastTestResult.berkas}</span> — {lastTestResult.catatan}
          </div>
        </div>
      )}

      {/* Section 1: Konfigurasi */}
      <DataTablePanel
        title="Konfigurasi pencadangan"
        cols={CFG_COLS}
        rows={cfg as unknown as GenericRow[]}
        exportFilenamePrefix="cadangan_konfigurasi"
        maxHeightClass="max-h-[360px]"
      />

      {/* Section 2: Berita acara uji pulih */}
      <DataTablePanel
        title="Berita acara uji pulih"
        cols={TESTS_COLS}
        rows={tests as unknown as GenericRow[]}
        exportFilenamePrefix="cadangan_berita_acara"
        maxHeightClass="max-h-[380px]"
      />

      {/* Section 3: Log cadangan 92 hari with Uji pulih action */}
      <DataTablePanel
        title="Log cadangan harian (92 hari)"
        cols={LOG_COLS}
        rows={rows as unknown as GenericRow[]}
        exportFilenamePrefix="cadangan_log_92_hari"
        maxHeightClass="max-h-[500px]"
        actionHeader="Aksi"
        renderAction={(rawRow) => {
          const row = rawRow as unknown as BackupLogRow;
          const key = `${row.tanggal}-${row.berkas}`;
          const isRunning = runningFile === key;
          return (
            <button
              type="button"
              disabled={isRunning}
              onClick={() => handleTest(row)}
              className="rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-2.5 py-1 text-[12px] font-medium text-white cursor-pointer transition-colors disabled:opacity-60"
            >
              {isRunning ? 'Menguji...' : 'Uji pulih'}
            </button>
          );
        }}
      />
    </div>
  );
}
