import java.util.Scanner;

public class assignment2 {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        String golongan;
        int jam;
        double gajiPokok = 0;
        double persenLembur = 0;
        double gajiLembur, total;

        System.out.print("Masukkan Golongan (A/B/C): ");
        golongan = input.nextLine();

        System.out.print("Masukkan Jam Lembur: ");
        jam = input.nextInt();

        if (golongan.equalsIgnoreCase("A")) {
            gajiPokok = 5000000;
        } else if (golongan.equalsIgnoreCase("B")) {
            gajiPokok = 6500000;
        } else if (golongan.equalsIgnoreCase("C")) {
            gajiPokok = 9500000;
        } else {
            System.out.println("Golongan tidak valid!");
            return;
        }

        if (jam == 1) {
            persenLembur = 0.30;
        } else if (jam == 2) {
            persenLembur = 0.32;
        } else if (jam == 3) {
            persenLembur = 0.34;
        } else if (jam == 4) {
            persenLembur = 0.36;
        } else if (jam >= 5) {
            persenLembur = 0.38;
        } else {
            persenLembur = 0;
        }

        gajiLembur = gajiPokok * persenLembur;

        total = gajiPokok + gajiLembur;

        System.out.println("==============================");
        System.out.println("Gaji Pokok        : Rp " + gajiPokok);
        System.out.println("Gaji Lembur       : Rp " + gajiLembur);
        System.out.println("TOTAL PENGHASILAN : Rp " + total);
    }
}
