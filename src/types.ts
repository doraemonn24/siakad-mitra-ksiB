export type ConsoleKey =
  | 'akun'
  | 'pegawai'
  | 'tinjauan'
  | 'istimewa'
  | 'sandi'
  | 'tambalan'
  | 'log'
  | 'peringatan'
  | 'firewall'
  | 'rilis'
  | 'pelatihan'
  | 'insiden'
  | 'fasilitas'
  | 'kripto';

export type PublicRouteId = 'beranda-publik' | 'login' | 'register';

export type RouteId =
  | 'beranda'
  | 'mahasiswa'
  | 'nilai'
  | 'panduan'
  | 'dokumen'
  | 'wawancara'
  | ConsoleKey
  | 'cadangan';

export interface AccountInfo {
  h: string;
  role: string;
  peran: string;
  istimewa: boolean;
  nama?: string;
}

export interface SessionUser {
  username: string;
  role: string;
  peran: string;
  istimewa: boolean;
}

export interface StudentRow {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  email: string;
}

export interface NilaiRow {
  id: number;
  nim: string;
  nama: string;
  mk: string;
  angka: number;
  huruf: string;
  diubah_oleh: string;
  diubah_pada: string;
}

export interface PolicyRow {
  dokumen: string;
  versi: string;
  pasal: string;
  isi: string;
}

export interface InterviewRow {
  auditi: string;
  jabatan: string;
  topik: string;
  pertanyaan: string;
  jawaban: string;
}

export type GenericRow = Record<string, string | number | boolean | null | undefined>;

export interface ConsoleSection {
  title: string;
  cols: string[];
  rows: GenericRow[];
  note: string;
}

export interface ConsolePageData {
  title: string;
  desc: string;
  ctrl: string;
  sections: ConsoleSection[];
}

export interface BackupConfigRow {
  kunci: string;
  nilai: string;
  catatan: string;
}

export interface BackupLogRow {
  tanggal: string;
  mulai: string;
  selesai: string;
  ukuran_mb: number;
  status: string;
  lokasi: string;
  berkas: string;
  checksum: string;
}

export interface BackupTestRow {
  tanggal: string;
  berkas: string;
  hasil: string;
  pelaksana: string;
  berita_acara: string;
  catatan: string;
}

export interface LoginAttemptRow {
  waktu: string;
  username: string;
  sukses: number;
  ip: string;
}

export interface AuditLogRow {
  waktu: string;
  pelaku: string;
  aksi: string;
  objek: string;
  detail: string;
  ip: string;
}

export interface SiakadDataset {
  counts: [string, number][];
  students: StudentRow[];
  nilai: NilaiRow[];
  policies: PolicyRow[];
  interviews: InterviewRow[];
  pop: [string, number, string][];
  ctrl: [string, string, string, string][];
  console: Record<ConsoleKey, ConsolePageData>;
  cadangan: {
    cfg: BackupConfigRow[];
    rows: BackupLogRow[];
    tests: BackupTestRow[];
  };
  files: Record<string, string>;
  accounts: Record<string, AccountInfo>;
}

export interface BannerMessage {
  type: 'success' | 'warning' | 'error';
  text: string;
}
