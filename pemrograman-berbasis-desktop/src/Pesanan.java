import java.util.ArrayList;

public class Pesanan {
    private String namaPelanggan;
    private ArrayList<MenuItem> itemDipesan;

    public Pesanan(String namaPelanggan) {
        this.namaPelanggan = namaPelanggan;
        this.itemDipesan = new ArrayList<>();
    }

    public void tambahItem(MenuItem item) {
        itemDipesan.add(item);
    }

    public ArrayList<MenuItem> getItemDipesan() {
        return itemDipesan;
    }

    public String getNamaPelanggan() {
        return namaPelanggan;
    }

    public double hitungTotal() {
        double total = 0;
        for (MenuItem item : itemDipesan) {
            if (item instanceof Diskon) {
                total += ((Diskon) item).getHargaSetelahDiskon();
            } else {
                total += item.getHarga();
            }
        }
        return total;
    }

    public void tampilkanStruk() {
        System.out.println("=".repeat(55));
        System.out.println("              STRUK PESANAN");
        System.out.println("=".repeat(55));
        System.out.println("Pelanggan : " + namaPelanggan);
        System.out.println("-".repeat(55));
        for (MenuItem item : itemDipesan) {
            if (item instanceof Diskon) {
                Diskon d = (Diskon) item;
                System.out.printf("  %-28s  Rp %10.2f%n",
                        item.getNama() + " (diskon " + d.getDiskon() + "%)", d.getHargaSetelahDiskon());
            } else {
                System.out.printf("  %-28s  Rp %10.2f%n", item.getNama(), item.getHarga());
            }
        }
        System.out.println("-".repeat(55));
        System.out.printf("  %-28s  Rp %10.2f%n", "TOTAL", hitungTotal());
        System.out.println("=".repeat(55));
        System.out.println("       Terima kasih telah berkunjung!");
        System.out.println("=".repeat(55));
    }

    public String toStrukString() {
        StringBuilder sb = new StringBuilder();
        sb.append("=".repeat(55)).append("\n");
        sb.append("              STRUK PESANAN\n");
        sb.append("=".repeat(55)).append("\n");
        sb.append("Pelanggan : ").append(namaPelanggan).append("\n");
        sb.append("-".repeat(55)).append("\n");
        for (MenuItem item : itemDipesan) {
            if (item instanceof Diskon) {
                Diskon d = (Diskon) item;
                sb.append(String.format("  %-28s  Rp %10.2f%n",
                        item.getNama() + " (diskon " + d.getDiskon() + "%)", d.getHargaSetelahDiskon()));
            } else {
                sb.append(String.format("  %-28s  Rp %10.2f%n", item.getNama(), item.getHarga()));
            }
        }
        sb.append("-".repeat(55)).append("\n");
        sb.append(String.format("  %-28s  Rp %10.2f%n", "TOTAL", hitungTotal()));
        sb.append("=".repeat(55)).append("\n");
        sb.append("       Terima kasih telah berkunjung!\n");
        sb.append("=".repeat(55)).append("\n");
        return sb.toString();
    }
}
