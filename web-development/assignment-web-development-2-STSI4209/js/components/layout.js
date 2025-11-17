/* Shared layout and presentational Vue components for SITTA pages */
(function (global) {
    const AppSidebar = {
        name: 'AppSidebar',
        props: {
            active: {
                type: String,
                default: ''
            }
        },
        emits: ['logout'],
        computed: {
            navigation() {
                return [
                    { key: 'dashboard', label: 'Dashboard', icon: '🏠', href: 'index.html' },
                    { key: 'stok', label: 'Informasi Bahan Ajar', icon: '📚', href: 'stok.html' },
                    { key: 'tracking', label: 'Tracking Pengiriman', icon: '📦', href: 'tracking.html' },
                    { key: 'laporan', label: 'Laporan', icon: '📊', href: '#', type: 'parent' },
                    { key: 'monitoring', label: 'Monitoring Progress DO', icon: '└', href: '#', type: 'child' },
                    { key: 'rekap', label: 'Rekap Bahan Ajar', icon: '└', href: '#', type: 'child' },
                    { key: 'histori', label: 'Histori Transaksi', icon: '📜', href: '#', type: 'parent' }
                ];
            }
        },
        template: `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h2>SITTA</h2>
                    <p>Universitas Terbuka</p>
                </div>

                <nav class="sidebar-nav">
                    <a
                        v-for="item in navigation"
                        :key="item.key"
                        :href="item.href"
                        :class="[
                            'nav-item',
                            { active: item.key === active },
                            item.type === 'child' ? 'submenu' : ''
                        ]">
                        <span class="icon">{{ item.icon }}</span>
                        <span>{{ item.label }}</span>
                    </a>
                </nav>

                <div class="sidebar-footer">
                    <button class="btn-logout" type="button" @click="$emit('logout')">
                        Logout
                    </button>
                </div>
            </aside>
        `
    };

    const UserInfo = {
        name: 'UserInfo',
        props: {
            user: {
                type: Object,
                default: () => null
            }
        },
        computed: {
            isGuest() {
                return !this.user;
            },
            roleLabel() {
                if (!this.user) {
                    return 'Tamu';
                }
                return [this.user.role, this.user.lokasi]
                    .filter(Boolean)
                    .join(' • ');
            }
        },
        template: `
            <div class="user-info">
                <div v-if="isGuest">
                    <strong>Pengguna Tamu</strong>
                    <div style="font-size: 0.85em; color: #888;">Belum login</div>
                </div>
                <div v-else>
                    <div><strong>{{ user.nama }}</strong></div>
                    <div style="font-size: 0.85em; color: #888;">{{ roleLabel }}</div>
                </div>
            </div>
        `
    };

    const StatsGrid = {
        name: 'StatsGrid',
        props: {
            cards: {
                type: Array,
                default: () => []
            }
        },
        template: `
            <section class="stats-grid" aria-label="Ringkasan statistik">
                <article
                    v-for="card in cards"
                    :key="card.id"
                    class="stat-card">
                    <div class="stat-icon">{{ card.icon }}</div>
                    <div class="stat-info">
                        <h3>{{ card.title }}</h3>
                        <p class="stat-number">{{ card.value }}</p>
                        <p v-if="card.subtitle" class="stat-subtitle">{{ card.subtitle }}</p>
                    </div>
                </article>
                <p v-if="cards.length === 0" class="caption">
                    Belum ada data statistik yang dapat ditampilkan.
                </p>
            </section>
        `
    };

    const QuickAccess = {
        name: 'QuickAccess',
        props: {
            items: {
                type: Array,
                default: () => []
            }
        },
        template: `
            <div class="quick-menu">
                <a
                    v-for="item in items"
                    :key="item.href"
                    class="quick-card"
                    :href="item.href">
                    <div class="quick-icon">{{ item.icon }}</div>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                </a>
                <p v-if="items.length === 0" class="caption">
                    Tidak ada menu cepat yang tersedia.
                </p>
            </div>
        `
    };

    const EmptyState = {
        name: 'EmptyState',
        props: {
            icon: {
                type: String,
                default: '📭'
            },
            title: {
                type: String,
                default: 'Data tidak ditemukan'
            },
            description: {
                type: String,
                default: 'Silakan sesuaikan filter atau tambahkan data baru.'
            }
        },
        template: `
            <div class="empty-state">
                <div class="empty-icon">{{ icon }}</div>
                <h3>{{ title }}</h3>
                <p>{{ description }}</p>
            </div>
        `
    };

    global.AppComponents = Object.freeze({
        AppSidebar,
        UserInfo,
        StatsGrid,
        QuickAccess,
        EmptyState
    });
})(window);

