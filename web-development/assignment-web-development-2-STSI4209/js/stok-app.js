const { createApp } = Vue;
const {
    AppSidebar,
    UserInfo,
    EmptyState
} = AppComponents;

const createEmptyForm = () => ({
    kodeLokasi: '',
    kodeBarang: '',
    namaBarang: '',
    jenisBarang: 'BMP',
    edisi: '',
    stok: '',
    cover: ''
});

createApp({
    name: 'StokApp',
    components: {
        AppSidebar,
        UserInfo,
        EmptyState
    },
    data() {
        return {
            activePage: 'stok',
            currentUser: null,
            bahanAjarList: [],
            showForm: false,
            editingIndex: null,
            form: createEmptyForm(),
            errors: {},
            searchTerm: '',
            filterJenis: 'Semua',
            onlyLowStock: false,
            jenisBarangOptions: ['BMP', 'Modul', 'Buku'],
            placeholderCover: 'https://via.placeholder.com/60x85?text=Cover',
            stockThreshold: 200,
            successMessage: '',
            infoMessageTimeout: null
        };
    },
    computed: {
        normalizedList() {
            return this.bahanAjarList.map(item => ({
                ...item,
                coverUrl: item.cover && item.cover.startsWith('http')
                    ? item.cover
                    : `${item.cover || this.buildCover(item.namaBarang)}`
            }));
        },
        filteredBahanAjar() {
            const term = this.searchTerm.trim().toLowerCase();
            return this.normalizedList.filter(item => {
                const matchesTerm = !term || [
                    item.kodeLokasi,
                    item.kodeBarang,
                    item.namaBarang,
                    item.jenisBarang
                ].some(value => value.toLowerCase().includes(term));

                const matchesJenis = this.filterJenis === 'Semua'
                    ? true
                    : item.jenisBarang === this.filterJenis;

                const matchesStock = this.onlyLowStock
                    ? Number(item.stok) < this.stockThreshold
                    : true;

                return matchesTerm && matchesJenis && matchesStock;
            });
        },
        totalData() {
            return this.filteredBahanAjar.length;
        },
        totalStokKeseluruhan() {
            return this.bahanAjarList.reduce((sum, item) => sum + Number(item.stok || 0), 0);
        },
        totalStokTerfilter() {
            return this.filteredBahanAjar.reduce((sum, item) => sum + Number(item.stok || 0), 0);
        },
        formTitle() {
            return this.editingIndex === null
                ? 'Tambah Bahan Ajar Baru'
                : 'Perbarui Data Bahan Ajar';
        },
        submitButtonLabel() {
            return this.editingIndex === null ? 'Simpan' : 'Update';
        },
        emptyStateDescription() {
            return 'Tidak ada data yang cocok dengan filter saat ini. Coba ubah kata kunci atau jenis.';
        }
    },
    watch: {
        'form.kodeLokasi'(value) {
            if (typeof value === 'string') {
                const formatted = value.replace(/\s+/g, '').toUpperCase();
                if (formatted !== value) {
                    this.form.kodeLokasi = formatted;
                }
            }
            if (this.errors.kodeLokasi) {
                this.validateField('kodeLokasi');
            }
        },
        'form.kodeBarang'(value) {
            if (typeof value === 'string') {
                const formatted = value.replace(/\s+/g, '').toUpperCase();
                if (formatted !== value) {
                    this.form.kodeBarang = formatted;
                }
            }
            if (this.errors.kodeBarang) {
                this.validateField('kodeBarang');
            }
        },
        bahanAjarList: {
            deep: true,
            handler(newValue) {
                localStorage.setItem('bahanAjarList', JSON.stringify(newValue));
            }
        }
    },
    methods: {
        getEmptyForm() {
            return createEmptyForm();
        },
        loadUser() {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            } else {
                this.currentUser = {
                    nama: 'Pengguna Tamu',
                    role: 'Tamu',
                    lokasi: ''
                };
            }
        },
        loadData() {
            const stored = localStorage.getItem('bahanAjarList');
            if (stored) {
                try {
                    this.bahanAjarList = JSON.parse(stored);
                    return;
                } catch (error) {
                    console.error('Gagal membaca data bahan ajar dari localStorage:', error);
                }
            }

            if (Array.isArray(dataBahanAjar)) {
                this.bahanAjarList = dataBahanAjar.map(item => ({
                    ...item
                }));
            }
        },
        toggleForm() {
            this.showForm = !this.showForm;
            if (!this.showForm) {
                this.resetForm();
            }
        },
        startCreate() {
            this.resetForm();
            this.showForm = true;
        },
        editItem(kodeBarang) {
            const index = this.bahanAjarList.findIndex(item => item.kodeBarang === kodeBarang);
            if (index === -1) return;

            this.editingIndex = index;
            this.form = { ...this.bahanAjarList[index] };
            this.showForm = true;
            this.errors = {};
        },
        deleteItem(kodeBarang) {
            const index = this.bahanAjarList.findIndex(item => item.kodeBarang === kodeBarang);
            if (index === -1) return;

            const item = this.bahanAjarList[index];
            if (confirm(`Apakah Anda yakin ingin menghapus "${item.namaBarang}"?`)) {
                this.bahanAjarList.splice(index, 1);
                this.showInfoMessage('Data berhasil dihapus.');
            }
        },
        validateField(field) {
            const value = this.form[field];
            switch (field) {
                case 'kodeLokasi':
                    if (!value) {
                        this.errors[field] = 'Kode lokasi wajib diisi.';
                    } else if (!/^[0-9A-Z]{5,}$/.test(value)) {
                        this.errors[field] = 'Gunakan huruf kapital tanpa spasi, minimal 5 karakter.';
                    } else {
                        delete this.errors[field];
                    }
                    break;
                case 'kodeBarang':
                    if (!value) {
                        this.errors[field] = 'Kode barang wajib diisi.';
                    } else if (!/^[0-9A-Z]{5,}$/.test(value)) {
                        this.errors[field] = 'Gunakan huruf kapital tanpa spasi, minimal 5 karakter.';
                    } else if (this.isDuplicateKodeBarang(value)) {
                        this.errors[field] = 'Kode barang sudah terdaftar.';
                    } else {
                        delete this.errors[field];
                    }
                    break;
                case 'namaBarang':
                    if (!value || value.trim().length < 3) {
                        this.errors[field] = 'Nama barang minimal 3 karakter.';
                    } else {
                        delete this.errors[field];
                    }
                    break;
                case 'edisi':
                    if (!value) {
                        this.errors[field] = 'Edisi wajib diisi.';
                    } else if (Number(value) <= 0) {
                        this.errors[field] = 'Edisi harus lebih dari 0.';
                    } else {
                        delete this.errors[field];
                    }
                    break;
                case 'stok':
                    if (value === '') {
                        this.errors[field] = 'Stok wajib diisi.';
                    } else if (Number(value) < 0) {
                        this.errors[field] = 'Stok tidak boleh bernilai negatif.';
                    } else {
                        delete this.errors[field];
                    }
                    break;
                default:
                    break;
            }
        },
        validateForm() {
            const fields = ['kodeLokasi', 'kodeBarang', 'namaBarang', 'jenisBarang', 'edisi', 'stok'];
            fields.forEach(this.validateField);
            return Object.keys(this.errors).length === 0;
        },
        isDuplicateKodeBarang(kodeBarang) {
            return this.bahanAjarList.some((item, index) => {
                if (this.editingIndex !== null && index === this.editingIndex) {
                    return false;
                }
                return item.kodeBarang === kodeBarang;
            });
        },
        submitForm() {
            if (!this.validateForm()) {
                this.showInfoMessage('Periksa kembali input Anda.', true);
                return;
            }

            const payload = {
                ...this.form,
                stok: Number(this.form.stok),
                edisi: String(this.form.edisi),
                cover: this.form.cover || this.buildCover(this.form.namaBarang)
            };

            if (this.editingIndex === null) {
                this.bahanAjarList.push(payload);
                this.showInfoMessage('Data bahan ajar berhasil ditambahkan.');
            } else {
                this.bahanAjarList.splice(this.editingIndex, 1, payload);
                this.showInfoMessage('Data bahan ajar berhasil diperbarui.');
            }

            this.resetForm();
            this.showForm = false;
        },
        resetForm() {
            this.form = createEmptyForm();
            this.errors = {};
            this.editingIndex = null;
            if (this.infoMessageTimeout) {
                clearTimeout(this.infoMessageTimeout);
                this.infoMessageTimeout = null;
            }
        },
        showInfoMessage(message, isError = false) {
            this.successMessage = message;
            const banner = document.getElementById('infoBanner');
            if (banner) {
                banner.classList.toggle('error', isError);
            }
            if (this.infoMessageTimeout) {
                clearTimeout(this.infoMessageTimeout);
            }
            this.infoMessageTimeout = setTimeout(() => {
                this.successMessage = '';
            }, 3500);
        },
        buildCover(namaBarang) {
            return `https://via.placeholder.com/300x400?text=${encodeURIComponent(namaBarang)}`;
        },
        handleCoverError(event) {
            event.target.src = this.placeholderCover;
        },
        formatNumber(value) {
            return Number(value || 0).toLocaleString('id-ID');
        },
        handleLogout() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        }
    },
    mounted() {
        this.loadUser();
        this.loadData();
    }
}).mount('#stokApp');

