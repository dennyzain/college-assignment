-- ============================================
-- PRAKTIKUM BASIS DATA TERDISTRIBUSI
-- ============================================

-- ============================================
-- NODE 1: Database Regional Jakarta
-- Koneksi: localhost:3307
-- ============================================

CREATE DATABASE IF NOT EXISTS node1_db;
USE node1_db;

-- Tabel Mahasiswa Regional Jakarta
CREATE TABLE mahasiswa_jakarta (
    nim VARCHAR(15) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(50),
    angkatan INT,
    regional VARCHAR(20) DEFAULT 'JAKARTA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Mata Kuliah
CREATE TABLE mata_kuliah (
    kode_mk VARCHAR(10) PRIMARY KEY,
    nama_mk VARCHAR(100) NOT NULL,
    sks INT NOT NULL,
    semester INT
);

-- Tabel Nilai Regional Jakarta
CREATE TABLE nilai_jakarta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(15),
    kode_mk VARCHAR(10),
    nilai CHAR(1),
    semester INT,
    tahun_akademik VARCHAR(10),
    FOREIGN KEY (nim) REFERENCES mahasiswa_jakarta(nim),
    FOREIGN KEY (kode_mk) REFERENCES mata_kuliah(kode_mk)
);

-- Insert data mahasiswa Jakarta
INSERT INTO mahasiswa_jakarta (nim, nama, jurusan, angkatan) VALUES
('111001', 'Ahmad Fauzi', 'Teknik Informatika', 2023),
('111002', 'Siti Nurhaliza', 'Sistem Informasi', 2023),
('111003', 'Budi Prakoso', 'Teknik Informatika', 2022),
('111004', 'Dewi Kusuma', 'Sistem Informasi', 2022);

-- Insert mata kuliah
INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, semester) VALUES
('TI101', 'Basis Data', 3, 3),
('TI102', 'Pemrograman Web', 3, 3),
('SI101', 'Sistem Informasi Manajemen', 3, 3),
('SI102', 'Analisis dan Desain Sistem', 3, 4);

-- Insert nilai Jakarta
INSERT INTO nilai_jakarta (nim, kode_mk, nilai, semester, tahun_akademik) VALUES
('111001', 'TI101', 'A', 3, '2023/2024'),
('111001', 'TI102', 'B', 3, '2023/2024'),
('111002', 'SI101', 'A', 3, '2023/2024'),
('111003', 'TI101', 'B', 3, '2022/2023');

-- Query untuk Node 1
SELECT * FROM mahasiswa_jakarta;
SELECT * FROM mata_kuliah;
SELECT * FROM nilai_jakarta;

-- View gabungan
CREATE VIEW view_nilai_mahasiswa_jakarta AS
SELECT 
    m.nim,
    m.nama,
    m.jurusan,
    mk.kode_mk,
    mk.nama_mk,
    n.nilai,
    n.tahun_akademik
FROM mahasiswa_jakarta m
JOIN nilai_jakarta n ON m.nim = n.nim
JOIN mata_kuliah mk ON n.kode_mk = mk.kode_mk;

SELECT * FROM view_nilai_mahasiswa_jakarta;

-- ============================================
-- NODE 2: Database Regional Surabaya
-- Koneksi: localhost:3308
-- ============================================

CREATE DATABASE IF NOT EXISTS node2_db;
USE node2_db;

-- Tabel Mahasiswa Regional Surabaya
CREATE TABLE mahasiswa_surabaya (
    nim VARCHAR(15) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(50),
    angkatan INT,
    regional VARCHAR(20) DEFAULT 'SURABAYA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Mata Kuliah (sama dengan Node 1)
CREATE TABLE mata_kuliah (
    kode_mk VARCHAR(10) PRIMARY KEY,
    nama_mk VARCHAR(100) NOT NULL,
    sks INT NOT NULL,
    semester INT
);

-- Tabel Nilai Regional Surabaya
CREATE TABLE nilai_surabaya (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(15),
    kode_mk VARCHAR(10),
    nilai CHAR(1),
    semester INT,
    tahun_akademik VARCHAR(10),
    FOREIGN KEY (nim) REFERENCES mahasiswa_surabaya(nim),
    FOREIGN KEY (kode_mk) REFERENCES mata_kuliah(kode_mk)
);

-- Insert data mahasiswa Surabaya
INSERT INTO mahasiswa_surabaya (nim, nama, jurusan, angkatan) VALUES
('222001', 'Rina Kartika', 'Teknik Informatika', 2023),
('222002', 'Joko Susilo', 'Sistem Informasi', 2023),
('222003', 'Maya Sari', 'Teknik Informatika', 2022),
('222004', 'Adi Nugroho', 'Sistem Informasi', 2022);

-- Insert mata kuliah (sama dengan Node 1)
INSERT INTO mata_kuliah (kode_mk, nama_mk, sks, semester) VALUES
('TI101', 'Basis Data', 3, 3),
('TI102', 'Pemrograman Web', 3, 3),
('SI101', 'Sistem Informasi Manajemen', 3, 3),
('SI102', 'Analisis dan Desain Sistem', 3, 4);

-- Insert nilai Surabaya
INSERT INTO nilai_surabaya (nim, kode_mk, nilai, semester, tahun_akademik) VALUES
('222001', 'TI101', 'A', 3, '2023/2024'),
('222001', 'TI102', 'A', 3, '2023/2024'),
('222002', 'SI101', 'B', 3, '2023/2024'),
('222003', 'TI101', 'A', 3, '2022/2023');

-- Query untuk Node 2
SELECT * FROM mahasiswa_surabaya;
SELECT * FROM mata_kuliah;
SELECT * FROM nilai_surabaya;

-- View gabungan
CREATE VIEW view_nilai_mahasiswa_surabaya AS
SELECT 
    m.nim,
    m.nama,
    m.jurusan,
    mk.kode_mk,
    mk.nama_mk,
    n.nilai,
    n.tahun_akademik
FROM mahasiswa_surabaya m
JOIN nilai_surabaya n ON m.nim = n.nim
JOIN mata_kuliah mk ON n.kode_mk = mk.kode_mk;

SELECT * FROM view_nilai_mahasiswa_surabaya;

-- ============================================
-- QUERY DISTRIBUTED (Simulasi dari Aplikasi)
-- ============================================

-- Query ini akan dijalankan dari aplikasi yang mengakses kedua node

-- 1. Total mahasiswa semua regional
-- SELECT COUNT(*) FROM mahasiswa_jakarta UNION ALL SELECT COUNT(*) FROM mahasiswa_surabaya;

-- 2. Daftar semua mahasiswa
-- SELECT nim, nama, jurusan, angkatan, 'JAKARTA' as regional FROM mahasiswa_jakarta
-- UNION ALL
-- SELECT nim, nama, jurusan, angkatan, 'SURABAYA' as regional FROM mahasiswa_surabaya;

-- 3. Statistik nilai per regional
-- Dari Jakarta:
SELECT 
    'JAKARTA' as regional,
    nilai,
    COUNT(*) as jumlah
FROM nilai_jakarta
GROUP BY nilai;

-- Dari Surabaya:
SELECT 
    'SURABAYA' as regional,
    nilai,
    COUNT(*) as jumlah
FROM nilai_surabaya
GROUP BY nilai;

-- ============================================
-- DEMONSTRASI FRAGMENTASI
-- ============================================

-- HORIZONTAL FRAGMENTATION: Data mahasiswa dipecah berdasarkan regional
-- Node 1: Mahasiswa Jakarta
-- Node 2: Mahasiswa Surabaya

-- VERTICAL FRAGMENTATION: Bisa memecah tabel berdasarkan kolom
-- Contoh: Data pribadi di satu node, data akademik di node lain

-- ============================================
-- DEMONSTRASI REPLIKASI
-- ============================================

-- Tabel mata_kuliah ada di kedua node (replikasi penuh)
-- Keuntungan: Query lebih cepat, tidak perlu akses antar node
-- Tantangan: Harus sync jika ada update