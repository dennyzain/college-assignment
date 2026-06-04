import java.util.ArrayList;

public class Menu {
    private ArrayList<MenuItem> items;

    public Menu() {
        this.items = new ArrayList<>();
    }

    public void tambahItem(MenuItem item) {
        items.add(item);
    }

    public MenuItem getItem(int index) {
        if (index < 0 || index >= items.size()) {
            throw new IndexOutOfBoundsException(
                "Item dengan indeks " + index + " tidak ditemukan dalam menu.");
        }
        return items.get(index);
    }

    public MenuItem cariItem(String nama) {
        for (MenuItem item : items) {
            if (item.getNama().equalsIgnoreCase(nama)) {
                return item;
            }
        }
        throw new IllegalArgumentException("Item '" + nama + "' tidak ditemukan dalam menu.");
    }

    public ArrayList<MenuItem> getItems() {
        return items;
    }

    public void tampilkanMenu() {
        if (items.isEmpty()) {
            System.out.println("  (Menu kosong)");
            return;
        }
        System.out.println("=".repeat(75));
        System.out.println("                         MENU RESTORAN");
        System.out.println("=".repeat(75));
        int nomor = 1;
        for (MenuItem item : items) {
            System.out.print("  " + nomor + ". ");
            item.tampilMenu();
            nomor++;
        }
        System.out.println("=".repeat(75));
    }
}
