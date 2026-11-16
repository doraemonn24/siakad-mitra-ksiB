import { useMemo, useState, type ReactNode } from 'react';
import { Check, Copy, Download, Search } from 'lucide-react';
import type { GenericRow } from '../types.ts';
import { copyTsv, downloadCsv } from '../utils/cryptoAndExport.ts';

interface DataTablePanelProps<T extends GenericRow> {
  title: string;
  cols: string[];
  rows: T[];
  note?: string;
  exportFilenamePrefix?: string;
  maxRows?: number;
  searchPlaceholder?: string;
  hideToolbar?: boolean;
  actionHeader?: string;
  renderAction?: (row: T, index: number) => ReactNode;
  maxHeightClass?: string;
}

function getStatusPillClass(val: string): string | null {
  const lower = val.trim().toLowerCase();
  if (
    lower === 'berhasil' ||
    lower === 'aktif' ||
    lower === 'lulus' ||
    lower === 'selesai' ||
    lower === 'ditutup' ||
    lower === 'sesuai'
  ) {
    return 'bg-[var(--status-green-bg)] text-[var(--status-green-text)] border border-[var(--status-green-border)]';
  }
  if (
    lower === 'gagal' ||
    lower === 'kritis' ||
    lower === 'tinggi' ||
    lower === 'keluar' ||
    lower === 'nonaktif' ||
    lower === 'terbuka' ||
    lower === 'belum'
  ) {
    return 'bg-[var(--status-red-bg)] text-[var(--status-red-text)] border border-[var(--status-red-border)]';
  }
  if (lower === 'sedang' || lower === 'peringatan' || lower === 'sebagian') {
    return 'bg-[var(--status-yellow-bg)] text-[var(--status-yellow-text)] border border-[var(--status-yellow-border)]';
  }
  return null;
}

const NUMERIC_OR_TIME_COLS = new Set([
  'id',
  'nim',
  'angkatan',
  'angka',
  'ukuran_mb',
  'sukses',
  'jumlah',
  'sandi_panjang',
  'umur_sandi_hari',
  'waktu',
  'tanggal',
  'mulai',
  'selesai',
  'diubah_pada',
  'pertama',
  'terakhir',
  'sandi_diubah',
  'tgl_tinjau',
  'ip',
  'port',
  'urutan',
  'prioritas',
]);

export function DataTablePanel<T extends GenericRow>({
  title,
  cols,
  rows,
  note,
  exportFilenamePrefix = 'data',
  maxRows,
  searchPlaceholder = 'Saring isi tabel...',
  hideToolbar = false,
  actionHeader,
  renderAction,
  maxHeightClass = 'max-h-[460px]',
}: DataTablePanelProps<T>) {
  const [query, setQuery] = useState('');
  const [copiedCount, setCopiedCount] = useState<number | null>(null);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      cols.some((col) => {
        const cell = row[col];
        return cell !== null && cell !== undefined && String(cell).toLowerCase().includes(q);
      }),
    );
  }, [rows, cols, query]);

  const visibleRows = useMemo(() => {
    if (maxRows !== undefined && maxRows > 0) {
      return filteredRows.slice(0, maxRows);
    }
    return filteredRows;
  }, [filteredRows, maxRows]);

  const handleDownloadCsv = () => {
    const safeName = exportFilenamePrefix
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
    downloadCsv(`${safeName || 'tabel'}.csv`, cols, filteredRows);
  };

  const handleCopyTsv = async () => {
    const ok = await copyTsv(cols, filteredRows);
    if (ok) {
      setCopiedCount(filteredRows.length);
      window.setTimeout(() => setCopiedCount(null), 2200);
    }
  };

  return (
    <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border-color)] flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[15.5px] font-semibold text-[var(--text-main)] leading-snug">
              {title}
            </h2>
            <span className="inline-flex items-center rounded px-2 py-0.5 text-[11.5px] font-medium tabular-nums bg-[var(--bg-table-head)] text-[var(--text-muted)] border border-[var(--border-color)]">
              {filteredRows.length === rows.length
                ? `${rows.length} baris`
                : `${filteredRows.length} / ${rows.length} baris`}
            </span>
          </div>
          {note ? (
            <p className="mt-1 text-[12.5px] text-[var(--text-muted)] leading-snug">{note}</p>
          ) : null}
        </div>

        {!hideToolbar && (
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
                placeholder={searchPlaceholder}
                aria-label={`Saring ${title}`}
                className="w-full sm:w-[210px] rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] pl-8 pr-2.5 py-1.5 text-[12.5px] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
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
        )}
      </div>

      {maxRows !== undefined && filteredRows.length > maxRows && (
        <div className="px-4 py-1.5 text-[12px] text-[var(--text-muted)] bg-[var(--bg-subtle)] border-b border-[var(--border-color)] tabular-nums">
          Menampilkan {maxRows} baris pertama dari {filteredRows.length} baris yang cocok. Gunakan kolom pencarian untuk mempersempit hasil.
        </div>
      )}

      <div className={`overflow-x-auto overflow-y-auto ${maxHeightClass}`}>
        <table className="w-full border-collapse text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[var(--bg-table-head)] border-b border-[var(--border-color)]">
            <tr>
              {cols.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-3 py-2 font-semibold text-[12px] text-[var(--text-main)] whitespace-nowrap border-b border-[var(--border-color)]"
                >
                  {col}
                </th>
              ))}
              {actionHeader && (
                <th
                  scope="col"
                  className="px-3 py-2 font-semibold text-[12px] text-[var(--text-main)] whitespace-nowrap border-b border-[var(--border-color)]"
                >
                  {actionHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={cols.length + (actionHeader ? 1 : 0)}
                  className="px-4 py-8 text-center text-[13px] text-[var(--text-muted)]"
                >
                  Tidak ada baris yang cocok dengan filter saat ini.
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[var(--bg-table-hover)] transition-colors align-top"
                >
                  {cols.map((col) => {
                    const raw = row[col];
                    const str = raw === null || raw === undefined ? '' : String(raw);

                    if (col === 'cuplikan') {
                      return (
                        <td key={col} className="px-3 py-2 min-w-[340px]">
                          <pre className="rounded bg-[var(--code-bg)] text-[var(--code-text)] p-3 text-[12px] font-mono overflow-x-auto leading-relaxed whitespace-pre">
                            <code>{str}</code>
                          </pre>
                        </td>
                      );
                    }

                    const isStatusCol =
                      col === 'status' || col === 'hasil' || col === 'tingkat_risiko' || col === 'keparahan';
                    const pillClass = isStatusCol ? getStatusPillClass(str) : null;
                    const isMonoOrNumeric =
                      NUMERIC_OR_TIME_COLS.has(col) ||
                      col === 'checksum' ||
                      col === 'berkas' ||
                      col === 'hash_algoritma';

                    return (
                      <td
                        key={col}
                        className={`px-3 py-2 text-[var(--text-main)] ${
                          isMonoOrNumeric ? 'tabular-nums font-mono text-[12px]' : ''
                        } ${col === 'checksum' ? 'max-w-[180px] truncate' : ''}`}
                        title={col === 'checksum' ? str : undefined}
                      >
                        {pillClass ? (
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap ${pillClass}`}
                          >
                            {str || '-'}
                          </span>
                        ) : (
                          <span className="whitespace-pre-wrap break-words">{str === '' ? '-' : str}</span>
                        )}
                      </td>
                    );
                  })}
                  {renderAction && (
                    <td className="px-3 py-2 whitespace-nowrap">{renderAction(row, rowIndex)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
