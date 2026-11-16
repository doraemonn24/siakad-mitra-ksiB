import { DataTablePanel } from '../components/DataTablePanel.tsx';
import type { GenericRow, StudentRow } from '../types.ts';

interface MahasiswaPageProps {
  students: StudentRow[];
}

export function MahasiswaPage({ students }: MahasiswaPageProps) {
  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
          Daftar Mahasiswa
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
          Direktori mahasiswa aktif dan terdaftar pada SIAKAD Universitas Mitra (simulasi).
        </p>
      </header>

      <DataTablePanel
        title="Mahasiswa terdaftar"
        cols={['nim', 'nama', 'prodi', 'angkatan', 'email']}
        rows={students as unknown as GenericRow[]}
        searchPlaceholder="Cari nama atau NIM..."
        exportFilenamePrefix="siakad_mahasiswa"
        maxHeightClass="max-h-[540px]"
      />
    </div>
  );
}
