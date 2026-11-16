import { useState, type FormEvent } from 'react';
import { GraduationCap } from 'lucide-react';
import type { PublicRouteId } from '../types.ts';

interface RegisterPageProps {
  onRegister: (
    fullName: string,
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  onNavigatePublic: (route: PublicRouteId) => void;
}

export function RegisterPage({ onRegister, onNavigatePublic }: RegisterPageProps) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedUser = username.trim();

    if (!trimmedName) {
      setError('Nama lengkap wajib diisi.');
      return;
    }
    if (!trimmedUser) {
      setError('Nama pengguna wajib diisi.');
      return;
    }
    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await onRegister(trimmedName, trimmedUser, password);
      if (!result.ok) {
        setError(result.error || 'Pendaftaran akun gagal.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)]">
      <main className="flex-1 px-4 py-10 flex flex-col items-center justify-center">
        <section className="w-full max-w-[440px] rounded-[10px] border border-[var(--border-color)] bg-[var(--bg-panel)] p-6">
          <div className="border-b border-[var(--border-color)] pb-4 mb-5 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-bg)] text-white shrink-0">
              <GraduationCap size={19} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-[20px] font-bold text-[var(--text-main)] leading-tight">
                Buat Akun SIAKAD Mitra
              </h1>
              <p className="text-[12.5px] text-[var(--text-muted)]">
                Universitas Mitra — Pendaftaran akun baru
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded border border-[var(--status-red-border)] bg-[var(--status-red-bg)] px-3.5 py-2.5 text-[13px] text-[var(--status-red-text)]"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="reg-fullname"
                className="block text-[13px] font-medium text-[var(--text-main)] mb-1"
              >
                Nama lengkap
              </label>
              <input
                id="reg-fullname"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama lengkap Anda"
                className="w-full rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] px-3 py-2 text-[13.5px] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-username"
                className="block text-[13px] font-medium text-[var(--text-main)] mb-1"
              >
                Nama pengguna
              </label>
              <input
                id="reg-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="mis. budi.santoso"
                className="w-full rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] px-3 py-2 text-[13.5px] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-[13px] font-medium text-[var(--text-main)] mb-1"
              >
                Kata sandi
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] px-3 py-2 text-[13.5px] text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2 text-[13.5px] font-semibold text-white cursor-pointer transition-colors disabled:opacity-60"
            >
              {submitting ? 'Membuat akun...' : 'Buat Akun'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex flex-col gap-2 text-center text-[13px] text-[var(--text-muted)]">
            <div>
              Sudah punya akun?{' '}
              <a
                href="#login"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePublic('login');
                }}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Login
              </a>
            </div>
            <div>
              <a
                href="#beranda-publik"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePublic('beranda-publik');
                }}
                className="text-[12.5px] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:underline"
              >
                Kembali ke Beranda
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
