import { DataTablePanel } from '../components/DataTablePanel.tsx';
import type { GenericRow, PolicyRow } from '../types.ts';

interface DokumenPageProps {
  policies: PolicyRow[];
}

export function DokumenPage({ policies }: DokumenPageProps) {
  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
          Pustaka Kebijakan
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
          Kriteria audit internal berupa kebijakan, standar teknis, dan prosedur operasional yang berlaku di Universitas Mitra (simulasi).
        </p>
      </header>

      <DataTablePanel
        title="Dokumen kebijakan, standar, dan SOP"
        cols={['dokumen', 'versi', 'pasal', 'isi']}
        rows={policies as unknown as GenericRow[]}
        searchPlaceholder="Cari dokumen, pasal, atau isi..."
        exportFilenamePrefix="pustaka_kebijakan"
        maxHeightClass="max-h-[560px]"
      />
    </div>
  );
}
