import { useMemo } from 'react';
import type { InterviewRow } from '../types.ts';

interface WawancaraPageProps {
  interviews: InterviewRow[];
}

interface GroupedAuditi {
  auditi: string;
  jabatan: string;
  items: InterviewRow[];
}

export function WawancaraPage({ interviews }: WawancaraPageProps) {
  const grouped = useMemo<GroupedAuditi[]>(() => {
    const map = new Map<string, GroupedAuditi>();
    for (const row of interviews) {
      const existing = map.get(row.auditi);
      if (existing) {
        existing.items.push(row);
      } else {
        map.set(row.auditi, {
          auditi: row.auditi,
          jabatan: row.jabatan,
          items: [row],
        });
      }
    }
    return Array.from(map.values());
  }, [interviews]);

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
          Ruang Wawancara
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
          Ringkasan catatan wawancara auditi terkait pengelolaan SIAKAD dan infrastruktur pendukung.
        </p>
      </header>

      <div
        role="note"
        className="rounded-lg border border-[var(--status-yellow-border)] bg-[var(--status-yellow-bg)] px-4 py-3 text-[13px] text-[var(--status-yellow-text)]"
      >
        <strong>Catatan keandalan bukti:</strong> Wawancara berkeandalan{' '}
        <span className="font-semibold tabular-nums">1</span> dan harus dikuatkan dengan bukti lain
        yang lebih andal (misalnya inspeksi teknis/CAAT, telaah dokumen, observasi, atau pengujian ulang).
      </div>

      <div className="grid grid-cols-1 gap-4">
        {grouped.map((group) => (
          <section
            key={group.auditi}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-subtle)]">
              <h2 className="text-[15.5px] font-semibold text-[var(--text-main)]">
                {group.auditi}
              </h2>
              <p className="text-[12.5px] text-[var(--text-muted)]">{group.jabatan}</p>
            </div>

            <div className="divide-y divide-[var(--border-color)]">
              {group.items.map((item, idx) => (
                <div key={idx} className="px-4 py-3.5 space-y-2">
                  <div>
                    <span className="inline-block rounded bg-[var(--bg-table-head)] border border-[var(--border-color)] px-2 py-0.5 text-[11.5px] font-medium text-[var(--text-muted)]">
                      Topik: {item.topik}
                    </span>
                  </div>
                  <div className="text-[13.5px]">
                    <span className="font-semibold text-[var(--text-main)]">Pertanyaan: </span>
                    <span className="text-[var(--text-main)]">{item.pertanyaan}</span>
                  </div>
                  <div className="text-[13.5px]">
                    <span className="font-semibold text-[var(--accent)]">Jawaban: </span>
                    <span className="text-[var(--text-main)]">{item.jawaban}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
