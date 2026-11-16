# Akun Simulasi — SIAKAD Mitra (Objek Audit Simulasi)

Dokumen untuk **kelompok auditor**. Seluruh data pada aplikasi bersifat **sintetis**. Gunakan akun di bawah ini saja untuk pengujian.

| Akun | Kata sandi | Kegunaan |
|---|---|---|
| `auditor` | `Audit#2026` | Membuka **Konsol TIK**: membaca bukti, menyalin/mengunduh data (CSV), menjalankan uji pulih cadangan |
| `uji.audit` | `UjiAudit#1` | Akun untuk pengujian ulang penguncian akun (percobaan login gagal berulang) |
| `demo.dosen` | `Dosen#2026` | Melihat dan mengubah nilai sebagai dosen |
| `demo.baak` | `Baak#2026` | Melihat fungsi SIAKAD sebagai staf BAAK |
| `demo.admin` | `Admin#2026` | Administrator (amati apakah faktor kedua diminta saat login) |

## Ketentuan penggunaan

1. **Pengujian aktif** (percobaan login berulang, uji pulih) hanya boleh pada akun di atas dan **dengan izin tertulis dosen**.
2. Dilarang memindai, menguji penetrasi, atau menyerang aplikasi ini di luar akun simulasi di atas, serta sistem lain mana pun.
3. Data hanya disimpan di peramban masing-masing. Perubahan (nilai, hasil uji pulih, percobaan login) hilang saat halaman dimuat ulang, sehingga setiap kelompok mulai dari data yang sama.
4. Akun lain pada data (pegawai, admin, dan sebagainya) adalah data sintetis untuk diperiksa sebagai **bukti**, bukan untuk dipakai masuk.
5. Samarkan nama pengguna dan alamat IP pada lampiran bukti laporan Anda, sebagai latihan pelindungan data pribadi (UU No. 27 Tahun 2022).

## Alur kerja singkat

1. Masuk sebagai `auditor`, buka **Objek & lingkup audit** dan **Pustaka kebijakan** untuk menyusun rencana audit.
2. Kumpulkan bukti dari **Konsol TIK**, lalu analisis datanya di Excel.
3. Lakukan pengujian ulang (uji pulih, uji login) dan catat hasilnya sebagai kertas kerja.
