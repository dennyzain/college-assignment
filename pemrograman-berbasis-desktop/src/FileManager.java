import java.io.*;

public class FileManager {
    private static final String MENU_FILE = "menu.txt";
    private static final String STRUK_FILE = "struk.txt";

    public static void simpanMenu(Menu menu) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter(MENU_FILE));
        for (MenuItem item : menu.getItems()) {
            writer.write(item.toFileString());
            writer.newLine();
        }
        writer.close();
        System.out.println("Menu berhasil disimpan ke " + MENU_FILE);
    }

    public static void muatMenu(Menu menu) throws IOException {
        File file = new File(MENU_FILE);
        if (!file.exists()) {
            System.out.println("File menu.txt belum ada. Menu kosong.");
            return;
        }
        BufferedReader reader = new BufferedReader(new FileReader(file));
        String line;
        int loaded = 0;
        while ((line = reader.readLine()) != null) {
            line = line.trim();
            if (line.isEmpty()) continue;
            String[] parts = line.split(",");
            try {
                switch (parts[0]) {
                    case "MAKANAN":
                        menu.tambahItem(new Makanan(parts[1], Double.parseDouble(parts[2]), parts[3]));
                        loaded++;
                        break;
                    case "MINUMAN":
                        menu.tambahItem(new Minuman(parts[1], Double.parseDouble(parts[2]), parts[3]));
                        loaded++;
                        break;
                    case "DISKON":
                        menu.tambahItem(new Diskon(parts[1], Double.parseDouble(parts[2]), Double.parseDouble(parts[3])));
                        loaded++;
                        break;
                    default:
                        System.out.println("Baris tidak dikenal dilewati: " + line);
                }
            } catch (ArrayIndexOutOfBoundsException | NumberFormatException e) {
                System.out.println("Format baris tidak valid, dilewati: " + line);
            }
        }
        reader.close();
        System.out.println(loaded + " item berhasil dimuat dari " + MENU_FILE);
    }

    public static void simpanStruk(String strukString) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter(STRUK_FILE, true));
        writer.write(strukString);
        writer.newLine();
        writer.close();
        System.out.println("Struk berhasil disimpan ke " + STRUK_FILE);
    }

    public static void muatStruk() throws IOException {
        File file = new File(STRUK_FILE);
        if (!file.exists()) {
            System.out.println("Belum ada struk tersimpan.");
            return;
        }
        BufferedReader reader = new BufferedReader(new FileReader(file));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        reader.close();
    }
}
