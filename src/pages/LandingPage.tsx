import {
  ClipboardList,
  FileText,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { PublicRouteId } from '../types.ts';

interface LandingPageProps {
  counts: [string, number][];
  onNavigatePublic: (route: PublicRouteId) => void;
}

const SERVICES = [
  {
    title: 'Data Mahasiswa',
    desc: 'Direktori terpusat biodata mahasiswa, nomor induk, program studi, angkatan, dan surel akademik.',
    icon: Users,
  },
  {
    title: 'Nilai Akademik',
    desc: 'Pencatatan nilai angka dan huruf mata kuliah secara terstruktur lengkap dengan riwayat pembaruan.',
    icon: ClipboardList,
  },
  {
    title: 'Pengelolaan Akun',
    desc: 'Pengaturan otorisasi peran pengguna internal bagi staf akademik, dosen, dan pengelola sistem.',
    icon: ShieldCheck,
  },
  {
    title: 'Pelaporan',
    desc: 'Ekspor data tabel akademik dan catatan operasional dalam format CSV maupun tabulasi untuk rekap.',
    icon: FileText,
  },
];

export function LandingPage({ counts, onNavigatePublic }: LandingPageProps) {
  const heroMetrics = counts.slice(0, 3);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)]">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-color)] bg-[var(--bg-panel)]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: small logo + SIAKAD Mitra + Universitas Mitra + nav links */}
          <div className="flex items-center gap-8 min-w-0">
            <a
              href="#beranda-publik"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 shrink-0"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-bg)] text-white shrink-0">
                <GraduationCap size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block text-[15.5px] font-bold text-[var(--text-main)] whitespace-nowrap">
                  SIAKAD Mitra
                </span>
                <span className="block text-[11.5px] text-[var(--text-muted)] whitespace-nowrap">
                  Universitas Mitra
                </span>
              </span>
            </a>

            <nav
              aria-label="Navigasi landing page"
              className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-[var(--text-muted)]"
            >
              <a
                href="#beranda-publik"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[var(--text-main)] transition-colors whitespace-nowrap shrink-0"
              >
                Beranda
              </a>
              <button
                type="button"
                onClick={() => scrollToSection('layanan')}
                className="hover:text-[var(--text-main)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Layanan
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('tentang')}
                className="hover:text-[var(--text-main)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Tentang
              </button>
            </nav>
          </div>

          {/* Right: Login (outline) & Register (accent filled) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigatePublic('login')}
              className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel)] hover:bg-[var(--bg-table-head)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--text-main)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => onNavigatePublic('register')}
              className="rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-3.5 py-1.5 text-[13px] font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="border-b border-[var(--border-color)] bg-[var(--bg-panel)]">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.25fr_0.9fr] gap-10 lg:gap-12 items-center">
            <div className="space-y-5">
              <h1
                className="text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight text-[var(--text-main)] leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Portal Akademik Universitas Mitra
              </h1>

              <p className="max-w-[58ch] text-[15.5px] leading-relaxed text-[var(--text-muted)]">
                Sistem informasi akademik terpadu untuk pengelolaan data mahasiswa,
                pencatatan nilai mata kuliah, serta administrasi akun pengguna di
                lingkungan Universitas Mitra.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigatePublic('login')}
                  className="rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-5 py-2.5 text-[14px] font-semibold text-white whitespace-nowrap cursor-pointer transition-colors"
                >
                  Masuk ke Portal
                </button>
                <button
                  type="button"
                  onClick={() => onNavigatePublic('register')}
                  className="rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel)] hover:bg-[var(--bg-table-head)] px-5 py-2.5 text-[14px] font-medium text-[var(--text-main)] whitespace-nowrap cursor-pointer transition-colors"
                >
                  Buat Akun
                </button>
              </div>
            </div>

            {/* Right summary panel with 3 monospace metrics */}
            <aside
              aria-label="Ringkasan data akademik"
              className="rounded-[10px] border border-[var(--border-color)] bg-[var(--sidebar-bg)] text-white p-6"
            >
              <div className="pb-4 mb-4 border-b border-white/15">
                <div className="text-[14px] font-semibold text-white">
                  Ringkasan Data Akademik
                </div>
                <div className="text-[12.5px] text-[#B8C7D9] mt-0.5">
                  Populasi tercatat dalam sistem SIAKAD Mitra v3.4.7
                </div>
              </div>

              <dl className="divide-y divide-white/10">
                {heroMetrics.map(([label, value]) => (
                  <div
                    key={label}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-[13.5px] text-[#D3DDE9]">{label}</dt>
                    <dd className="font-mono text-[26px] font-semibold tabular-nums text-white leading-none">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        {/* Layanan section */}
        <section id="layanan" className="py-14 sm:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="max-w-[600px] mb-8">
              <h2 className="text-[22px] font-bold text-[var(--text-main)] leading-snug">
                Layanan Portal Akademik
              </h2>
              <p className="mt-1.5 text-[14.5px] text-[var(--text-muted)]">
                Modul utama yang tersedia bagi sivitas akademika dan pengelola administrasi kampus.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <article
                    key={service.title}
                    className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-panel)] p-5 flex flex-col gap-3"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border-color)]">
                      <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <h3 className="text-[15.5px] font-semibold text-[var(--text-main)] leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-[13.5px] text-[var(--text-muted)] leading-relaxed">
                      {service.desc}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tentang section */}
        <section
          id="tentang"
          className="border-t border-[var(--border-color)] bg-[var(--bg-panel)] py-12 sm:py-14"
        >
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="max-w-[780px]">
              <h2 className="text-[20px] font-bold text-[var(--text-main)] mb-3">
                Tentang SIAKAD Mitra
              </h2>
              <p className="text-[14.5px] text-[var(--text-muted)] leading-relaxed">
                Aplikasi ini merupakan lingkungan simulasi untuk tugas mata kuliah Audit Keamanan
                Sistem Informasi. Seluruh data mahasiswa, nilai, akun, dan catatan operasional di
                dalam sistem bersifat sintetis untuk keperluan pembelajaran, dan pengujian aktif
                hanya dilakukan pada lingkungan simulasi ini dengan izin dosen pengampu.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-app)] py-6">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[var(--text-muted)]">
          <div>
            <strong className="font-semibold text-[var(--text-main)]">SIAKAD Mitra</strong> —
            Universitas Mitra (simulasi) v3.4.7
          </div>
          <div>
            Lingkungan simulasi tugas Audit Keamanan Sistem Informasi · Seluruh data sintetis · Pengujian aktif hanya dengan izin dosen.
          </div>
        </div>
      </footer>
    </div>
  );
}
