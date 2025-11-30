-- Membuat database
CREATE DATABASE klinik_db;
USE klinik_db;

-- Tabel dokter
CREATE TABLE dokter (
    id_dokter INT PRIMARY KEY,
    nama_dokter VARCHAR(100),
    alamat_dokter VARCHAR(200),
    spesialis VARCHAR(100),
    no_hp VARCHAR(20),
    tanggal_lahir DATE,
    waktu_kerja TIME
);

-- Tabel administrator
CREATE TABLE administrator (
    id_admin INT PRIMARY KEY,
    nama_admin VARCHAR(100),
    waktu_jaga TIME
);

-- Tabel pasien
CREATE TABLE pasien (
    id_pasien INT PRIMARY KEY,
    nama_pasien VARCHAR(100),
    alamat_pasien VARCHAR(200),
    jenis_kelamin VARCHAR(10)
);

-- Tabel dokter_admin
CREATE TABLE dokter_admin (
    id_admin INT,
    id_dokter INT,
    id_data INT,
    PRIMARY KEY (id_admin, id_dokter),
    FOREIGN KEY (id_admin) REFERENCES administrator(id_admin),
    FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter)
);

-- Tabel daftar
CREATE TABLE daftar (
    id_daftar INT PRIMARY KEY,
    id_admin INT,
    id_pasien INT,
    FOREIGN KEY (id_admin) REFERENCES administrator(id_admin),
    FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)
);

-- Tabel pasien_dokter
CREATE TABLE pasien_dokter (
    id INT PRIMARY KEY,
    id_dokter INT,
    id_pasien INT,
    waktu_periksa DATETIME,
    resep TEXT,
    FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter),
    FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien)
);

-- Insert data untuk tabel dokter
INSERT INTO dokter (id_dokter, nama_dokter, alamat_dokter, spesialis, no_hp, tanggal_lahir, waktu_kerja) VALUES
(1, 'Dr. Ahmad Wijaya', 'Jl. Sudirman No. 123, Jakarta', 'Dokter Umum', '081234567890', '1980-05-15', '08:00:00'),
(2, 'Dr. Siti Nurhaliza', 'Jl. Gatot Subroto No. 45, Jakarta', 'Dokter Anak', '081234567891', '1985-08-20', '09:00:00'),
(3, 'Dr. Budi Santoso', 'Jl. Thamrin No. 67, Jakarta', 'Dokter Jantung', '081234567892', '1978-03-10', '10:00:00'),
(4, 'Dr. Rina Kartika', 'Jl. Kebon Jeruk No. 89, Jakarta', 'Dokter Kandungan', '081234567893', '1982-11-25', '08:30:00'),
(5, 'Dr. Andi Pratama', 'Jl. Senopati No. 12, Jakarta', 'Dokter Mata', '081234567894', '1987-07-05', '09:30:00');

-- Insert data untuk tabel administrator
INSERT INTO administrator (id_admin, nama_admin, waktu_jaga) VALUES
(1, 'Bambang Sutrisno', '08:00:00'),
(2, 'Sari Indah', '14:00:00'),
(3, 'Dedi Kurniawan', '20:00:00'),
(4, 'Maya Sari', '08:00:00'),
(5, 'Rudi Hartono', '14:00:00');

-- Insert data untuk tabel pasien
INSERT INTO pasien (id_pasien, nama_pasien, alamat_pasien, jenis_kelamin) VALUES
(1, 'Ahmad Fauzi', 'Jl. Merdeka No. 10, Jakarta', 'Laki-laki'),
(2, 'Sinta Dewi', 'Jl. Asia Afrika No. 20, Bandung', 'Perempuan'),
(3, 'Rudi Hermawan', 'Jl. Diponegoro No. 30, Yogyakarta', 'Laki-laki'),
(4, 'Maya Sari', 'Jl. Ahmad Yani No. 40, Surabaya', 'Perempuan'),
(5, 'Budi Santoso', 'Jl. Gajah Mada No. 50, Jakarta', 'Laki-laki'),
(6, 'Indah Permata', 'Jl. Hayam Wuruk No. 60, Jakarta', 'Perempuan'),
(7, 'Dedi Kurniawan', 'Jl. Sudirman No. 70, Jakarta', 'Laki-laki'),
(8, 'Rina Kartika', 'Jl. Thamrin No. 80, Jakarta', 'Perempuan');

-- Insert data untuk tabel dokter_admin
INSERT INTO dokter_admin (id_admin, id_dokter, id_data) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 3),
(2, 4, 4),
(3, 5, 5),
(4, 1, 6),
(4, 3, 7),
(5, 2, 8);

-- Insert data untuk tabel daftar
INSERT INTO daftar (id_daftar, id_admin, id_pasien) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 2, 3),
(4, 2, 4),
(5, 3, 5),
(6, 4, 6),
(7, 4, 7),
(8, 5, 8),
(9, 1, 3),
(10, 2, 5);

-- Insert data untuk tabel pasien_dokter
INSERT INTO pasien_dokter (id, id_dokter, id_pasien, waktu_periksa, resep) VALUES
(1, 1, 1, '2024-01-15 09:00:00', 'Paracetamol 500mg 3x1 setelah makan, Amoxicillin 500mg 3x1 setelah makan'),
(2, 2, 2, '2024-01-15 10:00:00', 'Vitamin C 1000mg 1x1, Zinc 20mg 1x1'),
(3, 3, 3, '2024-01-16 11:00:00', 'Aspirin 100mg 1x1, Atorvastatin 20mg 1x1 malam'),
(4, 4, 4, '2024-01-16 14:00:00', 'Asam Folat 400mcg 1x1, Kalsium 1000mg 1x1'),
(5, 5, 5, '2024-01-17 09:30:00', 'Tetes mata antibiotik 3x1, Salep mata 2x1'),
(6, 1, 6, '2024-01-17 10:30:00', 'Paracetamol 500mg 3x1, Ibuprofen 400mg 3x1'),
(7, 3, 7, '2024-01-18 11:30:00', 'Metformin 500mg 2x1, Glibenclamide 5mg 2x1'),
(8, 2, 8, '2024-01-18 15:00:00', 'Vitamin D 1000 IU 1x1, Multivitamin 1x1'),
(9, 1, 3, '2024-01-19 09:00:00', 'Paracetamol 500mg 3x1, Dekongestan 3x1'),
(10, 4, 5, '2024-01-19 14:30:00', 'Antibiotik 500mg 3x1, Obat pereda nyeri 3x1');