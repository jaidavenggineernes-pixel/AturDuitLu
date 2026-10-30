# AturDuitLu 💰
> **Platform Personal Finance Management & Expense Tracking**

AturDuitLu adalah platform manajemen keuangan pribadi modern berbasis web yang dirancang untuk membantu pengguna mencatat, mengelola, memantau, dan menganalisis seluruh aktivitas finansial sehari-hari secara otomatis, akurat, dan terstruktur.

Desain visual dan pengalaman pengguna (UI/UX) dibangun mengacu langsung pada karakteristik visual fintech modern (Monex design reference): palet royal blue cerah (`#1E5BF6`), kartu metrik rounded dengan diffused shadow, indikator focal circular spending & savings, navigasi bottom bar mobile dengan floating action button (`+`), serta responsive layout desktop yang elegan.

---

## 🌟 Fitur Utama

### 1. Sistem Autentikasi Pengguna Aman
- **Registrasi Akun**: Pendaftaran nama, email, dan password ter-hash (`bcryptjs`) dengan inisialisasi otomatis kategori dan setelan saldo awal.
- **Login Sesi Terproteksi**: Sesi berbasis token JWT via HTTP-only cookie (`aturduitlu_token`) dengan isolasi data ketat antar pengguna (`user_id`).
- **Lupa & Reset Password**: Alur reset password lengkap dengan checklist validasi interaktif (panjang min. 8 karakter, simbol/angka) dan layar konfirmasi pembaruan sukses.
- **Logout Aman**: Pembersihan sesi instan.

### 2. Main Dashboard & Financial Overview
- **Karusel Metrik Finansial**:
  - Total Pemasukan
  - Total Pengeluaran (kartu royal blue dengan visual menonjol)
  - Saldo Kas Tersedia (Starting Balance + Income - Expense)
  - Total Tabungan Terkumpul
- **Focal Spending Circular Widget**:
  - Navigator bulan dan strip hari aktif kalender harian.
  - Lingkaran visual belanja utama dengan status penggunaan anggaran (`Aman`, `Perhatian`, `Melebihi Batas`).
  - Tab cepat: *Daftar Pengeluaran* vs *Distribusi Kategori*.
- **Grafik Komparatif & Tren**:
  - Grafik batang perbandingan pemasukan vs pengeluaran.
  - Distribusi pos pengeluaran per kategori.
  - Rekomendasi dan kesimpulan finansial otomatis (*Financial Habit Insights*).

### 3. Manajemen Transaksi (CRUD Lengkap)
- Pencatatan transaksi manual: Nama, Nominal (Rupiah), Jenis (Pengeluaran / Pemasukan), Kategori, Tanggal, Waktu, Metode Pembayaran (Tunai, Transfer Bank, E-Wallet/QRIS, Kartu Kredit), dan Catatan.
- Pencarian real-time berdasarkan nama atau catatan.
- Filter terpadu: Jenis transaksi, Kategori, Metode pembayaran, dan Rentang tanggal.
- Pengurutan: Tanggal terbaru/terlama, Nominal tertinggi/terendah.
- Pagination adaptif dan dialog konfirmasi hapus transaksi.

### 4. Manajemen Periode Keuangan (Timezone Asia/Jakarta)
- **Harian (Daily)**: Total masuk, keluar, selisih kas harian, dan aktivitas hari ini.
- **Mingguan (Weekly)**: Aktivitas 7 hari terakhir dengan perbandingan minggu sebelumnya.
- **Bulanan (Monthly)**: Evaluasi arus kas bulanan dan persentase perubahan dari bulan lalu.
- **Tahunan (Yearly)**: Tren finansial 12 bulan penuh dan akumulasi tabungan tahunan.

### 5. Manajemen Kategori (Category Management)
- Kategori default bawaan sistem untuk Pengeluaran (Makanan & Minuman, Transportasi, Belanja, Hiburan, Pendidikan, Kesehatan, Tagihan & Utilitas, Kebutuhan Pribadi, Langganan, Lainnya) dan Pemasukan (Gaji Pokok, Bisnis/Usaha, Freelance, Uang Saku, Hasil Investasi, Lainnya).
- Tambah & kustomisasi kategori buatan pengguna sendiri dengan pilihan puluhan icon Lucide dan palet warna.
- Menampilkan total akumulasi belanja dan jumlah transaksi pada setiap kategori.

### 6. Manajemen Batas Anggaran (Budget Management)
- Pengaturan anggaran menyeluruh (*Overall Budget*) atau anggaran spesifik per kategori.
- Pilihan periode: Harian, Mingguan, Bulanan.
- Indikator visual dinamis:
  - 🟢 **Aman**: Penggunaan < 80%.
  - 🟡 **Perhatian**: Penggunaan 80% – 99%.
  - 🔴 **Melebihi Batas**: Penggunaan ≥ 100%.
- Notifikasi sistem otomatis terpicu begitu transaksi pengeluaran baru mendekati atau melewati batas anggaran.

### 7. Target Tabungan & Impian (Savings Goals)
- Indikator circular besar *Total Tabungan Terkumpul*.
- Daftar target tabungan (*All Goals*) dengan persentase progres, nominal terkumpul, target akhir, dan sisa hari menuju tenggat waktu (*deadline*).
- Form tambah target impian baru dengan pilihan tipe setoran (Bulanan, Mingguan, Tahunan) dan tema warna.
- Modal **Setor Tabungan**: Menambah alokasi dana secara bertahap dan merekam riwayat kontribusi tanpa menduplikasi data transaksi utama.
- Pemicu milestone 50% dan perayaan 100% via notifikasi otomatis.

### 8. Analisis Finansial Cerdas (Analytics)
- Metrik kesehatan finansial: *Savings Rate (%)*, *Rata-rata Pengeluaran Harian*, *Pos Pengeluaran Terbesar*, dan *Arus Kas Bersih*.
- Evaluasi komparatif bulan berjalan vs bulan lalu.

### 9. Laporan & Ekspor Data (Reports & Export)
- Pilihan periode laporan: Hari Ini, Minggu Ini, Bulan Ini, Tahun Ini, atau Rentang Tanggal Kustom (*Custom Date Range*).
- Rincian tabel kategori dan tabel riwayat transaksi lengkap.
- **Format Ekspor**:
  - **CSV**: Unduhan file RFC-4180 CSV langsung via browser.
  - **Excel (XLS)**: File spreadsheet XML kompatibel dengan Microsoft Excel, LibreOffice, dan Google Sheets lengkap dengan header dan baris total.
  - **Cetak / PDF**: Desain cetak siap dokumen (`window.print()`) yang bersih dari elemen navigasi.

### 10. Pusat Notifikasi (Notification System)
- Notifikasi terintegrasi untuk peringatan anggaran, pencapaian milestone tabungan, dan pengingat pencatatan transaksi harian.
- Tandai dibaca, tandai semua dibaca, dan hapus notifikasi.

### 11. Pengaturan Pengguna (User Settings)
- Konfigurasi **Saldo Awal (*Starting Balance*)**.
- Pemilihan mata uang (IDR, USD, SGD, EUR) dan zona waktu (`Asia/Jakarta`).
- Pengaturan preferensi jenis notifikasi.
- Fitur ubah password.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) 15 (App Router, Server Actions, Route Handlers)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan palet kustom fintech
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) 6 dengan SQLite (default tanpa dependensi eksternal, siap dialihkan ke PostgreSQL)
- **Autentikasi**: JSON Web Token (`jsonwebtoken`) & Hash Keamanan (`bcryptjs`)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Visualisasi Grafik**: Custom Interactive SVG Data Charts
- **Testing**: Node.js Test Runner bawaan (`node --test`)

---

## 📂 Struktur Direktori

```text
aturduitlu/
├── prisma/
│   ├── schema.prisma         # Schema database (User, Transaction, Category, Budget, SavingsGoal, Notification)
│   ├── seed.js               # Script seeding data demo & kategori default
│   └── dev.db                # SQLite database lokal
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── reset-password/page.tsx   # Meniru Monex Screen 5 & 6
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── DashboardClientWrapper.tsx
│   │   │   ├── dashboard/page.tsx         # Dashboard utama (Monex Screen 7 & 8)
│   │   │   ├── transactions/page.tsx      # Manajemen transaksi & filter (Monex Screen 9)
│   │   │   ├── budgets/page.tsx           # Manajemen batas anggaran
│   │   │   ├── savings/page.tsx           # Target tabungan & impian (Monex Screen 10 & 11)
│   │   │   ├── categories/page.tsx        # Kategori pengeluaran & pemasukan
│   │   │   ├── analytics/page.tsx         # Analisis finansial mendalam
│   │   │   ├── reports/page.tsx           # Laporan keuangan & print view
│   │   │   ├── notifications/page.tsx     # Pusat notifikasi
│   │   │   └── settings/page.tsx          # Setelan saldo awal & profil
│   │   ├── api/
│   │   │   ├── auth/                      # Endpoints login, register, logout, reset-password
│   │   │   ├── transactions/              # REST API transaksi (GET, POST, PUT, DELETE)
│   │   │   ├── categories/                # REST API kategori
│   │   │   ├── budgets/                   # REST API anggaran
│   │   │   ├── savings/                   # REST API target & setoran tabungan
│   │   │   ├── analytics/                 # REST API kalkulasi analitik
│   │   │   ├── reports/                   # REST API laporan & ekspor file
│   │   │   ├── notifications/             # REST API notifikasi
│   │   │   └── settings/                  # REST API setelan
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                       # Landing page onboarding (Monex Screen 1 - 4)
│   ├── components/
│   │   ├── ui/                            # Modal, Button, Input, Badge
│   │   ├── layout/                        # Navbar, Sidebar desktop, MobileNav (Floating + button)
│   │   ├── dashboard/                     # MetricsCarousel, ExpenseFocalWidget, RecentTransactionsList, QuickActionsBar
│   │   ├── transactions/                  # TransactionFormModal
│   │   ├── savings/                       # AddGoalModal, AddContributionModal
│   │   ├── budgets/                       # AddBudgetModal
│   │   ├── categories/                    # AddCategoryModal
│   │   └── charts/                        # IncomeExpenseChart, CategoryDonutChart
│   └── lib/
│       ├── auth.ts                        # JWT session & bcrypt
│       ├── db.ts                          # Prisma singleton client
│       ├── calculations.ts                # Rumus saldo, net flow, budget status, savings rate
│       ├── formatters.ts                  # Format Rupiah & tanggal Indonesia
│       └── icons.tsx                      # Dynamic Lucide icon mapper
├── tests/
│   ├── calculations.test.js               # Unit test perhitungan finansial
│   └── auth.test.js                       # Test hashing & verifikasi token
├── .env
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Panduan Menjalankan Project

### 1. Prasyarat Sistem
- **Node.js**: versi 18 atau lebih tinggi (teruji pada Node.js v24)
- **NPM**: versi 9 atau lebih tinggi

### 2. Instalasi Dependensi
Masuk ke direktori project:
```bash
cd aturduitlu
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi default file `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="aturduitlu_super_secret_jwt_key_2026_fintech_secure_production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> **Catatan Beralih ke PostgreSQL (Opsional untuk Production):**
> Jika ingin menggunakan database PostgreSQL, ubah baris datasource di `prisma/schema.prisma`:
> ```prisma
> datasource db {
>   provider = "postgresql"
>   url      = env("DATABASE_URL")
> }
> ```
> Lalu ubah `DATABASE_URL` di `.env` menjadi URL PostgreSQL Anda (contoh: `postgresql://user:password@localhost:5432/aturduitlu`).

### 4. Sinkronisasi Database & Generate Prisma Client
```bash
npx prisma db push
```

### 5. Seeding Data Awal (Demo Account & Kategori)
Jalankan script seed untuk mengisi kategori default dan akun demo pengujian:
```bash
npm run db:seed
```

**Kredensial Akun Demo:**
- **Email**: `demo@aturduitlu.com`
- **Password**: `password123`
*(Atau Anda dapat mendaftar akun baru langsung melalui menu Registrasi).*

### 6. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

### 7. Menjalankan Unit & Integration Test
```bash
npm test
```
Seluruh 9 tes unit perhitungan keuangan, kalkulasi saldo, status anggaran, rasio tabungan, hashing password bcrypt, dan JWT token akan dieksekusi secara otomatis.

### 8. Membangun untuk Production (Build & Start)
```bash
npm run build
npm run start
```

---

## 📱 Kesiapan Pengembangan Mobile (Android & iOS)

Arsitektur AturDuitLu dirancang siap untuk diintegrasikan atau dikonversi menjadi aplikasi mobile:
1. **RESTful API**: Seluruh data dan logika bisnis dapat diakses via endpoint standar JSON di `/api/*`.
2. **Platform-Agnostic Auth**: Autentikasi berbasis JWT dapat menerima token via header `Authorization: Bearer <token>` maupun HTTP cookie.
3. **Mobile-First Responsive Layout**: Menggunakan sistem bottom navigation bar dengan floating action button (`+`) yang identik dengan aplikasi mobile native.
4. **PWA Ready**: Dapat di-wrap menggunakan Capacitor / React Native WebView atau di-publish sebagai Progressive Web App (PWA).

---

## 🔒 Keamanan & Perlindungan Data

- **Password Hashing**: Menggunakan `bcryptjs` dengan salt rounds standar industri.
- **Isolasi Data Pengguna**: Setiap query transaksi, anggaran, target tabungan, dan notifikasi wajib difilter dengan `userId` dari token sesi yang terverifikasi di server.
- **Proteksi Injeksi SQL**: Dikelola secara aman dan terparameterisasi melalui Prisma ORM.
- **Perhitungan Presisi Finansial**: Rumus saldo dan ringkasan kas dieksekusi pada level server dan agregasi database untuk mencegah ketidakakuratan float di browser.
