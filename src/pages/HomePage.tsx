import { CONSOLE_NAV, PANDUAN_NAV, SIAKAD_NAV } from '../components/Layout.tsx';
import type { RouteId, SessionUser } from '../types.ts';

interface HomePageProps {
  user: SessionUser;
  counts: [string, number][];
  consoleMeta: Record<string, { title: string; ctrl: string }>;
  onNavigate: (route: RouteId) => void;
}

export function HomePage({ user, counts, consoleMeta, onNavigate }: HomePageProps) {
  const canSeeConsole = user.role === 'auditor' || user.role === 'admin';

  return (
    <div className="space-y-5">
      {/* Header greeting */}
      <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] p-5">
        <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
          Selamat datang, {user.username}
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-muted)]">
          SIAKAD Universitas Mitra (simulasi) v3.4.7 — Peran aktif:{' '}
          <span className="font-mono font-medium text-[var(--text-main)]">{user.role}</span>
          {user.peran ? (
            <span className="ml-1.5 text-[13px]">({user.peran})</span>
          ) : null}
        </p>
      </section>

      {/* 4 Summary count cards */}
      <section aria-label="Ringkasan data SIAKAD">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {counts.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-3.5"
            >
              <div className="text-[12.5px] font-medium text-[var(--text-muted)]">{label}</div>
              <div className="mt-1 text-[24px] font-bold tabular-nums text-[var(--text-main)] leading-none">
                {value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shortcuts: SIAKAD & Panduan Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] p-4">
          <h2 className="text-[15.5px] font-semibold text-[var(--text-main)] mb-3">
            Fungsi akademik SIAKAD
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SIAKAD_NAV.filter((i) => i.id !== 'beranda').map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="block rounded-md border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] px-3.5 py-2.5 transition-colors"
              >
                <div className="text-[13.5px] font-semibold text-[var(--accent)]">
                  {item.label}
                </div>
                <div className="mt-0.5 text-[12px] text-[var(--text-muted)]">
                  {item.id === 'mahasiswa'
                    ? 'Daftar 120 mahasiswa dan pencarian NIM/nama'
                    : 'Daftar entri nilai dan pembaruan nilai oleh dosen/admin'}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] p-4">
          <h2 className="text-[15.5px] font-semibold text-[var(--text-main)] mb-3">
            Bahan & panduan audit
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PANDUAN_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="block rounded-md border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] px-3 py-2.5 transition-colors"
              >
                <div className="text-[13px] font-semibold text-[var(--accent)]">
                  {item.label}
                </div>
                <div className="mt-0.5 text-[11.5px] text-[var(--text-muted)]">
                  {item.id === 'panduan'
                    ? 'Lingkup, populasi, 13 kendali & teknik bukti'
                    : item.id === 'dokumen'
                    ? 'Kebijakan TI, SOP & standar internal'
                    : 'Catatan tanya-jawab auditi'}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* 15 Konsol TIK shortcuts for auditor/admin */}
      {canSeeConsole && (
        <section className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] p-4">
          <div className="mb-3">
            <h2 className="text-[15.5px] font-semibold text-[var(--text-main)]">
              Konsol TIK (sumber bukti audit)
            </h2>
            <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">
              15 halaman sumber bukti teknis untuk pemeriksaan kendali K-01 sampai K-13.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {CONSOLE_NAV.map((item) => {
              const meta =
                item.id === 'cadangan'
                  ? { title: 'Cadangan & uji pulih', ctrl: 'K-05' }
                  : consoleMeta[item.id];
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  className="flex items-start justify-between gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] px-3.5 py-2.5 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[var(--accent)] truncate">
                      {item.label}
                    </div>
                    <div className="text-[11.5px] text-[var(--text-muted)] font-mono mt-0.5">
                      #{item.id}
                    </div>
                  </div>
                  {meta?.ctrl ? (
                    <span className="shrink-0 rounded bg-[var(--bg-table-head)] border border-[var(--border-color)] px-1.5 py-0.5 text-[11px] font-mono text-[var(--text-muted)]">
                      {meta.ctrl}
                    </span>
                  ) : null}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
