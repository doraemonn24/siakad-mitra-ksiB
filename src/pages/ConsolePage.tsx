import { DataTablePanel } from '../components/DataTablePanel.tsx';
import type {
  AuditLogRow,
  ConsoleKey,
  ConsolePageData,
  GenericRow,
  LoginAttemptRow,
} from '../types.ts';

interface ConsolePageProps {
  pageKey: ConsoleKey;
  data: ConsolePageData;
  loginAttempts: LoginAttemptRow[];
  auditLogs: AuditLogRow[];
}

export function ConsolePage({
  pageKey,
  data,
  loginAttempts,
  auditLogs,
}: ConsolePageProps) {
  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-[22px] font-bold text-[var(--text-main)] leading-tight">
              {data.title}
            </h1>
            <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">{data.desc}</p>
          </div>
          <span className="inline-flex items-center rounded bg-[var(--accent-soft)] border border-[var(--border-color)] px-2.5 py-1 text-[12px] font-medium text-[var(--accent)] whitespace-nowrap">
            Kendali terkait: {data.ctrl}
          </span>
        </div>
      </header>

      <div className="space-y-4">
        {data.sections.map((section, idx) => {
          let rows: GenericRow[] = section.rows;
          if (pageKey === 'sandi' && idx === 2) {
            rows = loginAttempts as unknown as GenericRow[];
          } else if (pageKey === 'log' && idx === 2) {
            rows = auditLogs as unknown as GenericRow[];
          }

          return (
            <DataTablePanel
              key={`${pageKey}-${idx}`}
              title={section.title}
              cols={section.cols}
              rows={rows}
              note={section.note}
              exportFilenamePrefix={`${pageKey}_${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
