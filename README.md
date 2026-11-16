# SIAKAD Mitra (Simulasi): Objek Audit Tugas BAB VI

Aplikasi web kecil sebagai **objek audit** untuk proyek *Audit Keamanan Sistem Informasi (Simulasi)*, Pertemuan 11 (Rencana Audit) dan Pertemuan 12 (Laporan Audit).

**Web:** https://siakad-mitra.ai.studio

> Seluruh data pada aplikasi bersifat **sintetis**. Beberapa kelemahan keamanan **sengaja ditanam** agar dapat ditemukan saat audit. Jangan dipakai untuk data nyata.

## Tentang aplikasi

SIAKAD mini milik "Universitas Mitra (Simulasi)": data mahasiswa, nilai, dan sebuah **Konsol TIK** berisi 15 halaman sumber bukti: akun, status pegawai, tinjauan akses, akun istimewa, autentikasi, aset & tambalan, cadangan & uji pulih, log audit, peringatan, firewall, rilis, pelatihan, insiden, fasilitas, dan kriptografi.

Panduan untuk auditor tersedia di dalam aplikasi: *Objek & lingkup audit*, *Pustaka kebijakan*, dan *Ruang wawancara*.

## Akun untuk pengujian

Lihat [AKUN_SIMULASI.md](AKUN_SIMULASI.md) untuk daftar akun, kata sandi, dan ketentuan penggunaan.

## Cara memakai untuk tugas

| Tahap | Yang dikerjakan | Luaran |
|---|---|---|
| Pertemuan 11 | Buka *Objek & lingkup* dan *Pustaka kebijakan*; pilih minimal 10 kendali (ISO/IEC 27002:2022); susun program audit dan jadwal | Rencana audit, Identitas Audit, Program Audit |
| Pertemuan 12 | Kumpulkan bukti dari Konsol TIK (CSV, tangkapan layar, uji pulih, uji login) dan wawancara; nilai risiko (Kemungkinan x Dampak) | Kertas Kerja, minimal 10 temuan berperingkat, rekomendasi, rencana tindak lanjut (pemilik dan tenggat) |
| Penutup | Presentasikan laporan | Simulasi rapat penutup 10 menit |

## Aturan etika

1. Pengujian aktif (login gagal berulang, uji pulih) **hanya pada akun simulasi** dan **dengan izin tertulis dosen**.
2. Dilarang memindai atau menyerang aplikasi ini di luar akun simulasi, serta sistem lain mana pun.
3. Perubahan data hanya tersimpan di peramban masing-masing dan hilang saat halaman dimuat ulang.
4. Samarkan nama pengguna dan alamat IP pada lampiran bukti laporan (UU No. 27 Tahun 2022).

## Menjalankan secara lokal (opsional)

Aplikasi ini dibuat dan di-host di Google AI Studio. Untuk menjalankannya di komputer, butuh Node.js 18 atau lebih baru.

```
npm install
npm run dev
```

Aplikasi tidak memerlukan kunci API. Kalau ada berkas `.env.example`, itu hanya contoh bawaan AI Studio dan tidak perlu diisi.

## Struktur repositori

Repositori ini disinkronkan langsung dari Google AI Studio, sehingga berisi berkas proyek bawaannya (misalnya `src/`, `public/`, `package.json`, `server.ts`, `vite.config.ts`, `index.html`). Berkas tambahan dari kelompok:

- `README.md`: dokumen ini
- `AKUN_SIMULASI.md`: akun dan ketentuan pengujian untuk kelompok auditor

## Pembagian tugas

| Nama | NIM | Tugas |
|---|---|---|
| Trivania Buli Karoma | H071241039 | Membuat aplikasi objek audit (SIAKAD Mitra di Google AI Studio), menyiapkan data simulasi dan akun pengujian, serta membuat dan mengelola repositori GitHub |
| Ishmah Nurwasilah | H071241019 | Melaksanakan audit atas aplikasi kelompok lain (EventGate): pengumpulan bukti, penilaian risiko, dan penyusunan laporan audit berisi temuan berperingkat, rekomendasi, dan rencana tindak lanjut |
| Shabrina Zahrah Ramadhani | H071241045 | Menyusun rencana audit dan program audit (Pertemuan 11): penugasan, ruang lingkup, kriteria minimal 10 kendali ISO/IEC 27002, dan jadwal; menyiapkan kertas kerja dan materi simulasi rapat penutup 10 menit |
