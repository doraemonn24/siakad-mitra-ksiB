import { useCallback, useEffect, useMemo, useState } from 'react';
import rawData from './data.json';
import { Layout } from './components/Layout.tsx';
import { CadanganPage, type RestoreTestBanner } from './pages/CadanganPage.tsx';
import { ConsolePage } from './pages/ConsolePage.tsx';
import { DokumenPage } from './pages/DokumenPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { MahasiswaPage } from './pages/MahasiswaPage.tsx';
import { NilaiPage } from './pages/NilaiPage.tsx';
import { PanduanPage } from './pages/PanduanPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { WawancaraPage } from './pages/WawancaraPage.tsx';
import type {
  AccountInfo,
  AuditLogRow,
  BackupLogRow,
  BackupTestRow,
  BannerMessage,
  ConsoleKey,
  LoginAttemptRow,
  NilaiRow,
  PublicRouteId,
  RouteId,
  SessionUser,
  SiakadDataset,
} from './types.ts';
import {
  computeGradeLetter,
  nowTimestamp,
  sha256Hex,
  todayDate,
  verifyBackupArchive,
} from './utils/cryptoAndExport.ts';

const DATASET = rawData as unknown as SiakadDataset;

const CONSOLE_KEYS: ConsoleKey[] = [
  'akun',
  'pegawai',
  'tinjauan',
  'istimewa',
  'sandi',
  'tambalan',
  'log',
  'peringatan',
  'firewall',
  'rilis',
  'pelatihan',
  'insiden',
  'fasilitas',
  'kripto',
];

const ALL_PRIVATE_ROUTES = new Set<RouteId>([
  'beranda',
  'mahasiswa',
  'nilai',
  'panduan',
  'dokumen',
  'wawancara',
  'cadangan',
  ...CONSOLE_KEYS,
]);

function isConsoleRoute(route: RouteId): route is ConsoleKey | 'cadangan' {
  return route === 'cadangan' || CONSOLE_KEYS.includes(route as ConsoleKey);
}

function getRawHash(): string {
  return window.location.hash.replace(/^#\/?/, '').trim();
}

function parsePrivateHashRoute(): RouteId {
  const hash = getRawHash() as RouteId;
  if (ALL_PRIVATE_ROUTES.has(hash)) {
    return hash;
  }
  return 'beranda';
}

function resolvePublicHashRoute(): PublicRouteId {
  const hash = getRawHash();
  if (!hash || hash === 'beranda-publik') {
    return 'beranda-publik';
  }
  if (hash === 'login') {
    return 'login';
  }
  if (hash === 'register') {
    return 'register';
  }
  return 'login';
}

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [route, setRoute] = useState<RouteId>(() => parsePrivateHashRoute());
  const [publicRoute, setPublicRoute] = useState<PublicRouteId>(() =>
    resolvePublicHashRoute(),
  );
  const [loginNotice, setLoginNotice] = useState<string | null>(null);
  const [banner, setBanner] = useState<BannerMessage | null>(null);

  // In-memory newly registered accounts (role: "staf", no Konsol TIK access)
  const [registeredAccounts, setRegisteredAccounts] = useState<
    Record<string, AccountInfo>
  >({});

  // In-memory state initialized directly from data.json (reloading restores initial state)
  const [nilaiList, setNilaiList] = useState<NilaiRow[]>(() =>
    DATASET.nilai.map((r) => ({ ...r })),
  );

  const [loginAttempts, setLoginAttempts] = useState<LoginAttemptRow[]>(() =>
    (DATASET.console.sandi.sections[2]?.rows as unknown as LoginAttemptRow[]).map((r) => ({
      ...r,
    })),
  );

  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>(() =>
    (DATASET.console.log.sections[2]?.rows as unknown as AuditLogRow[]).map((r) => ({
      ...r,
    })),
  );

  const [backupTests, setBackupTests] = useState<BackupTestRow[]>(() =>
    DATASET.cadangan.tests.map((r) => ({ ...r })),
  );
  const [auditRestoreCount, setAuditRestoreCount] = useState(0);
  const [lastRestoreBanner, setLastRestoreBanner] = useState<RestoreTestBanner | null>(null);

  // Synchronize hash route on initial mount and hashchange
  useEffect(() => {
    const syncHash = () => {
      if (!user) {
        const raw = getRawHash();
        const nextPublic = resolvePublicHashRoute();
        setPublicRoute(nextPublic);
        if (!raw) {
          window.history.replaceState(null, '', '#beranda-publik');
        } else if (
          raw !== 'beranda-publik' &&
          raw !== 'login' &&
          raw !== 'register'
        ) {
          window.history.replaceState(null, '', '#login');
        }
      } else {
        setRoute(parsePrivateHashRoute());
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [user]);

  const navigatePrivate = useCallback((nextRoute: RouteId) => {
    if (window.location.hash !== `#${nextRoute}`) {
      window.location.hash = `#${nextRoute}`;
    } else {
      setRoute(nextRoute);
    }
  }, []);

  const navigatePublic = useCallback((nextRoute: PublicRouteId) => {
    if (nextRoute !== 'login') {
      setLoginNotice(null);
    }
    if (window.location.hash !== `#${nextRoute}`) {
      window.location.hash = `#${nextRoute}`;
    } else {
      setPublicRoute(nextRoute);
    }
  }, []);

  const consoleMeta = useMemo(() => {
    const meta: Record<string, { title: string; ctrl: string }> = {};
    for (const key of CONSOLE_KEYS) {
      meta[key] = {
        title: DATASET.console[key].title,
        ctrl: DATASET.console[key].ctrl,
      };
    }
    return meta;
  }, []);

  const handleLogin = async (
    username: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    const waktu = nowTimestamp();
    const account = registeredAccounts[username] ?? DATASET.accounts[username];
    const hash = await sha256Hex(password);
    const success = Boolean(account && hash === account.h);

    setLoginAttempts((prev) => [
      {
        waktu,
        username,
        sukses: success ? 1 : 0,
        ip: '(peramban Anda)',
      },
      ...prev,
    ]);

    if (!success) {
      return {
        ok: false,
        error: 'Nama pengguna atau kata sandi salah.',
      };
    }

    setLoginNotice(null);
    setUser({
      username,
      role: account.role,
      peran: account.peran,
      istimewa: account.istimewa,
    });

    setAuditLogs((prev) => [
      {
        waktu,
        pelaku: username,
        aksi: 'LOGIN_SUKSES',
        objek: 'SIAKAD',
        detail: '',
        ip: '-',
      },
      ...prev,
    ]);

    setBanner({
      type: 'success',
      text: `Berhasil masuk sebagai ${username}. Faktor kedua: tidak diminta (kata sandi saja).`,
    });

    window.location.hash = '#beranda';
    setRoute('beranda');

    return { ok: true };
  };

  const handleRegister = async (
    fullName: string,
    username: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string }> => {
    if (DATASET.accounts[username] || registeredAccounts[username]) {
      return {
        ok: false,
        error: 'Nama pengguna sudah terdaftar. Gunakan nama pengguna lain.',
      };
    }

    const hash = await sha256Hex(password);
    setRegisteredAccounts((prev) => ({
      ...prev,
      [username]: {
        h: hash,
        role: 'staf',
        peran: '',
        istimewa: false,
        nama: fullName,
      },
    }));

    setLoginNotice('Akun berhasil dibuat. Silakan masuk dengan nama pengguna dan kata sandi Anda.');
    window.location.hash = '#login';
    setPublicRoute('login');

    return { ok: true };
  };

  const handleLogout = () => {
    setUser(null);
    setBanner(null);
    setLastRestoreBanner(null);
    setLoginNotice(null);
    window.location.hash = '#beranda-publik';
    setPublicRoute('beranda-publik');
  };

  const handleSaveScore = (id: number, newScore: number) => {
    if (!user) return;
    const waktu = nowTimestamp();
    const newLetter = computeGradeLetter(newScore);
    let updatedRow: NilaiRow | undefined;

    setNilaiList((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        updatedRow = {
          ...row,
          angka: newScore,
          huruf: newLetter,
          diubah_oleh: user.username,
          diubah_pada: waktu,
        };
        return updatedRow;
      }),
    );

    if (updatedRow) {
      const target = updatedRow;
      setAuditLogs((prev) => [
        {
          waktu,
          pelaku: user.username,
          aksi: 'UBAH_NILAI',
          objek: 'nilai',
          detail: `id=${target.id} nim=${target.nim} mk=${target.mk} angka=${newScore} (${newLetter})`,
          ip: '-',
        },
        ...prev,
      ]);

      setBanner({
        type: 'success',
        text: 'Nilai diperbarui dan dicatat pada log audit.',
      });
    }
  };

  const handleRunRestoreTest = async (row: BackupLogRow) => {
    if (!user) return;
    const verification = await verifyBackupArchive(
      row.berkas,
      row.status,
      row.checksum,
      DATASET.files,
    );

    const nextSeq = auditRestoreCount + 1;
    setAuditRestoreCount(nextSeq);
    const beritaAcara = `BA-UJI-AUDIT-${String(nextSeq).padStart(3, '0')}`;
    const tanggal = todayDate();
    const waktu = nowTimestamp();
    const fullNote = `Pengujian ulang oleh auditor. ${verification.catatan}`;

    const testEntry: BackupTestRow = {
      tanggal,
      berkas: row.berkas || '-',
      hasil: verification.hasil,
      pelaksana: user.username,
      berita_acara: beritaAcara,
      catatan: fullNote,
    };

    setBackupTests((prev) => [...prev, testEntry]);

    setAuditLogs((prev) => [
      {
        waktu,
        pelaku: user.username,
        aksi: 'UJI_PULIH',
        objek: 'cadangan',
        detail: `berkas=${row.berkas || '-'} hasil=${verification.hasil} ba=${beritaAcara}`,
        ip: '-',
      },
      ...prev,
    ]);

    setLastRestoreBanner({
      tanggal,
      berkas: row.berkas || '-',
      hasil: verification.hasil,
      catatan: verification.catatan,
      berita_acara: beritaAcara,
    });
  };

  if (!user) {
    if (publicRoute === 'login') {
      return (
        <LoginPage
          notice={loginNotice}
          onLogin={handleLogin}
          onNavigatePublic={navigatePublic}
        />
      );
    }
    if (publicRoute === 'register') {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onNavigatePublic={navigatePublic}
        />
      );
    }
    return (
      <LandingPage
        counts={DATASET.counts}
        onNavigatePublic={navigatePublic}
      />
    );
  }

  const canAccessConsole = user.role === 'auditor' || user.role === 'admin';

  const renderPage = () => {
    if (isConsoleRoute(route) && !canAccessConsole) {
      return (
        <section
          role="alert"
          className="rounded-lg border border-[var(--status-red-border)] bg-[var(--status-red-bg)] px-5 py-4 text-[14px] text-[var(--status-red-text)]"
        >
          Akses ditolak: peran Anda tidak memiliki hak untuk membuka halaman ini.
        </section>
      );
    }

    switch (route) {
      case 'beranda':
        return (
          <HomePage
            user={user}
            counts={DATASET.counts}
            consoleMeta={consoleMeta}
            onNavigate={navigatePrivate}
          />
        );
      case 'mahasiswa':
        return <MahasiswaPage students={DATASET.students} />;
      case 'nilai':
        return (
          <NilaiPage user={user} nilai={nilaiList} onSaveScore={handleSaveScore} />
        );
      case 'panduan':
        return <PanduanPage pop={DATASET.pop} ctrl={DATASET.ctrl} />;
      case 'dokumen':
        return <DokumenPage policies={DATASET.policies} />;
      case 'wawancara':
        return <WawancaraPage interviews={DATASET.interviews} />;
      case 'cadangan':
        return (
          <CadanganPage
            cfg={DATASET.cadangan.cfg}
            tests={backupTests}
            rows={DATASET.cadangan.rows}
            lastTestResult={lastRestoreBanner}
            onRunRestoreTest={handleRunRestoreTest}
          />
        );
      default: {
        const consoleKey = route as ConsoleKey;
        const pageData = DATASET.console[consoleKey];
        return (
          <ConsolePage
            pageKey={consoleKey}
            data={pageData}
            loginAttempts={loginAttempts}
            auditLogs={auditLogs}
          />
        );
      }
    }
  };

  return (
    <Layout
      user={user}
      activeRoute={route}
      banner={banner}
      onDismissBanner={() => setBanner(null)}
      onNavigate={navigatePrivate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
