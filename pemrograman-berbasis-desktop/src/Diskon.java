public class Diskon extends MenuItem {
    private double diskon; // percentage 0-100

    public Diskon(String nama, double harga, double diskon) {
        super(nama, harga, "Diskon");
        this.diskon = diskon;
    }

    public double getDiskon() { return diskon; }
    public void setDiskon(double diskon) { this.diskon = diskon; }

    public double getHargaSetelahDiskon() {
        return getHarga() * (1 - diskon / 100.0);
    }

    @Override
    public void tampilMenu() {
        System.out.printf("  [Diskon]  %-25s | Diskon: %5.1f%% | Harga Asli: Rp %.2f | Harga Diskon: Rp %.2f%n",
                getNama(), diskon, getHarga(), getHargaSetelahDiskon());
    }

    @Override
    public String toFileString() {
        return "DISKON," + getNama() + "," + getHarga() + "," + diskon;
    }
}
