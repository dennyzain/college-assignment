const { createApp } = Vue;
const {
    AppSidebar,
    UserInfo,
    StatsGrid,
    QuickAccess
} = AppComponents;

createApp({
    name: 'DashboardApp',
    components: {
        AppSidebar,
        UserInfo,
        StatsGrid,
        QuickAccess
    },
    data() {
        return {
            activePage: 'dashboard',
            currentUser: null,
            now: new Date(),
            bahanAjarList: [],
            trackingSummary: { inTransit: 0, delivered: 0 },
            clockTimer: null,
            quickAccessItems: [
                {
                    href: 'stok.html',
                    icon: '📚',
                    title: 'Informasi Bahan Ajar',
                    description: 'Lihat dan kelola stok bahan ajar.'
                },
                {
                    href: 'tracking.html',
                    icon: '📦',
                    title: 'Tracking Pengiriman',
                    description: 'Lacak status pengiriman bahan ajar.'
                },
                {
                    href: '#',
                    icon: '📊',
                    title: 'Laporan',
                    description: 'Monitoring dan rekap data secara berkala.'
                },
                {
                    href: '#',
                    icon: '📜',
                    title: 'Histori Transaksi',
                    description: 'Riwayat transaksi bahan ajar.'
                }
            ]
        };
    },
    computed: {
        greetingMessage() {
            const hour = this.now.getHours();
            let label = 'Selamat Malam';
            let icon = '🌙';

            if (hour >= 5 && hour < 11) {
                label = 'Selamat Pagi';
                icon = '🌅';
            } else if (hour >= 11 && hour < 15) {
                label = 'Selamat Siang';
                icon = '☀️';
            } else if (hour >= 15 && hour < 19) {
                label = 'Selamat Sore';
                icon = '🌇';
            }

            const username = this.currentUser ? this.currentUser.nama : 'Pengguna';
            return `${icon} ${label}, ${username}`;
        },
        statCards() {
            const totalBahanAjar = this.bahanAjarList.length;
            const totalStok = this.bahanAjarList.reduce((sum, item) => sum + Number(item.stok || 0), 0);

            return [
                {
                    id: 'total-bahan-ajar',
                    icon: '📚',
                    title: 'Total Bahan Ajar',
                    value: totalBahanAjar.toLocaleString('id-ID')
                },
                {
                    id: 'in-transit',
                    icon: '📦',
                    title: 'Dalam Pengiriman',
                    value: this.trackingSummary.inTransit.toLocaleString('id-ID')
                },
                {
                    id: 'delivered',
                    icon: '✅',
                    title: 'Terkirim',
                    value: this.trackingSummary.delivered.toLocaleString('id-ID')
                },
                {
                    id: 'total-stock',
                    icon: '📊',
                    title: 'Total Stok',
                    value: totalStok.toLocaleString('id-ID'),
                    subtitle: 'Total stok dari seluruh bahan ajar'
                }
            ];
        }
    },
    methods: {
        loadUser() {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            } else {
                this.currentUser = {
                    nama: 'Pengguna Tamu',
                    role: 'Tamu',
                    lokasi: 'Tidak diketahui'
                };
            }
        },
        loadBahanAjar() {
            const stored = localStorage.getItem('bahanAjarList');
            if (stored) {
                try {
                    this.bahanAjarList = JSON.parse(stored);
                    return;
                } catch (error) {
                    console.error('Gagal membaca data bahan ajar dari localStorage:', error);
                }
            }
            this.bahanAjarList = Array.isArray(dataBahanAjar)
                ? dataBahanAjar.map(item => ({ ...item }))
                : [];
        },
        loadTrackingSummary() {
            const summary = {
                inTransit: 0,
                delivered: 0
            };

            if (dataTracking && typeof dataTracking === 'object') {
                Object.values(dataTracking).forEach(item => {
                    if (item.status === 'Dikirim') {
                        summary.delivered += 1;
                    } else if (item.status === 'Dalam Perjalanan') {
                        summary.inTransit += 1;
                    }
                });
            }

            this.trackingSummary = summary;
        },
        startClock() {
            this.clockTimer = setInterval(() => {
                this.now = new Date();
            }, 60000);
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
        this.loadBahanAjar();
        this.loadTrackingSummary();
        this.startClock();
    },
    beforeUnmount() {
        if (this.clockTimer) {
            clearInterval(this.clockTimer);
        }
    }
}).mount('#app');

