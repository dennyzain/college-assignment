-- ============================================
-- PRAKTIKUM A: TRANSAKSI 
-- ============================================

-- 1. BUAT DATABASE DAN TABEL
CREATE DATABASE praktikum_transaksi;
USE praktikum_transaksi;

-- Tabel rekening bank
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

-- ============================================
-- 2. CONTOH TRANSAKSI BERHASIL (COMMIT)
-- ============================================

START TRANSACTION;

-- Budi tarik uang 100rb
UPDATE rekening SET saldo = saldo - 100000 WHERE no_rek = '001';

-- Cek hasilnya (sementara)
SELECT * FROM rekening WHERE no_rek = '001';

-- Simpan permanen
COMMIT;

-- Cek lagi
SELECT * FROM rekening WHERE no_rek = '001';

-- ============================================
-- 3. CONTOH TRANSAKSI GAGAL (ROLLBACK)
-- ============================================

START TRANSACTION;

-- Ani coba tarik 600rb (padahal saldonya cuma 400rb)
UPDATE rekening SET saldo = saldo - 600000 WHERE no_rek = '002';

-- Cek (saldonya jadi minus!)
SELECT * FROM rekening WHERE no_rek = '002';

-- Batalkan karena error
ROLLBACK;

-- Cek lagi (kembali normal)
SELECT * FROM rekening WHERE no_rek = '002';

-- ============================================
-- 4. TRANSAKSI TRANSFER (PALING PENTING!)
-- ============================================

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

-- Cek hasil akhir semua rekening
SELECT * FROM rekening;

-- ============================================
-- 5. KESIMPULAN
-- ============================================
-- COMMIT    = Simpan perubahan ✅
-- ROLLBACK  = Batalkan perubahan ❌
-- Transaksi memastikan data konsisten dan aman