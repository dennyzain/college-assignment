const { createApp } = Vue;
const {
    AppSidebar,
    UserInfo,
    EmptyState
} = AppComponents;

createApp({
    name: 'TrackingApp',
    components: {
        AppSidebar,
        UserInfo,
        EmptyState
    },
    data() {
        return {
            activePage: 'tracking',
            currentUser: null,
            nomorDO: '',
            trackingResult: null,
            statusMeta: {
                badgeClass: 'status-pending',
                label: 'Belum Diproses',
                progress: 10
            },
            notFound: false,
            validationError: '',
            searchHistory: [],
            loading: false,
            placeholderTimeline: [
                'Menunggu pemrosesan pengiriman.',
                'Pastikan nomor DO sudah benar.'
            ]
        };
    },
    computed: {
        hasResult() {
            return Boolean(this.trackingResult);
        },
        timelineItems() {
            if (!this.trackingResult) {
                return [];
            }
            return this.trackingResult.perjalanan || [];
        },
        statusBadgeClass() {
            return ['status-badge', this.statusMeta.badgeClass].join(' ');
        },
        progressWidth() {
            return `${this.statusMeta.progress}%`;
        },
        recentHistory() {
            return this.searchHistory.slice(0, 5);
        }
    },
    watch: {
        nomorDO(value) {
            if (typeof value === 'string') {
                const sanitized = value.replace(/\D/g, '');
                if (sanitized !== value) {
                    this.nomorDO = sanitized;
                    return;
                }
            }
            if (this.validationError) {
                this.validationError = '';
            }
        },
        trackingResult(newValue) {
            if (newValue) {
                this.statusMeta = this.mapStatus(newValue.status);
                this.notFound = false;
                this.pushHistory(newValue.nomorDO);
            }
        },
        searchHistory: {
            deep: true,
            handler(history) {
                localStorage.setItem('trackingHistory', JSON.stringify(history));
            }
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
                    lokasi: ''
                };
            }
        },
        loadHistory() {
            const stored = localStorage.getItem('trackingHistory');
            if (stored) {
                try {
                    this.searchHistory = JSON.parse(stored);
                } catch (error) {
                    console.error('Gagal membaca riwayat tracking:', error);
                }
            }
        },
        pushHistory(nomor) {
            if (!nomor) return;
            this.searchHistory = [
                nomor,
                ...this.searchHistory.filter(item => item !== nomor)
            ];
        },
        searchTracking() {
            this.validationError = '';
            this.notFound = false;
            this.trackingResult = null;

            if (!this.nomorDO) {
                this.validationError = 'Nomor DO wajib diisi.';
                return;
            }

            this.loading = true;
            setTimeout(() => {
                const result = this.getTrackingByNumber(this.nomorDO);
                if (result) {
                    this.trackingResult = {
                        ...result,
                        perjalanan: Array.isArray(result.perjalanan)
                            ? result.perjalanan
                            : []
                    };
                } else {
                    this.notFound = true;
                }
                this.loading = false;
            }, 350);
        },
        getTrackingByNumber(nomor) {
            if (!dataTracking || typeof dataTracking !== 'object') {
                return null;
            }
            return dataTracking[nomor] || null;
        },
        mapStatus(status) {
            switch (status) {
                case 'Dikirim':
                    return {
                        badgeClass: 'status-delivered',
                        label: 'Dikirim',
                        progress: 100
                    };
                case 'Dalam Perjalanan':
                    return {
                        badgeClass: 'status-in-transit',
                        label: 'Dalam Perjalanan',
                        progress: 65
                    };
                case 'Diproses':
                    return {
                        badgeClass: 'status-processing',
                        label: 'Diproses',
                        progress: 35
                    };
                default:
                    return {
                        badgeClass: 'status-pending',
                        label: status || 'Belum Diproses',
                        progress: 10
                    };
            }
        },
        formatDate(dateString) {
            if (!dateString) return '-';
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        },
        formatTimelineTime(dateString) {
            if (!dateString) return '-';
            return new Date(dateString).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        selectHistory(nomor) {
            this.nomorDO = nomor;
            this.searchTracking();
        },
        clearSearch() {
            this.nomorDO = '';
            this.trackingResult = null;
            this.notFound = false;
            this.validationError = '';
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
        this.loadHistory();
    }
}).mount('#trackingApp');

