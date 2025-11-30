<template>
  <div class="dashboard-layout" v-cloak>
    <AppSidebar
      :active="activePage"
      @logout="handleLogout">
    </AppSidebar>

    <main class="main-content">
      <header class="top-bar">
        <div class="greeting">{{ greetingMessage }}</div>
        <UserInfo :user="currentUser"></UserInfo>
      </header>

      <div class="content">
        <h1>Dashboard</h1>

        <StatsGrid :cards="statCards"></StatsGrid>

        <section class="quick-access">
          <h2>Akses Cepat</h2>
          <QuickAccess :items="quickAccessItems"></QuickAccess>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import UserInfo from '../components/UserInfo.vue'
import StatsGrid from '../components/StatsGrid.vue'
import QuickAccess from '../components/QuickAccess.vue'
import { dataBahanAjar, dataTracking } from '../data/data-source.js'

const router = useRouter()

const activePage = ref('dashboard')
const currentUser = ref(null)
const now = ref(new Date())
const bahanAjarList = ref([])
const trackingSummary = ref({ inTransit: 0, delivered: 0 })
const clockTimer = ref(null)

const quickAccessItems = [
  {
    href: '/stok',
    icon: '📚',
    title: 'Informasi Bahan Ajar',
    description: 'Lihat dan kelola stok bahan ajar.'
  },
  {
    href: '/tracking',
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

const greetingMessage = computed(() => {
  const hour = now.value.getHours()
  let label = 'Selamat Malam'
  let icon = '🌙'

  if (hour >= 5 && hour < 11) {
    label = 'Selamat Pagi'
    icon = '🌅'
  } else if (hour >= 11 && hour < 15) {
    label = 'Selamat Siang'
    icon = '☀️'
  } else if (hour >= 15 && hour < 19) {
    label = 'Selamat Sore'
    icon = '🌇'
  }

  const username = currentUser.value ? currentUser.value.nama : 'Pengguna'
  return `${icon} ${label}, ${username}`
})

const statCards = computed(() => {
  const totalBahanAjar = bahanAjarList.value.length
  const totalStok = bahanAjarList.value.reduce(
    (sum, item) => sum + Number(item.stok || 0),
    0
  )

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
      value: trackingSummary.value.inTransit.toLocaleString('id-ID')
    },
    {
      id: 'delivered',
      icon: '✅',
      title: 'Terkirim',
      value: trackingSummary.value.delivered.toLocaleString('id-ID')
    },
    {
      id: 'total-stock',
      icon: '📊',
      title: 'Total Stok',
      value: totalStok.toLocaleString('id-ID'),
      subtitle: 'Total stok dari seluruh bahan ajar'
    }
  ]
})

const loadUser = () => {
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
  } else {
    currentUser.value = {
      nama: 'Pengguna Tamu',
      role: 'Tamu',
      lokasi: 'Tidak diketahui'
    }
  }
}

const loadBahanAjar = () => {
  const stored = localStorage.getItem('bahanAjarList')
  if (stored) {
    try {
      bahanAjarList.value = JSON.parse(stored)
      return
    } catch (error) {
      console.error('Gagal membaca data bahan ajar dari localStorage:', error)
    }
  }
  bahanAjarList.value = Array.isArray(dataBahanAjar)
    ? dataBahanAjar.map(item => ({ ...item }))
    : []
}

const loadTrackingSummary = () => {
  const summary = {
    inTransit: 0,
    delivered: 0
  }

  if (dataTracking && typeof dataTracking === 'object') {
    Object.values(dataTracking).forEach(item => {
      if (item.status === 'Dikirim') {
        summary.delivered += 1
      } else if (item.status === 'Dalam Perjalanan') {
        summary.inTransit += 1
      }
    })
  }

  trackingSummary.value = summary
}

const startClock = () => {
  clockTimer.value = setInterval(() => {
    now.value = new Date()
  }, 60000)
}

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
}

onMounted(() => {
  loadUser()
  loadBahanAjar()
  loadTrackingSummary()
  startClock()
})

onBeforeUnmount(() => {
  if (clockTimer.value) {
    clearInterval(clockTimer.value)
  }
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

