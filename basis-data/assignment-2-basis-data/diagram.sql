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