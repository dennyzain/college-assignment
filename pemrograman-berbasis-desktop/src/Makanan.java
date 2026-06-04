public class Makanan extends MenuItem {
    private String jenisMakanan;

    public Makanan(String nama, double harga, String jenisMakanan) {
        super(nama, harga, "Makanan");
        this.jenisMakanan = jenisMakanan;
    }

    public String getJenisMakanan() { return jenisMakanan; }
    public void setJenisMakanan(String jenisMakanan) { this.jenisMakanan = jenisMakanan; }

    @Override
    public void tampilMenu() {
        System.out.printf("  [Makanan] %-25s | Jenis: %-15s | Rp %.2f%n",
                getNama(), jenisMakanan, getHarga());
    }

    @Override
    public String toFileString() {
        return "MAKANAN," + getNama() + "," + getHarga() + "," + jenisMakanan;
    }
}
