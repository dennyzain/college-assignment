<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>SITTA</h2>
      <p>Universitas Terbuka</p>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in navigation"
        :key="item.key"
        :to="item.href"
        :class="[
          'nav-item',
          { active: item.key === active },
          item.type === 'child' ? 'submenu' : ''
        ]">
        <span class="icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" type="button" @click="handleLogout">
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  active: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['logout'])

const router = useRouter()

const navigation = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/dashboard' },
  { key: 'stok', label: 'Informasi Bahan Ajar', icon: '📚', href: '/stok' },
  { key: 'tracking', label: 'Tracking Pengiriman', icon: '📦', href: '/tracking' },
  { key: 'laporan', label: 'Laporan', icon: '📊', href: '#', type: 'parent' },
  { key: 'monitoring', label: 'Monitoring Progress DO', icon: '└', href: '#', type: 'child' },
  { key: 'rekap', label: 'Rekap Bahan Ajar', icon: '└', href: '#', type: 'child' },
  { key: 'histori', label: 'Histori Transaksi', icon: '📜', href: '#', type: 'parent' }
]

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
}
</script>

<style scoped>
/* Styles are in global style.css */
</style>

