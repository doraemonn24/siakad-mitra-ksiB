# Akun Simulasi: SIAKAD Mitra (Objek Audit Simulasi)

Dokumen untuk **kelompok auditor**. Seluruh data pada aplikasi bersifat **sintetis**. Gunakan akun di bawah ini saja untuk pengujian.

## Daftar akun

| Akun | Kata sandi | Peran | Kegunaan |
|---|---|---|---|
| `auditor` | `Audit#2026` | Akun kerja auditor | Satu-satunya akun yang rutin dipakai. Membuka **Konsol TIK** (15 halaman bukti), menyalin atau mengunduh data (CSV), dan menjalankan uji pulih cadangan |
| `uji.audit` | `UjiAudit#1` | Akun khusus percobaan | Untuk uji login gagal berulang. Sengaja salah memasukkan kata sandi beberapa kali, lalu amati respons sistem. Jangan pakai akun lain untuk ini |
| `demo.dosen` | `Dosen#2026` | Contoh pengguna dosen | Melihat dan mengubah nilai. Amati fungsi Nilai dan jejak perubahannya pada log audit |
| `demo.baak` | `Baak#2026` | Contoh pengguna staf BAAK | Melihat fungsi SIAKAD yang tersedia bagi staf BAAK, lalu bandingkan hak aksesnya dengan akun lain |
| `demo.admin` | `Admin#2026` | Contoh administrator | Amati proses login seorang admin, misalnya apakah ada verifikasi tambahan. Akun ini juga dapat membuka Konsol TIK |

**Yang perlu diingat:** hanya `auditor` yang dipakai untuk mengumpulkan bukti. Akun lainnya dipakai untuk **menguji dan mengamati** perilaku sistem; hasil pengamatannya menjadi bukti observasi dan bahan temuan.

## Ketentuan penggunaan

1. **Pengujian aktif** (percobaan login berulang, uji pulih) hanya boleh pada akun di atas dan **dengan izin tertulis dosen**.
2. Dilarang memindai, menguji penetrasi, atau menyerang aplikasi ini di luar akun simulasi di atas, serta sistem lain mana pun.
3. Data hanya disimpan di peramban masing-masing. Perubahan (nilai, hasil uji pulih, percobaan login) hilang saat halaman dimuat ulang, sehingga setiap kelompok mulai dari data yang sama.
4. Akun lain pada data (pegawai, admin, dan sebagainya) adalah data sintetis untuk diperiksa sebagai **bukti**, bukan untuk dipakai masuk.
5. Samarkan nama pengguna dan alamat IP pada lampiran bukti laporan Anda, sebagai latihan pelindungan data pribadi (UU No. 27 Tahun 2022).

## Alur kerja singkat

1. Masuk sebagai `auditor`, buka **Objek & lingkup audit** dan **Pustaka kebijakan** untuk menyusun rencana audit.
2. Kumpulkan bukti dari **Konsol TIK**, lalu analisis datanya di Excel.
3. Lakukan pengujian ulang: uji pulih dengan `auditor`, uji login dengan `uji.audit`.
4. Masuk sebagai `demo.dosen`, `demo.baak`, dan `demo.admin` untuk mengamati perilaku dan hak aksesnya.
5. Catat semua hasil sebagai kertas kerja, lalu tulis temuan dan laporan.
