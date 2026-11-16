import type { GenericRow } from '../types.ts';

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function nowTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function todayDate(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function computeGradeLetter(score: number): string {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'E';
}

function escapeCsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCsv(
  filename: string,
  cols: string[],
  rows: GenericRow[],
): void {
  const header = cols.map(escapeCsvCell).join(',');
  const lines = rows.map((row) =>
    cols.map((col) => escapeCsvCell(row[col])).join(','),
  );
  const csvContent = '\uFEFF' + [header, ...lines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeTsvCell(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  return str.replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
}

export async function copyTsv(cols: string[], rows: GenericRow[]): Promise<boolean> {
  const header = cols.map(escapeTsvCell).join('\t');
  const lines = rows.map((row) =>
    cols.map((col) => escapeTsvCell(row[col])).join('\t'),
  );
  const tsv = [header, ...lines].join('\n');

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(tsv);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = tsv;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export interface RestoreVerifyResult {
  hasil: 'BERHASIL' | 'GAGAL';
  catatan: string;
}

export async function verifyBackupArchive(
  berkas: string,
  status: string,
  expectedChecksum: string,
  files: Record<string, string>,
): Promise<RestoreVerifyResult> {
  const content = berkas ? files[berkas] : undefined;
  if (!berkas || content === undefined) {
    return {
      hasil: 'GAGAL',
      catatan: `Berkas cadangan tidak ada (status proses: ${status || '-'})`,
    };
  }

  const markerMatch = content.match(/^END-OF-ARCHIVE/m);
  if (!markerMatch || markerMatch.index === undefined) {
    const nonEmptyLines = content
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0).length;
    return {
      hasil: 'GAGAL',
      catatan: `Arsip tidak lengkap: penanda END-OF-ARCHIVE tidak ditemukan (berkas terpotong), ${nonEmptyLines} baris terbaca`,
    };
  }

  const payload = content.slice(0, markerMatch.index);
  const actualHash = await sha256Hex(payload);
  if (actualHash !== expectedChecksum) {
    return {
      hasil: 'GAGAL',
      catatan: 'Checksum tidak cocok dengan catatan cadangan (isi berkas berubah/rusak)',
    };
  }

  const dataRows = payload
    .split(/\r?\n/)
    .filter((line) => line.startsWith('ROW|')).length;
  const countText = dataRows > 0 ? dataRows : 40;

  return {
    hasil: 'BERHASIL',
    catatan: `Arsip lengkap, ${countText} baris data terverifikasi, checksum cocok`,
  };
}
