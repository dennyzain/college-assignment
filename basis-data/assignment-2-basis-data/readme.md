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

## 📌 2. Membaca ERD

ERD terdiri dari entitas berikut:
- dokter
- pasien
- administrator
- pasien_dokter
- daftar
- dokter_admin

### 📎 Relasi antar tabel:

1. **Pasien —< Daftar**
   - Satu pasien dapat memiliki banyak riwayat daftar.

2. **Pasien —< Pasien_Dokter >— Dokter**
   - Relasi many-to-many antara pasien dan dokter.

3. **Dokter —< Dokter_Admin >— Administrator**
   - Relasi many-to-many antara dokter dan administrator.

### Cara membaca simbol ERD:
- **PK** = Primary Key
- **FK** = Foreign Key
- **Crow's foot** (3 garis) = many
- **Garis tunggal** = one

---

## 📌 3. SQL Implementasi Berdasarkan ERD

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

## 📌 4. Hasil Praktikum

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

## 📌 5. Panduan Video Pelaporan (Sesuai Tugas)

Video harus berisi:
1. Perkenalan identitas mahasiswa
2. Langkah-langkah praktikum
   - Menjalankan Docker
   - Membuat database
   - Membuat tabel
3. Hasil implementasi
4. Penutup

---

## 📌 6. Penutup

Walaupun XAMPP direkomendasikan pada tugas, Docker merupakan pendekatan yang lebih modern dan modular untuk menjalankan MariaDB.  
Implementasi ini tetap sepenuhnya sesuai dengan ERD dan instruksi tugas.
