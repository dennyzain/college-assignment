# MSIM4206 – Tugas 2
## Implementasi Basis Data Berdasarkan ERD Menggunakan Docker + MariaDB

Tugas ini bertujuan mengubah ERD yang diberikan menjadi implementasi basis data MySQL/MariaDB.  
Pada instruksi asli, penggunaan XAMPP direkomendasikan, namun pada dokumentasi ini saya menggunakan **Docker** karena lebih fleksibel, modern, dan memiliki fungsi yang sama untuk menjalankan server database.

---

## 📌 1. Persiapan Lingkungan (Setup)

### Menjalankan MariaDB Menggunakan Docker

Buat file bernama **docker-compose.yml**:

```yaml
version: '3.8'

services:
  mariadb:
    image: mariadb:10.6
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: root
      MARIADB_DATABASE: tugas_msim4206
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Jalankan perintah berikut:

```bash
docker compose up -d
```

MariaDB kini berjalan di:
- **Host:** localhost
- **Port:** 3306
- **User:** root
- **Password:** root
- **Default Database:** tugas_msim4206

Anda dapat menggunakan aplikasi seperti DBeaver, TablePlus, atau phpMyAdmin (Docker) untuk mengelola database.

---

## 📌 2. Memahami Relasi Database (Database Relations) - Panduan Lengkap untuk Pemula

### 🎯 Apa itu Relasi Database?

**Relasi database** adalah cara menghubungkan data antar tabel dalam database. Bayangkan seperti menghubungkan informasi di beberapa lembar kertas yang berbeda, tapi dengan cara yang terorganisir dan efisien.

**Mengapa perlu relasi?**
- Menghindari duplikasi data (misalnya, tidak perlu menulis nama dokter berulang-ulang)
- Memudahkan update data (ubah sekali, semua tempat terupdate)
- Menjaga konsistensi data
- Menghemat ruang penyimpanan

### 🔑 Konsep Dasar: Primary Key dan Foreign Key

Sebelum memahami relasi, kita perlu tahu tentang **key** (kunci):

#### **Primary Key (PK)**
- **Apa itu?** Kolom unik yang mengidentifikasi setiap baris dalam tabel
- **Contoh:** `id_pasien` di tabel `pasien`
- **Karakteristik:**
  - Harus unik (tidak boleh ada duplikat)
  - Tidak boleh NULL (kosong)
  - Setiap tabel biasanya punya satu Primary Key

```sql
-- Contoh Primary Key
CREATE TABLE pasien (
  id_pasien INT AUTO_INCREMENT PRIMARY KEY,  -- ← Ini Primary Key
  nama VARCHAR(100),
  alamat VARCHAR(150)
);
```

#### **Foreign Key (FK)**
- **Apa itu?** Kolom yang merujuk ke Primary Key tabel lain
- **Fungsi:** Menghubungkan data antar tabel
- **Contoh:** `id_pasien` di tabel `daftar` adalah Foreign Key yang merujuk ke `id_pasien` di tabel `pasien`

```sql
-- Contoh Foreign Key
CREATE TABLE daftar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pasien INT,  -- ← Ini Foreign Key
  tanggal DATE,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)  -- ← Menghubungkan ke tabel pasien
);
```

**Cara mudah mengingat:**
- **Primary Key** = "Identitas diri" (seperti NIK)
- **Foreign Key** = "Referensi ke identitas lain" (seperti nomor pasien di kartu berobat)

---

### 📊 Tiga Jenis Relasi Database

Ada **3 jenis relasi** utama dalam database:

#### **1. One-to-One (1:1) - Satu ke Satu**

**Penjelasan:** Satu record di tabel A hanya berhubungan dengan satu record di tabel B, dan sebaliknya.

**Contoh kehidupan nyata:**
- Satu orang punya satu KTP
- Satu mobil punya satu nomor polisi

**Contoh dalam database rumah sakit:**
- Satu pasien punya satu rekam medis (jika dibuat terpisah)

**Cara implementasi:**
- Foreign Key di salah satu tabel yang merujuk ke Primary Key tabel lain
- Foreign Key harus UNIQUE (agar hanya satu hubungan)

```sql
-- Contoh One-to-One (tidak ada di tugas ini, tapi untuk referensi)
CREATE TABLE pasien (
  id_pasien INT PRIMARY KEY,
  nama VARCHAR(100)
);

CREATE TABLE rekam_medis (
  id_rekam INT PRIMARY KEY,
  id_pasien INT UNIQUE,  -- UNIQUE membuat relasi 1:1
  riwayat TEXT,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)
);
```

---

#### **2. One-to-Many (1:N) - Satu ke Banyak** ⭐ **PALING UMUM**

**Penjelasan:** Satu record di tabel A bisa berhubungan dengan banyak record di tabel B, tapi satu record di tabel B hanya berhubungan dengan satu record di tabel A.

**Contoh kehidupan nyata:**
- Satu guru mengajar banyak siswa
- Satu customer punya banyak pesanan
- Satu ibu punya banyak anak

**Contoh dalam database rumah sakit (dari tugas ini):**
- **Satu pasien bisa punya banyak riwayat daftar** (Pasien → Daftar)

**Cara implementasi:**
- Foreign Key di tabel "banyak" (tabel B) yang merujuk ke Primary Key tabel "satu" (tabel A)
- **TIDAK perlu UNIQUE** pada Foreign Key

```sql
-- Contoh One-to-Many dari tugas ini
CREATE TABLE pasien (
  id_pasien INT PRIMARY KEY,
  nama VARCHAR(100)
);

CREATE TABLE daftar (
  id INT PRIMARY KEY,
  id_pasien INT,  -- ← Foreign Key (TIDAK UNIQUE, bisa banyak)
  tanggal DATE,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)
);
```

**Ilustrasi data:**
```
Tabel pasien:
id_pasien | nama
----------|----------
1         | Budi
2         | Siti

Tabel daftar:
id | id_pasien | tanggal
---|-----------|----------
1  | 1         | 2024-01-01  ← Budi daftar pertama kali
2  | 1         | 2024-02-15  ← Budi daftar kedua kali
3  | 2         | 2024-01-10  ← Siti daftar
4  | 1         | 2024-03-20  ← Budi daftar ketiga kali
```

**Lihat:** Pasien dengan `id_pasien = 1` (Budi) punya **3 riwayat daftar**. Ini adalah relasi One-to-Many!

---

#### **3. Many-to-Many (N:M) - Banyak ke Banyak**

**Penjelasan:** Satu record di tabel A bisa berhubungan dengan banyak record di tabel B, dan sebaliknya.

**Contoh kehidupan nyata:**
- Banyak siswa belajar banyak mata pelajaran
- Banyak aktor bermain di banyak film
- Banyak penulis menulis banyak buku

**Contoh dalam database rumah sakit (dari tugas ini):**
- **Banyak pasien bisa ditangani banyak dokter** (Pasien ↔ Dokter)
- **Banyak dokter bisa dikelola banyak administrator** (Dokter ↔ Administrator)

**Cara implementasi:**
- **MEMBUAT TABEL BARU** (junction/bridge table) yang menghubungkan kedua tabel
- Tabel baru ini punya **2 Foreign Key**: satu ke tabel A, satu ke tabel B
- Kombinasi kedua Foreign Key biasanya dibuat UNIQUE

```sql
-- Contoh Many-to-Many dari tugas ini
CREATE TABLE pasien (
  id_pasien INT PRIMARY KEY,
  nama VARCHAR(100)
);

CREATE TABLE dokter (
  id_dokter INT PRIMARY KEY,
  nama VARCHAR(100)
);

-- TABEL PENGHUBUNG (Junction Table)
CREATE TABLE pasien_dokter (
  id INT PRIMARY KEY,
  id_pasien INT,  -- ← Foreign Key ke pasien
  id_dokter INT,  -- ← Foreign Key ke dokter
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien),
  FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter)
);
```

**Ilustrasi data:**
```
Tabel pasien:
id_pasien | nama
----------|----------
1         | Budi
2         | Siti

Tabel dokter:
id_dokter | nama
----------|----------
1         | Dr. Ahmad
2         | Dr. Sarah

Tabel pasien_dokter (penghubung):
id | id_pasien | id_dokter
---|-----------|----------
1  | 1         | 1         ← Budi ditangani Dr. Ahmad
2  | 1         | 2         ← Budi juga ditangani Dr. Sarah
3  | 2         | 1         ← Siti ditangani Dr. Ahmad
4  | 2         | 2         ← Siti juga ditangani Dr. Sarah
```

**Lihat:**
- Budi (pasien 1) ditangani oleh **2 dokter** (Dr. Ahmad dan Dr. Sarah)
- Dr. Ahmad (dokter 1) menangani **2 pasien** (Budi dan Siti)
- Ini adalah relasi Many-to-Many!

**Mengapa perlu tabel penghubung?**
- Kalau kita taruh Foreign Key di tabel `pasien`, satu pasien hanya bisa punya satu dokter ❌
- Kalau kita taruh Foreign Key di tabel `dokter`, satu dokter hanya bisa punya satu pasien ❌
- Dengan tabel penghubung, kita bisa membuat banyak kombinasi ✅

---

### 🔍 Analisis Relasi dalam Database Tugas Ini

Mari kita analisis setiap relasi dalam database rumah sakit ini:

#### **Relasi 1: Pasien → Daftar (One-to-Many)**

```sql
CREATE TABLE pasien (
  id_pasien INT PRIMARY KEY,  -- Primary Key
  nama VARCHAR(100)
);

CREATE TABLE daftar (
  id INT PRIMARY KEY,
  id_pasien INT,  -- Foreign Key (bisa banyak, tidak UNIQUE)
  tanggal DATE,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)
);
```

**Penjelasan:**
- Satu pasien bisa daftar berkali-kali (satu pasien → banyak daftar)
- Setiap daftar hanya milik satu pasien (satu daftar → satu pasien)
- **Jenis:** One-to-Many
- **Ciri:** Foreign Key di tabel "banyak" (daftar), tidak UNIQUE

---

#### **Relasi 2: Pasien ↔ Dokter (Many-to-Many)**

```sql
CREATE TABLE pasien (
  id_pasien INT PRIMARY KEY,
  nama VARCHAR(100)
);

CREATE TABLE dokter (
  id_dokter INT PRIMARY KEY,
  nama VARCHAR(100)
);

-- Tabel penghubung
CREATE TABLE pasien_dokter (
  id INT PRIMARY KEY,
  id_pasien INT,  -- Foreign Key ke pasien
  id_dokter INT,  -- Foreign Key ke dokter
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien),
  FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter)
);
```

**Penjelasan:**
- Satu pasien bisa ditangani banyak dokter
- Satu dokter bisa menangani banyak pasien
- **Jenis:** Many-to-Many
- **Ciri:** Ada tabel penghubung dengan 2 Foreign Key

---

#### **Relasi 3: Dokter ↔ Administrator (Many-to-Many)**

```sql
CREATE TABLE dokter (
  id_dokter INT PRIMARY KEY,
  nama VARCHAR(100)
);

CREATE TABLE administrator (
  id_admin INT PRIMARY KEY,
  nama VARCHAR(100)
);

-- Tabel penghubung
CREATE TABLE dokter_admin (
  id INT PRIMARY KEY,
  id_dokter INT,  -- Foreign Key ke dokter
  id_admin INT,   -- Foreign Key ke administrator
  FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter),
  FOREIGN KEY (id_admin) REFERENCES administrator(id_admin)
);
```

**Penjelasan:**
- Satu dokter bisa dikelola banyak administrator
- Satu administrator bisa mengelola banyak dokter
- **Jenis:** Many-to-Many
- **Ciri:** Ada tabel penghubung dengan 2 Foreign Key

---

### 📝 Tips Mengidentifikasi Jenis Relasi

**Pertanyaan untuk ditanyakan pada diri sendiri:**

1. **One-to-One?**
   - Apakah satu record di A hanya bisa punya satu record di B?
   - Apakah satu record di B hanya bisa punya satu record di A?
   - **Jika YA keduanya** → One-to-One

2. **One-to-Many?**
   - Apakah satu record di A bisa punya banyak record di B?
   - Apakah satu record di B hanya bisa punya satu record di A?
   - **Jika YA keduanya** → One-to-Many

3. **Many-to-Many?**
   - Apakah satu record di A bisa punya banyak record di B?
   - Apakah satu record di B bisa punya banyak record di A?
   - **Jika YA keduanya** → Many-to-Many (perlu tabel penghubung)

---

### 🎓 Kesimpulan

| Jenis Relasi | Kapan Digunakan | Cara Implementasi |
|--------------|-----------------|-------------------|
| **One-to-One** | Hubungan eksklusif (1:1) | Foreign Key dengan UNIQUE constraint |
| **One-to-Many** | Satu punya banyak (1:N) | Foreign Key di tabel "banyak" |
| **Many-to-Many** | Banyak ke banyak (N:M) | Tabel penghubung dengan 2 Foreign Key |

**Ingat:**
- Foreign Key = cara menghubungkan tabel
- Primary Key = identitas unik setiap baris
- Tabel penghubung = solusi untuk Many-to-Many

---

## 📌 3. Membaca ERD

> 💡 **Tips:** Sebelum membaca bagian ini, pastikan Anda sudah memahami konsep relasi database di [Bagian 2](#-2-memahami-relasi-database-database-relations---panduan-lengkap-untuk-pemula) di atas.

ERD (Entity Relationship Diagram) adalah diagram visual yang menunjukkan struktur database dan hubungan antar tabel. ERD dalam tugas ini terdiri dari entitas berikut:

- **dokter** - Tabel data dokter
- **pasien** - Tabel data pasien
- **administrator** - Tabel data administrator
- **pasien_dokter** - Tabel penghubung pasien dan dokter (Many-to-Many)
- **daftar** - Tabel riwayat pendaftaran pasien
- **dokter_admin** - Tabel penghubung dokter dan administrator (Many-to-Many)

### 📎 Relasi antar tabel:

1. **Pasien —< Daftar** (One-to-Many)
   - Satu pasien dapat memiliki banyak riwayat daftar.
   - Implementasi: Foreign Key `id_pasien` di tabel `daftar`

2. **Pasien —< Pasien_Dokter >— Dokter** (Many-to-Many)
   - Relasi many-to-many antara pasien dan dokter.
   - Implementasi: Tabel penghubung `pasien_dokter` dengan 2 Foreign Key

3. **Dokter —< Dokter_Admin >— Administrator** (Many-to-Many)
   - Relasi many-to-many antara dokter dan administrator.
   - Implementasi: Tabel penghubung `dokter_admin` dengan 2 Foreign Key

### Cara membaca simbol ERD:
- **PK** = Primary Key (kunci utama, identitas unik)
- **FK** = Foreign Key (kunci asing, menghubungkan ke tabel lain)
- **Crow's foot** (3 garis) = many (banyak)
- **Garis tunggal** = one (satu)
- **—<** = One-to-Many (satu ke banyak)
- **>—** = Many-to-One (banyak ke satu)
- **—< >—** = Many-to-Many (banyak ke banyak, dengan tabel penghubung di tengah)

---

## 📌 4. SQL Implementasi Berdasarkan ERD

```sql
CREATE TABLE dokter (
  id_dokter INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  spesialis VARCHAR(100)
);

CREATE TABLE pasien (
  id_pasien INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  alamat VARCHAR(150)
);

CREATE TABLE administrator (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100)
);

CREATE TABLE pasien_dokter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pasien INT,
  id_dokter INT,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien),
  FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter)
);

CREATE TABLE daftar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_pasien INT,
  tanggal DATE,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)
);

CREATE TABLE dokter_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_dokter INT,
  id_admin INT,
  FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter),
  FOREIGN KEY (id_admin) REFERENCES administrator(id_admin)
);
```

SQL di atas dibuat berdasarkan hubungan yang terlihat pada ERD.

---

## 📌 5. Hasil Praktikum

Hasil yang dicapai:
- Docker berhasil menjalankan MariaDB
- Database tugas_msim4206 sudah dibuat
- Seluruh tabel sesuai ERD berhasil dibuat
- Foreign key berfungsi dengan benar
- Akses dan query diuji melalui SQL client

Disarankan menampilkan:
- Screenshot container Docker
- Screenshot tabel di DBeaver / phpMyAdmin
- Screenshot hasil query SELECT

---

## 📌 6. Panduan Video Pelaporan (Sesuai Tugas)

Video harus berisi:
1. Perkenalan identitas mahasiswa
2. Langkah-langkah praktikum
   - Menjalankan Docker
   - Membuat database
   - Membuat tabel
3. Hasil implementasi
4. Penutup

---

## 📌 7. Penutup

Walaupun XAMPP direkomendasikan pada tugas, Docker merupakan pendekatan yang lebih modern dan modular untuk menjalankan MariaDB.  
Implementasi ini tetap sepenuhnya sesuai dengan ERD dan instruksi tugas.
