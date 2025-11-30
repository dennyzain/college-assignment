# 📚 PRAKTIKUM BASIS DATA - TUGAS 3

Panduan lengkap untuk Praktikum Transaksi dan Basis Data Terdistribusi menggunakan Docker.

---

## 📖 Daftar Isi

1. [Persiapan](#-persiapan)
2. [Praktikum A: Transaksi](#-praktikum-a-transaksi)
3. [Praktikum B: Basis Data Terdistribusi](#-praktikum-b-basis-data-terdistribusi)
4. [Membuat Video](#-membuat-video)
5. [Troubleshooting](#-troubleshooting)

---

## 🚀 Persiapan

### 1. Install Docker

**Windows/Mac:**
- Download dari [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install dan restart komputer

**Linux:**
```bash
sudo apt update
sudo apt install docker.io docker-compose
```

### 2. Install Python Libraries

```bash
pip install mysql-connector-python
```

### 3. Setup Environment

```bash
# Buat folder kerja
mkdir praktikum-database
cd praktikum-database

# Save file docker-compose.yml (lihat di bawah)
```

### 4. File docker-compose.yml

Buat file `docker-compose.yml` dengan isi:

```yaml
version: '3.8'

services:
  # Database untuk Praktikum Transaksi
  mysql-main:
    image: mysql:8.0
    container_name: mysql-main
    environment:
      MYSQL_ROOT_PASSWORD: root123
    ports:
      - "3306:3306"
    command: --default-authentication-plugin=mysql_native_password
    networks:
      - db-network

  # Database Node 1 (Jakarta)
  mysql-node1:
    image: mysql:8.0
    container_name: mysql-node1
    environment:
      MYSQL_ROOT_PASSWORD: root123
    ports:
      - "3307:3306"
    command: --default-authentication-plugin=mysql_native_password
    networks:
      - db-network

  # Database Node 2 (Surabaya)
  mysql-node2:
    image: mysql:8.0
    container_name: mysql-node2
    environment:
      MYSQL_ROOT_PASSWORD: root123
    ports:
      - "3308:3306"
    command: --default-authentication-plugin=mysql_native_password
    networks:
      - db-network

  # phpMyAdmin (Optional)
  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin
    environment:
      PMA_ARBITRARY: 1
    ports:
      - "8080:80"
    depends_on:
      - mysql-main
      - mysql-node1
      - mysql-node2
    networks:
      - db-network

networks:
  db-network:
    driver: bridge
```

### 5. Jalankan Docker

```bash
# Start semua container
docker-compose up -d

# Cek status (harus ada 4 container running)
docker ps

# Stop semua container
docker-compose down
```

---

## 📝 Praktikum A: Transaksi

### Konsep Dasar

**Transaksi** adalah serangkaian operasi database yang diperlakukan sebagai satu unit kerja tunggal.

**Prinsip ACID:**
- **Atomicity**: Semua berhasil atau semua dibatalkan
- **Consistency**: Data tetap konsisten
- **Isolation**: Transaksi tidak saling mengganggu
- **Durability**: Data permanen setelah commit

### Langkah Praktikum

#### 1. Masuk ke MySQL

```bash
docker exec -it mysql-main mysql -uroot -proot123
```

#### 2. Setup Database

```sql
-- Buat database dan tabel
CREATE DATABASE praktikum_transaksi;
USE praktikum_transaksi;

CREATE TABLE rekening (
    no_rek VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(50),
    saldo INT
);

-- Isi data awal
INSERT INTO rekening VALUES 
('001', 'Budi', 1000000),
('002', 'Ani', 500000),
('003', 'Citra', 750000);

-- Lihat data
SELECT * FROM rekening;
```

#### 3. Demo COMMIT (Transaksi Berhasil)

```sql
START TRANSACTION;

-- Budi tarik uang 100rb
UPDATE rekening SET saldo = saldo - 100000 WHERE no_rek = '001';

-- Cek hasilnya (sementara, belum permanent)
SELECT * FROM rekening WHERE no_rek = '001';

-- Simpan permanen
COMMIT;

-- Cek hasil akhir
SELECT * FROM rekening WHERE no_rek = '001';
```

**Penjelasan:**
- `START TRANSACTION`: Mulai transaksi
- `COMMIT`: Simpan perubahan permanen
- Saldo Budi berkurang dari 1,000,000 menjadi 900,000

#### 4. Demo ROLLBACK (Transaksi Dibatalkan)

```sql
START TRANSACTION;

-- Ani coba tarik 600rb (saldonya cuma 500rb)
UPDATE rekening SET saldo = saldo - 600000 WHERE no_rek = '002';

-- Cek (saldonya jadi minus -100rb!)
SELECT * FROM rekening WHERE no_rek = '002';

-- Batalkan karena tidak valid
ROLLBACK;

-- Cek lagi (kembali normal)
SELECT * FROM rekening WHERE no_rek = '002';
```

**Penjelasan:**
- `ROLLBACK`: Batalkan semua perubahan
- Saldo Ani tetap 500,000 (tidak berubah)
- Ini menjaga konsistensi data

#### 5. Demo TRANSFER (Paling Penting!)

```sql
START TRANSACTION;

-- Budi transfer 200rb ke Citra
-- Step 1: Kurangi saldo Budi
UPDATE rekening SET saldo = saldo - 200000 WHERE no_rek = '001';

-- Step 2: Tambah saldo Citra
UPDATE rekening SET saldo = saldo + 200000 WHERE no_rek = '003';

-- Cek kedua rekening
SELECT * FROM rekening WHERE no_rek IN ('001','003');

-- Kalau sudah benar, simpan
COMMIT;

-- Verifikasi hasil akhir
SELECT * FROM rekening;
```

**Penjelasan:**
- Transfer membutuhkan 2 operasi (debit & kredit)
- Harus **keduanya berhasil** atau **keduanya dibatalkan**
- Ini konsep **Atomicity** dalam ACID

#### 6. Keluar dari MySQL

```sql
exit
```

### Konsep yang Dipelajari

| Konsep | Penjelasan | Contoh |
|--------|------------|--------|
| **COMMIT** | Simpan perubahan permanen | Transfer berhasil |
| **ROLLBACK** | Batalkan semua perubahan | Saldo tidak cukup |
| **Atomicity** | Semua atau tidak sama sekali | Debit + Kredit bersamaan |
| **Consistency** | Data tetap valid | Tidak boleh saldo minus |

---

## 🌐 Praktikum B: Basis Data Terdistribusi

### Konsep Dasar

**Basis Data Terdistribusi** adalah database yang datanya tersebar di beberapa lokasi fisik berbeda.

**Konsep Penting:**
- **Fragmentasi**: Memecah data ke beberapa node
- **Replikasi**: Menyalin data ke beberapa node
- **Transparansi Lokasi**: User tidak perlu tahu data ada di mana
- **Query Terdistribusi**: Mengambil data dari multiple nodes

### Skenario Praktikum

Kampus dengan 2 cabang:
- **Node 1**: Database mahasiswa Jakarta (Port 3307)
- **Node 2**: Database mahasiswa Surabaya (Port 3308)

### Langkah Praktikum

#### 1. Setup Database Jakarta

```bash
# Masuk ke Node 1
docker exec -it mysql-node1 mysql -uroot -proot123
```

```sql
-- Buat database Jakarta
CREATE DATABASE kampus_jakarta;
USE kampus_jakarta;

-- Tabel mahasiswa
CREATE TABLE mahasiswa (
    nim VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(50),
    jurusan VARCHAR(30),
    kota VARCHAR(20) DEFAULT 'Jakarta'
);

-- Isi data mahasiswa Jakarta
INSERT INTO mahasiswa VALUES
('J001', 'Ahmad', 'Informatika', 'Jakarta'),
('J002', 'Siti', 'Sistem Informasi', 'Jakarta'),
('J003', 'Rina', 'Informatika', 'Jakarta');

-- Lihat data
SELECT * FROM mahasiswa;

exit
```

#### 2. Setup Database Surabaya

```bash
# Masuk ke Node 2
docker exec -it mysql-node2 mysql -uroot -proot123
```

```sql
-- Buat database Surabaya
CREATE DATABASE kampus_surabaya;
USE kampus_surabaya;

-- Tabel mahasiswa
CREATE TABLE mahasiswa (
    nim VARCHAR(10) PRIMARY KEY,
    nama VARCHAR(50),
    jurusan VARCHAR(30),
    kota VARCHAR(20) DEFAULT 'Surabaya'
);

-- Isi data mahasiswa Surabaya
INSERT INTO mahasiswa VALUES
('S001', 'Budi', 'Informatika', 'Surabaya'),
('S002', 'Dewi', 'Sistem Informasi', 'Surabaya'),
('S003', 'Eko', 'Informatika', 'Surabaya');

-- Lihat data
SELECT * FROM mahasiswa;

exit
```

#### 3. Query Terdistribusi dengan Python

Buat file `distributed.py`:

```python
import mysql.connector

print("="*50)
print("QUERY BASIS DATA TERDISTRIBUSI")
print("="*50)

# Koneksi ke Node Jakarta
jakarta = mysql.connector.connect(
    host='localhost',
    port=3307,
    user='root',
    password='root123',
    database='kampus_jakarta',
    allow_public_key_retrieval=True
)

# Koneksi ke Node Surabaya
surabaya = mysql.connector.connect(
    host='localhost',
    port=3308,
    user='root',
    password='root123',
    database='kampus_surabaya',
    allow_public_key_retrieval=True
)

# Query data Jakarta
print("\n📍 MAHASISWA JAKARTA:")
cursor_jkt = jakarta.cursor()
cursor_jkt.execute("SELECT * FROM mahasiswa")
data_jakarta = cursor_jkt.fetchall()

for row in data_jakarta:
    print(f"   {row[0]} - {row[1]} - {row[2]} - {row[3]}")

# Query data Surabaya
print("\n📍 MAHASISWA SURABAYA:")
cursor_sby = surabaya.cursor()
cursor_sby.execute("SELECT * FROM mahasiswa")
data_surabaya = cursor_sby.fetchall()

for row in data_surabaya:
    print(f"   {row[0]} - {row[1]} - {row[2]} - {row[3]}")

# Gabungkan hasil (Distributed Query)
print("\n📊 SEMUA MAHASISWA (GABUNGAN):")
print("-" * 50)
semua_mahasiswa = data_jakarta + data_surabaya

for row in semua_mahasiswa:
    print(f"   {row[0]} - {row[1]} - {row[2]} - {row[3]}")

print(f"\n✅ Total: {len(semua_mahasiswa)} mahasiswa dari 2 lokasi")

# Tutup koneksi
cursor_jkt.close()
cursor_sby.close()
jakarta.close()
surabaya.close()

print("="*50)
```

#### 4. Jalankan Script

```bash
python distributed.py
```

**Output yang diharapkan:**
```
==================================================
QUERY BASIS DATA TERDISTRIBUSI
==================================================

📍 MAHASISWA JAKARTA:
   J001 - Ahmad - Informatika - Jakarta
   J002 - Siti - Sistem Informasi - Jakarta
   J003 - Rina - Informatika - Jakarta

📍 MAHASISWA SURABAYA:
   S001 - Budi - Informatika - Surabaya
   S002 - Dewi - Sistem Informasi - Surabaya
   S003 - Eko - Informatika - Surabaya

📊 SEMUA MAHASISWA (GABUNGAN):
--------------------------------------------------
   J001 - Ahmad - Informatika - Jakarta
   J002 - Siti - Sistem Informasi - Jakarta
   J003 - Rina - Informatika - Jakarta
   S001 - Budi - Informatika - Surabaya
   S002 - Dewi - Sistem Informasi - Surabaya
   S003 - Eko - Informatika - Surabaya

✅ Total: 6 mahasiswa dari 2 lokasi
==================================================
```

### Konsep yang Dipelajari

| Konsep | Penjelasan | Implementasi |
|--------|------------|--------------|
| **Fragmentasi Horizontal** | Data dipecah berdasarkan baris | Mahasiswa Jakarta & Surabaya terpisah |
| **Transparansi Lokasi** | User tidak perlu tahu data di mana | Script Python yang handle routing |
| **Query Terdistribusi** | Ambil data dari multiple nodes | Gabungkan hasil dengan Python |
| **Autonomi Lokal** | Setiap node independen | Jakarta & Surabaya bisa diakses sendiri-sendiri |

### Keuntungan Distributed Database

✅ **Performance**: Query lebih cepat (data lokal)  
✅ **Scalability**: Mudah tambah node baru  
✅ **Availability**: Jika 1 node down, yang lain masih jalan  
✅ **Local Autonomy**: Setiap cabang kelola data sendiri  

### Tantangan Distributed Database

⚠️ **Kompleksitas**: Lebih sulit maintain  
⚠️ **Network Dependency**: Butuh koneksi antar node  
⚠️ **Consistency**: Harus sinkronisasi data  
⚠️ **Security**: Harus amankan multiple nodes  
