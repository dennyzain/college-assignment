import java.util.Scanner;

public class assignment3 {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        // Array gaji berdasarkan golongan A, B, C
        int[] gaji = {5000000, 6500000, 9500000};

        // Array persen lembur
        // Index: 0 = 30%, 1 = 32%, 2 = 34%, 3 = 36%, 4 = 38%
        double[] persenLembur = {0.30, 0.32, 0.34, 0.36, 0.38};

        String golongan;
        int jam;
        int indexGolongan = 0;  
        double gajiPokok, gajiLembur, total;

        System.out.print("Masukkan Golongan (A/B/C): ");
        golongan = input.nextLine();

        System.out.print("Masukkan Jam Lembur: ");
        jam = input.nextInt();

        // Menentukan index golongan berdasarkan input
        if (golongan.equalsIgnoreCase("A")) {
            indexGolongan = 0;
        } else if (golongan.equalsIgnoreCase("B")) {
            indexGolongan = 1;
        } else if (golongan.equalsIgnoreCase("C")) {
            indexGolongan = 2;
        } else {
            System.out.println("Golongan tidak valid!");
            return;
        }

        // Mengambil gaji pokok dari array
        gajiPokok = gaji[indexGolongan];

        // Menentukan index lembur berdasarkan jam lembur
        int indexLembur;
        if (jam == 1) {
            indexLembur = 0;
        } else if (jam == 2) {
            indexLembur = 1;
        } else if (jam == 3) {
            indexLembur = 2;
        } else if (jam == 4) {
            indexLembur = 3;
        } else { 
            // jam >= 5
            indexLembur = 4;
        }

        // Hitung gaji lembur
        gajiLembur = gajiPokok * persenLembur[indexLembur];

        // Hitung total penghasilan
        total = gajiPokok + gajiLembur;

        // OUTPUT
        System.out.println("====================================");
        System.out.println("Golongan           : " + golongan.toUpperCase());
        System.out.println("Gaji Pokok         : Rp " + gajiPokok);
        System.out.println("Gaji Lembur        : Rp " + gajiLembur);
        System.out.println("TOTAL PENGHASILAN  : Rp " + total);
    }
}