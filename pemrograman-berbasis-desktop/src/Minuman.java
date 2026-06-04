public class Minuman extends MenuItem {
    private String jenisMinuman;

    public Minuman(String nama, double harga, String jenisMinuman) {
        super(nama, harga, "Minuman");
        this.jenisMinuman = jenisMinuman;
    }

    public String getJenisMinuman() { return jenisMinuman; }
    public void setJenisMinuman(String jenisMinuman) { this.jenisMinuman = jenisMinuman; }

    @Override
    public void tampilMenu() {
        System.out.printf("  [Minuman] %-25s | Jenis: %-15s | Rp %.2f%n",
                getNama(), jenisMinuman, getHarga());
    }

    @Override
    public String toFileString() {
        return "MINUMAN," + getNama() + "," + getHarga() + "," + jenisMinuman;
    }
}
