import { useState, type ReactNode } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import type { BannerMessage, RouteId, SessionUser } from '../types.ts';

export interface NavItem {
  id: RouteId;
  label: string;
}

export const SIAKAD_NAV: NavItem[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'mahasiswa', label: 'Mahasiswa' },
  { id: 'nilai', label: 'Nilai' },
];

export const PANDUAN_NAV: NavItem[] = [
  { id: 'panduan', label: 'Objek & lingkup audit' },
  { id: 'dokumen', label: 'Pustaka kebijakan' },
  { id: 'wawancara', label: 'Ruang wawancara' },
];

export const CONSOLE_NAV: NavItem[] = [
  { id: 'akun', label: 'Akun pengguna' },
  { id: 'pegawai', label: 'Status pegawai SIMPEG' },
  { id: 'tinjauan', label: 'Tinjauan akses & otorisasi' },
  { id: 'istimewa', label: 'Akun berhak istimewa' },
  { id: 'sandi', label: 'Autentikasi & percobaan login' },
  { id: 'tambalan', label: 'Aset & tambalan' },
  { id: 'cadangan', label: 'Cadangan & uji pulih' },
  { id: 'log', label: 'Log audit' },
  { id: 'peringatan', label: 'Peringatan pemantauan' },
  { id: 'firewall', label: 'Aturan firewall' },
  { id: 'rilis', label: 'Rilis & tinjauan kode' },
  { id: 'pelatihan', label: 'Pelatihan kesadaran' },
  { id: 'insiden', label: 'Insiden' },
  { id: 'fasilitas', label: 'Fasilitas ruang peladen' },
  { id: 'kripto', label: 'Kriptografi' },
];

interface LayoutProps {
  user: SessionUser;
  activeRoute: RouteId;
  banner: BannerMessage | null;
  onDismissBanner: () => void;
  onNavigate: (route: RouteId) => void;
  onLogout: () => void;
  children: ReactNode;
}

export function Layout({
  user,
  activeRoute,
  banner,
  onDismissBanner,
  onNavigate,
  onLogout,
  children,
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canSeeConsole = user.role === 'auditor' || user.role === 'admin';

  const handleNavClick = (id: RouteId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const renderGroup = (heading: string, items: NavItem[]) => (
    <div className="mb-4 last:mb-0">
      <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#92A7BF]">
        {heading}
      </div>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = activeRoute === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                aria-current={active ? 'page' : undefined}
                className={`block rounded-md px-3 py-1.5 text-[13px] leading-snug transition-colors ${
                  active
                    ? 'bg-[var(--sidebar-active)] text-white font-semibold'
                    : 'text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white'
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)]">
      <div className="mx-auto w-full max-w-[1680px] flex-1 px-3 sm:px-5 py-4 flex flex-col min-[820px]:flex-row gap-4 items-start">
        {/* Mobile top bar */}
        <div className="w-full min-[820px]:hidden flex items-center justify-between gap-2 rounded-[10px] bg-[var(--sidebar-bg)] text-white px-3.5 py-2.5">
          <div className="min-w-0">
            <div className="text-[14px] font-bold leading-tight truncate">SIAKAD Mitra</div>
            <div className="text-[11.5px] text-[#9EB2C9] truncate">
              Universitas Mitra (simulasi) v3.4.7
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu navigasi"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--sidebar-hover)] hover:bg-[var(--sidebar-active)] px-3 py-1.5 text-[12.5px] font-medium text-white shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            Menu
          </button>
        </div>

        {/* Sidebar */}
        <aside
          aria-label="Navigasi utama"
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } min-[820px]:block w-full min-[820px]:w-[250px] shrink-0 min-[820px]:sticky min-[820px]:top-4 rounded-[10px] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] p-3.5 max-h-[calc(100vh-2rem)] overflow-y-auto`}
        >
          <div className="hidden min-[820px]:block px-2 pb-3 mb-3 border-b border-white/10">
            <div className="text-[15.5px] font-bold text-white tracking-tight">SIAKAD Mitra</div>
            <div className="text-[11.5px] text-[#9EB2C9] mt-0.5">
              Universitas Mitra (simulasi) v3.4.7
            </div>
          </div>

          <nav>
            {renderGroup('SIAKAD', SIAKAD_NAV)}
            {renderGroup('Panduan audit', PANDUAN_NAV)}
            {canSeeConsole && renderGroup('Konsol TIK (sumber bukti)', CONSOLE_NAV)}
          </nav>
        </aside>

        {/* Right workspace */}
        <div className="w-full min-w-0 flex-1 max-w-[1400px] flex flex-col gap-3.5">
          {/* Top user strip */}
          <header className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="text-[12.5px] text-[var(--text-muted)]">
              <span className="font-medium text-[var(--text-main)]">SIAKAD Mitra</span>
              <span className="mx-1.5">/</span>
              <span>Universitas Mitra (simulasi) v3.4.7</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[12.5px]">
              <div className="text-[var(--text-main)]">
                Masuk sebagai <strong className="font-semibold">{user.username}</strong>{' '}
                <span className="text-[var(--text-muted)] font-mono text-[12px]">
                  ({user.role})
                </span>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] hover:bg-[var(--bg-table-head)] px-2.5 py-1 text-[12.5px] font-medium text-[var(--text-main)] cursor-pointer transition-colors"
              >
                <LogOut size={13} aria-hidden="true" />
                Keluar
              </button>
            </div>
          </header>

          {/* Dismissible status strip */}
          {banner && (
            <div
              role="status"
              className={`rounded-lg px-4 py-2.5 text-[13px] border flex items-start justify-between gap-3 ${
                banner.type === 'success'
                  ? 'bg-[var(--status-green-bg)] text-[var(--status-green-text)] border-[var(--status-green-border)]'
                  : banner.type === 'warning'
                  ? 'bg-[var(--status-yellow-bg)] text-[var(--status-yellow-text)] border-[var(--status-yellow-border)]'
                  : 'bg-[var(--status-red-bg)] text-[var(--status-red-text)] border-[var(--status-red-border)]'
              }`}
            >
              <span>{banner.text}</span>
              <button
                type="button"
                onClick={onDismissBanner}
                aria-label="Tutup pemberitahuan"
                className="shrink-0 rounded p-0.5 hover:opacity-75 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Main page content */}
          <main className="min-w-0 flex-1 space-y-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
