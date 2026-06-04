import java.util.Scanner;
import java.io.IOException;

public class Main {
    private static Scanner scanner = new Scanner(System.in);
    private static Menu menu = new Menu();

    public static void main(String[] args) {
        System.out.println("=".repeat(55));
        System.out.println("   Selamat Datang di Sistem Manajemen Restoran");
        System.out.println("=".repeat(55));

        try {
            FileManager.muatMenu(menu);
        } catch (IOException e) {
            System.out.println("Gagal memuat menu: " + e.getMessage());
        }

        boolean running = true;
        while (running) {
            tampilkanMenuUtama();
            int pilihan = bacaInt("Pilih menu: ");
            switch (pilihan) {
                case 1: tambahItemMenu(); break;
                case 2: menu.tampilkanMenu(); break;
                case 3: prosesOrderPelanggan(); break;
                case 4: lihatStrukTersimpan(); break;
                case 5: simpanMenuKeFile(); break;
                case 6:
                    System.out.println("Terima kasih! Sampai jumpa.");
                    running = false;
                    break;
                default:
                    System.out.println("Pilihan tidak valid. Coba lagi.");
            }
        }
        scanner.close();
    }

    private static void tampilkanMenuUtama() {
        System.out.println("\n--- MENU UTAMA ---");
        System.out.println("1. Tambah item ke menu");
        System.out.println("2. Tampilkan menu restoran");
        System.out.println("3. Buat pesanan pelanggan");
        System.out.println("4. Lihat semua struk tersimpan");
        System.out.println("5. Simpan menu ke file");
        System.out.println("6. Keluar");
    }

    private static void tambahItemMenu() {
        System.out.println("\n-- Tambah Item Menu --");
        System.out.println("1. Makanan");
        System.out.println("2. Minuman");
        System.out.println("3. Diskon");
        int tipe = bacaInt("Pilih tipe item: ");
        System.out.print("Nama item    : ");
        String nama = scanner.nextLine().trim();
        double harga = bacaDouble("Harga (Rp)   : ");

        switch (tipe) {
            case 1: {
                System.out.print("Jenis makanan: ");
                String jenis = scanner.nextLine().trim();
                menu.tambahItem(new Makanan(nama, harga, jenis));
                System.out.println("Makanan '" + nama + "' berhasil ditambahkan.");
                break;
            }
            case 2: {
                System.out.print("Jenis minuman: ");
                String jenis = scanner.nextLine().trim();
                menu.tambahItem(new Minuman(nama, harga, jenis));
                System.out.println("Minuman '" + nama + "' berhasil ditambahkan.");
                break;
            }
            case 3: {
                double persen = bacaDouble("Diskon (%)   : ");
                menu.tambahItem(new Diskon(nama, harga, persen));
                System.out.println("Item diskon '" + nama + "' berhasil ditambahkan.");
                break;
            }
            default:
                System.out.println("Tipe tidak valid.");
        }
    }

    private static void prosesOrderPelanggan() {
        if (menu.getItems().isEmpty()) {
            System.out.println("Menu masih kosong. Tambahkan item terlebih dahulu.");
            return;
        }
        System.out.print("\nNama pelanggan: ");
        String namaPelanggan = scanner.nextLine().trim();
        Pesanan pesanan = new Pesanan(namaPelanggan);

        menu.tampilkanMenu();

        boolean ordering = true;
        while (ordering) {
            int nomor = bacaInt("Masukkan nomor item yang dipesan (0 = selesai): ");
            if (nomor == 0) {
                ordering = false;
            } else {
                try {
                    MenuItem item = menu.getItem(nomor - 1);
                    pesanan.tambahItem(item);
                    System.out.println("'" + item.getNama() + "' ditambahkan ke pesanan.");
                } catch (IndexOutOfBoundsException e) {
                    System.out.println("Error: " + e.getMessage());
                }
            }
        }

        if (pesanan.getItemDipesan().isEmpty()) {
            System.out.println("Tidak ada item dipesan.");
            return;
        }

        pesanan.tampilkanStruk();

        System.out.print("Simpan struk ke file? (y/n): ");
        String jawab = scanner.nextLine().trim();
        if (jawab.equalsIgnoreCase("y")) {
            try {
                FileManager.simpanStruk(pesanan.toStrukString());
            } catch (IOException e) {
                System.out.println("Gagal menyimpan struk: " + e.getMessage());
            }
        }
    }

    private static void lihatStrukTersimpan() {
        System.out.println("\n-- Struk Tersimpan --");
        try {
            FileManager.muatStruk();
        } catch (IOException e) {
            System.out.println("Gagal memuat struk: " + e.getMessage());
        }
    }

    private static void simpanMenuKeFile() {
        try {
            FileManager.simpanMenu(menu);
        } catch (IOException e) {
            System.out.println("Gagal menyimpan menu: " + e.getMessage());
        }
    }

    private static int bacaInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                int val = Integer.parseInt(scanner.nextLine().trim());
                return val;
            } catch (NumberFormatException e) {
                System.out.println("Input tidak valid, masukkan angka.");
            }
        }
    }

    private static double bacaDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                double val = Double.parseDouble(scanner.nextLine().trim());
                return val;
            } catch (NumberFormatException e) {
                System.out.println("Input tidak valid, masukkan angka desimal.");
            }
        }
    }
}
