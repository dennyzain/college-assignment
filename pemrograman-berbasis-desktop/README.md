# Sistem Manajemen Restoran (Restaurant Management System)

A console-based restaurant management application written in Java. It is a
coursework project for **Pemrograman Berbasis Desktop** that demonstrates the
four core Object-Oriented Programming (OOP) concepts together with simple
text-file persistence.

With the program you can build a restaurant menu (food, drinks, and discount
items), take customer orders, print a receipt (*struk*), and save/load both the
menu and receipts to plain-text files.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Class Overview](#class-overview)
- [Class Diagram](#class-diagram)
- [OOP Concepts Demonstrated](#oop-concepts-demonstrated)
- [Program Flow](#program-flow)
- [Data Persistence](#data-persistence)
- [How to Run](#how-to-run)
- [Example Session](#example-session)
- [Notes](#notes)

---

## Features

- ➕ **Tambah Item Menu** — add a *Makanan* (food), *Minuman* (drink), or
  *Diskon* (discount item) to the menu.
- 📋 **Tampilkan Menu** — display the full menu in a formatted table.
- 🧾 **Buat Pesanan** — create an order for a named customer and print the receipt.
- 💾 **Simpan / Muat Menu** — persist the menu to `menu.txt` and reload it on
  startup.
- 📂 **Lihat Struk Tersimpan** — display all receipts previously saved to
  `struk.txt`.
- 🛡️ **Robust input** — numeric inputs are validated in a loop, and invalid menu
  indices / file lines are handled with exceptions instead of crashing.

---

## Project Structure

```
pemrograman-berbasis-desktop/
└── src/
    ├── Main.java          # Entry point + console menu loop (UI / controller)
    ├── MenuItem.java      # Abstract base class for any menu item
    ├── Makanan.java       # Food item     (extends MenuItem)
    ├── Minuman.java       # Drink item    (extends MenuItem)
    ├── Diskon.java        # Discount item (extends MenuItem)
    ├── Menu.java          # Holds the collection of MenuItem
    ├── Pesanan.java       # A customer order (items + receipt)
    └── FileManager.java   # Save/load menu & receipts to text files
```

Generated at runtime (in the directory you run the program from):

```
menu.txt        # Persisted menu items  (overwritten on save)
struk.txt       # Append-only log of saved receipts
```

---

## Class Overview

| Class         | Type        | Responsibility |
|---------------|-------------|----------------|
| `MenuItem`    | **abstract**| Base type holding `nama` (name), `harga` (price) and `kategori` (category). Declares abstract `tampilMenu()` and `toFileString()`. |
| `Makanan`     | concrete    | A food item with an extra `jenisMakanan` (food type). Category fixed to `"Makanan"`. |
| `Minuman`     | concrete    | A drink item with an extra `jenisMinuman` (drink type). Category fixed to `"Minuman"`. |
| `Diskon`      | concrete    | A discount item with a `diskon` percentage; exposes `getHargaSetelahDiskon()` (price after discount). Category fixed to `"Diskon"`. |
| `Menu`        | concrete    | Wraps an `ArrayList<MenuItem>`. Supports `tambahItem`, `getItem` (by index), `cariItem` (by name), and `tampilkanMenu`. |
| `Pesanan`     | concrete    | One customer order: a customer name plus a list of ordered `MenuItem`s. Computes the total and renders the receipt. |
| `FileManager` | utility     | **Static** helpers to save/load the menu (`menu.txt`) and save/show receipts (`struk.txt`). |
| `Main`        | entry point | Console UI + main program loop wiring everything together. |

### Key method signatures

```java
// MenuItem (abstract)
public abstract void   tampilMenu();      // print one formatted menu row
public abstract String toFileString();    // serialize to a CSV line

// Diskon
public double getHargaSetelahDiskon();    // harga * (1 - diskon/100)

// Menu
public void     tambahItem(MenuItem item);
public MenuItem getItem(int index);       // throws IndexOutOfBoundsException
public MenuItem cariItem(String nama);    // throws IllegalArgumentException

// Pesanan
public void   tambahItem(MenuItem item);
public double hitungTotal();              // Diskon items use price-after-discount
public void   tampilkanStruk();           // print receipt to console
public String toStrukString();            // same receipt as a String (for file)

// FileManager (all static)
public static void simpanMenu(Menu menu);
public static void muatMenu(Menu menu);
public static void simpanStruk(String strukString);   // append mode
public static void muatStruk();
```

---

## Class Diagram

```
                         MenuItem (abstract)
                 - nama, harga, kategori
                 + tampilMenu()      «abstract»
                 + toFileString()    «abstract»
                 ▲          ▲          ▲
                 │          │          │
            ┌────┘          │          └────┐
         Makanan         Minuman          Diskon
       + jenisMakanan  + jenisMinuman   + diskon (%)
                                        + getHargaSetelahDiskon()

   Menu        ◇──"has many"──► MenuItem      (ArrayList<MenuItem>)
   Pesanan     ◇──"has many"──► MenuItem      (ArrayList<MenuItem>)
   Main        ──"uses"──►  Menu, Pesanan, FileManager
   FileManager ──"creates"─► Makanan / Minuman / Diskon (when loading)
```

---

## OOP Concepts Demonstrated

1. **Abstraction** — `MenuItem` is an `abstract class` with abstract methods
   `tampilMenu()` and `toFileString()`. A raw "menu item" can never be
   instantiated; only concrete subtypes can.

2. **Inheritance** — `Makanan`, `Minuman`, and `Diskon` all `extends MenuItem`,
   reusing the shared `nama`/`harga`/`kategori` state via `super(...)`.

3. **Polymorphism** — collections store the items as `MenuItem`, but calls such
   as `item.tampilMenu()` and `item.toFileString()` dispatch to the correct
   subclass at runtime. `Pesanan.hitungTotal()` and `tampilkanStruk()` also use
   `instanceof Diskon` to apply the discounted price only for discount items.

4. **Encapsulation** — fields are `private` and accessed only through
   getters/setters (e.g. `getNama()`, `getHarga()`, `getHargaSetelahDiskon()`),
   and `Menu`/`Pesanan` guard their internal lists with helper methods.

---

## Program Flow

### Startup → main loop (`Main`)

```
main()
  │
  ├─ print welcome banner
  ├─ FileManager.muatMenu(menu)         # load menu.txt into Menu (if it exists)
  │
  └─ loop while running:
        tampilkanMenuUtama()            # show 6 options
        read choice (bacaInt)
        ├─ 1 → tambahItemMenu()         # add Makanan / Minuman / Diskon
        ├─ 2 → menu.tampilkanMenu()     # list all items
        ├─ 3 → prosesOrderPelanggan()   # create an order (core use case)
        ├─ 4 → lihatStrukTersimpan()    # print struk.txt
        ├─ 5 → simpanMenuKeFile()       # write menu.txt
        └─ 6 → exit ("Terima kasih!")
```

### `tambahItemMenu()` — add an item

```
choose type (1 Makanan / 2 Minuman / 3 Diskon)
read nama, harga
  ├─ Makanan → read jenis  → menu.tambahItem(new Makanan(...))
  ├─ Minuman → read jenis  → menu.tambahItem(new Minuman(...))
  └─ Diskon  → read persen → menu.tambahItem(new Diskon(...))
```

### `prosesOrderPelanggan()` — the core use case

```
prosesOrderPelanggan()
  │
  ├─ if menu empty → abort ("Menu masih kosong")
  │
  ├─ read namaPelanggan
  ├─ new Pesanan(namaPelanggan)
  ├─ menu.tampilkanMenu()
  │
  ├─ loop:                                   # add items by number
  │     read item number (0 = selesai)
  │     try  menu.getItem(nomor - 1)         # may throw IndexOutOfBounds
  │     →    pesanan.tambahItem(item)
  │
  ├─ if no items → abort
  ├─ pesanan.tampilkanStruk()                # total via hitungTotal()
  │
  └─ ask "Simpan struk? (y/n)"
        if y → FileManager.simpanStruk(pesanan.toStrukString())   # append struk.txt
```

### Object collaboration during an order

```
Main ──getItem──► Menu ──► MenuItem (Makanan / Minuman / Diskon)
 │
 ├──tambahItem──► Pesanan   (stores the item reference)
 │
 ├──hitungTotal──► Pesanan ──┬─ Diskon?  → getHargaSetelahDiskon()   ┐ polymorphism
 │                           └─ else     → getHarga()                ┘ + instanceof
 │
 └──simpanStruk──► FileManager ──► struk.txt
```

---

## Data Persistence

### `menu.txt` — one item per line, comma-separated

Format depends on the item type (the first field is a type tag):

```
MAKANAN,<nama>,<harga>,<jenisMakanan>
MINUMAN,<nama>,<harga>,<jenisMinuman>
DISKON,<nama>,<harga>,<diskonPersen>
```

Example:

```
MAKANAN,Nasi Goreng,15000.0,Goreng
MINUMAN,Es Teh,3000.0,Dingin
DISKON,Promo Member,0.0,10.0
```

On startup `FileManager.muatMenu()` reads each line, splits on `,`, looks at the
type tag, and rebuilds the matching subclass. Malformed lines (wrong number of
fields or non-numeric prices) are reported and skipped — they don't crash the
program. `simpanMenu()` **overwrites** `menu.txt` with the current menu.

### `struk.txt` — saved receipts (append-only)

`simpanStruk()` opens the file with `new FileWriter(STRUK_FILE, true)` (append
mode), so every saved receipt is added to the end of the file and the history is
preserved across runs. A receipt looks like:

```
=======================================================
              STRUK PESANAN
=======================================================
Pelanggan : Budi
-------------------------------------------------------
  Nasi Goreng                   Rp   15000.00
  Promo Member (diskon 10.0%)   Rp       0.00
-------------------------------------------------------
  TOTAL                         Rp   15000.00
=======================================================
       Terima kasih telah berkunjung!
=======================================================
```

---

## How to Run

Requires a JDK (Java 8+). From the `src/` directory:

```bash
# Compile all source files
javac *.java

# Run the application
java Main
```

`menu.txt` and `struk.txt` are created in whatever directory you launch
`java Main` from.

---

## Example Session

```
=======================================================
   Selamat Datang di Sistem Manajemen Restoran
=======================================================
File menu.txt belum ada. Menu kosong.

--- MENU UTAMA ---
1. Tambah item ke menu
2. Tampilkan menu restoran
3. Buat pesanan pelanggan
4. Lihat semua struk tersimpan
5. Simpan menu ke file
6. Keluar
Pilih menu: 1

-- Tambah Item Menu --
1. Makanan
2. Minuman
3. Diskon
Pilih tipe item: 1
Nama item    : Nasi Goreng
Harga (Rp)   : 15000
Jenis makanan: Goreng
Makanan 'Nasi Goreng' berhasil ditambahkan.

Pilih menu: 3
Nama pelanggan: Budi
... (pick item numbers, 0 to finish) ...

=======================================================
              STRUK PESANAN
=======================================================
Pelanggan : Budi
-------------------------------------------------------
  Nasi Goreng                   Rp   15000.00
-------------------------------------------------------
  TOTAL                         Rp   15000.00
=======================================================
       Terima kasih telah berkunjung!
=======================================================
Simpan struk ke file? (y/n): y
Struk berhasil disimpan ke struk.txt
```

---

## Notes

- **`Diskon` is itself a menu item**, not a global rule. The discount only
  affects the total when a `Diskon` object is added to an order; its contribution
  is `harga × (1 − diskon/100)` via `getHargaSetelahDiskon()`.
- Orders do **not** track quantities — each `tambahItem` adds one line. Ordering
  the same dish twice means selecting its number twice.
- Prices are stored as `double` and printed with `%.2f` (e.g. `Rp 15000.00`);
  there is no locale-aware currency formatting.
- The in-memory `Menu` is only written to disk when you choose option **5**
  (Simpan menu ke file); added items are otherwise lost on exit.
```
