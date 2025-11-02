CREATE TABLE "mahasiswa" (
  "id" int PRIMARY KEY,
  "nama" varchar,
  "alamat" varchar,
  "jurusan" varchar
);

CREATE TABLE "dosen" (
  "id" int PRIMARY KEY,
  "nama" varchar,
  "departemen" varchar
);

CREATE TABLE "mata_kuliah" (
  "kode_mata_kuliah" varchar PRIMARY KEY,
  "nama_mata_kuliah" varchar,
  "sks" int
);

CREATE TABLE "pengambilan" (
  "mahasiswa_id" int,
  "mata_kuliah_kode" varchar,
  "primary" key(mahasiswa_id,mata_kuliah_kode)
);

ALTER TABLE "pengambilan" ADD FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa" ("id");

ALTER TABLE "pengambilan" ADD FOREIGN KEY ("mata_kuliah_kode") REFERENCES "mata_kuliah" ("kode_mata_kuliah");

ALTER TABLE "mata_kuliah" ADD FOREIGN KEY ("kode_mata_kuliah") REFERENCES "dosen" ("id");
