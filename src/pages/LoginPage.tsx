import { useState, type FormEvent } from 'react';
import { GraduationCap } from 'lucide-react';
import type { PublicRouteId } from '../types.ts';

interface LoginPageProps {
  notice?: string | null;
  onLogin: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  onNavigatePublic: (route: PublicRouteId) => void;
}

export function LoginPage({ notice, onLogin, onNavigatePublic }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await onLogin(username.trim(), password);
      if (!result.ok) {
        setError(result.error || 'Nama pengguna atau kata sandi salah.');
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
                SIAKAD Mitra
              </h1>
              <p className="text-[12.5px] text-[var(--text-muted)]">
                Universitas Mitra (simulasi) v3.4.7
              </p>
            </div>
          </div>

          {notice && !error && (
            <div
              role="status"
              className="mb-4 rounded border border-[var(--status-green-border)] bg-[var(--status-green-bg)] px-3.5 py-2.5 text-[13px] text-[var(--status-green-text)]"
            >
              {notice}
            </div>
          )}

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
                htmlFor="login-username"
                className="block text-[13px] font-medium text-[var(--text-main)] mb-1"
              >
                Nama pengguna
              </label>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] px-3 py-2 text-[13.5px] text-[var(--text-main)]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[13px] font-medium text-[var(--text-main)] mb-1"
              >
                Kata sandi
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-[var(--border-strong)] bg-[var(--bg-panel)] px-3 py-2 text-[13.5px] text-[var(--text-main)]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2 text-[13.5px] font-semibold text-white cursor-pointer transition-colors disabled:opacity-60"
            >
              {submitting ? 'Memeriksa...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[var(--border-color)] flex flex-col gap-2 text-center text-[13px] text-[var(--text-muted)]">
            <div>
              Belum punya akun?{' '}
              <a
                href="#register"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigatePublic('register');
                }}
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Register
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
