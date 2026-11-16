import { useMemo, useState } from 'react';
import { Check, Copy, Download, Search } from 'lucide-react';
import type { GenericRow, NilaiRow, SessionUser } from '../types.ts';
import { copyTsv, downloadCsv } from '../utils/cryptoAndExport.ts';

interface NilaiPageProps {
  user: SessionUser;
  nilai: NilaiRow[];
  onSaveScore: (id: number, newScore: number) => void;
}

const NILAI_COLS = ['id', 'nim', 'nama', 'mk', 'angka', 'huruf', 'diubah_oleh', 'diubah_pada'];

export function NilaiPage({ user, nilai, onSaveScore }: NilaiPageProps) {
  const [query, setQuery] = useState('');
  const [draftScores, setDraftScores] = useState<Record<number, string>>({});
  const [copiedCount, setCopiedCount] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const canEdit = user.role === 'dosen' || user.role === 'admin';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return nilai;
    return nilai.filter(
      (row) =>
        row.nim.toLowerCase().includes(q) ||
        row.nama.toLowerCase().includes(q) ||
        row.mk.toLowerCase().includes(q),
    );
  }, [nilai, query]);

  const visibleRows = useMemo(() => filtered.slice(0, 80), [filtered]);

  const handleSave = (row: NilaiRow) => {
    setValidationError(null);
    const rawVal = draftScores[row.id] ?? String(row.angka);
    const num = Number(rawVal);
    if (!Number.isFinite(num) || rawVal.trim() === '' || num < 0 || num > 100) {
      setValidationError(`Nilai untuk ${row.nim} (${row.mk}) harus berupa angka 0 sampai 100.`);
      return;
    }
    const rounded = Math.round(num);
    onSaveScore(row.id, rounded);
    setDraftScores((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
  };

  const handleDownloadCsv = () => {
    downloadCsv('siakad_nilai.csv', NILAI_COLS, filtered as unknown as GenericRow[]);
  };

  const handleCopyTsv = async () => {
    const ok = await copyTsv(NILAI_COLS, filtered as unknown as GenericRow[]);
    if (ok) {
      setCopiedCount(filtered.length);
      window.setTimeout(() => setCopiedCount(null), 2200);
    }
  };

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
          Daftar Nilai Akademik
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
          Entri nilai mata kuliah mahasiswa. Maksimal 80 baris ditampilkan per tampilan; gunakan filter NIM untuk mempersempit hasil.
        </p>
      </header>

      {validationError && (
        <div
          role="alert"
          className="rounded-lg border border-[var(--status-red-border)] bg-[var(--status-red-bg)] px-4 py-2.5 text-[13px] text-[var(--status-red-text)]"
        >
          {validationError}
        </div>
      )}

      <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-color)] flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15.5px] font-semibold text-[var(--text-main)]">
              Entri nilai
            </h2>
            <span className="inline-flex items-center rounded px-2 py-0.5 text-[11.5px] font-medium tabular-nums bg-[var(--bg-table-head)] text-[var(--text-muted)] border border-[var(--border-color)]">
              Menampilkan {visibleRows.length} dari {filtered.length} baris
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:flex-initial min-w-[170px]">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter NIM / nama / MK..."
                aria-label="Filter NIM atau mata kuliah"
                className="w-full sm:w-[220px] rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] pl-8 pr-2.5 py-1.5 text-[12.5px] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] hover:bg-[var(--bg-table-head)] px-2.5 py-1.5 text-[12.5px] font-medium text-[var(--text-main)] whitespace-nowrap cursor-pointer transition-colors"
            >
              <Download size={13} aria-hidden="true" />
              Unduh CSV
            </button>

            <button
              type="button"
              onClick={handleCopyTsv}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] hover:bg-[var(--bg-table-head)] px-2.5 py-1.5 text-[12.5px] font-medium text-[var(--text-main)] whitespace-nowrap cursor-pointer transition-colors"
            >
              {copiedCount !== null ? (
                <>
                  <Check size={13} className="text-[var(--status-green-text)]" aria-hidden="true" />
                  <span className="text-[var(--status-green-text)] tabular-nums">
                    Tersalin ({copiedCount})
                  </span>
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" />
                  Salin untuk Excel
                </>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[540px]">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-[var(--bg-table-head)] border-b border-[var(--border-color)]">
              <tr>
                {NILAI_COLS.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-3 py-2 font-semibold text-[12px] text-[var(--text-main)] whitespace-nowrap border-b border-[var(--border-color)]"
                  >
                    {col}
                  </th>
                ))}
                {canEdit && (
                  <th
                    scope="col"
                    className="px-3 py-2 font-semibold text-[12px] text-[var(--text-main)] whitespace-nowrap border-b border-[var(--border-color)]"
                  >
                    Ubah
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={NILAI_COLS.length + (canEdit ? 1 : 0)}
                    className="px-4 py-8 text-center text-[13px] text-[var(--text-muted)]"
                  >
                    Tidak ada entri nilai yang cocok dengan filter NIM.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const draft = draftScores[row.id] ?? String(row.angka);
                  return (
                    <tr key={row.id} className="hover:bg-[var(--bg-table-hover)]">
                      <td className="px-3 py-2 font-mono text-[12px] tabular-nums">{row.id}</td>
                      <td className="px-3 py-2 font-mono text-[12px] tabular-nums whitespace-nowrap">
                        {row.nim}
                      </td>
                      <td className="px-3 py-2">{row.nama}</td>
                      <td className="px-3 py-2">{row.mk}</td>
                      <td className="px-3 py-2 font-mono text-[12.5px] tabular-nums font-semibold">
                        {row.angka}
                      </td>
                      <td className="px-3 py-2 font-mono text-[12.5px] font-semibold">
                        {row.huruf}
                      </td>
                      <td className="px-3 py-2 font-mono text-[12px]">{row.diubah_oleh}</td>
                      <td className="px-3 py-2 font-mono text-[12px] tabular-nums whitespace-nowrap">
                        {row.diubah_pada}
                      </td>
                      {canEdit && (
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={draft}
                              onChange={(e) =>
                                setDraftScores((prev) => ({
                                  ...prev,
                                  [row.id]: e.target.value,
                                }))
                              }
                              aria-label={`Nilai baru untuk ${row.nim} ${row.mk}`}
                              className="w-16 rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] px-2 py-1 text-[12.5px] font-mono tabular-nums text-[var(--text-main)]"
                            />
                            <button
                              type="button"
                              onClick={() => handleSave(row)}
                              className="rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-2.5 py-1 text-[12px] font-medium text-white cursor-pointer transition-colors"
                            >
                              Simpan
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
