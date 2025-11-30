// Import data from JSON file
import dataSource from './data-source.json'

// Export all data directly from JSON
export const dataPengguna = dataSource.dataPengguna
export const upbjjList = dataSource.upbjjList
export const kategoriList = dataSource.kategoriList
export const pengirimanList = dataSource.pengirimanList
export const paket = dataSource.paket
export const stok = dataSource.stok
export const tracking = dataSource.tracking

// Legacy exports for backward compatibility
// These map the new structure to the old structure used by existing components
export const dataBahanAjar = stok.map(item => ({
    kodeLokasi: item.upbjj,
    kodeBarang: item.kode,
    namaBarang: item.judul,
    jenisBarang: item.kategori,
    edisi: "",
    stok: item.qty,
    cover: ""
}))

// Convert tracking array to object format for easier lookup
export const dataTracking = tracking.reduce((acc, item) => {
    Object.keys(item).forEach(doNumber => {
        acc[doNumber] = {
            nomorDO: doNumber,
            ...item[doNumber]
        }
    })
    return acc
}, {})
