<template>
  <div class="dashboard-layout" v-cloak>
    <AppSidebar
      :active="activePage"
      @logout="handleLogout">
    </AppSidebar>

    <main class="main-content">
      <header class="top-bar">
        <h2>Tracking Pengiriman</h2>
        <UserInfo :user="currentUser"></UserInfo>
      </header>

      <div class="content">
        <section class="tracking-search">
          <h2>Lacak Pengiriman Bahan Ajar</h2>
          <p class="search-hint">
            Masukkan nomor Delivery Order (DO) untuk melihat status terbaru pengiriman.
          </p>
          <div class="search-box">
            <input
              type="text"
              placeholder="Masukkan Nomor Delivery Order (DO)"
              v-model="nomorDO"
              @keyup.enter="searchTracking"
              aria-label="Nomor Delivery Order">
            <button
              type="button"
              class="btn-primary"
              @click="searchTracking"
              :disabled="loading">
              {{ loading ? 'Mencari...' : 'Cari' }}
            </button>
            <button
              v-if="nomorDO"
              type="button"
              class="btn-secondary"
              @click="clearSearch">
              Reset
            </button>
          </div>
          <p v-if="validationError" class="error-text">
            {{ validationError }}
          </p>

          <div
            v-if="recentHistory.length"
            class="search-history"
            aria-label="Riwayat pencarian">
            <span>Riwayat:</span>
            <button
              v-for="item in recentHistory"
              :key="item"
              type="button"
              class="history-chip"
              @click="selectHistory(item)">
              {{ item }}
            </button>
          </div>
        </section>

        <transition name="fade">
          <section
            v-if="hasResult"
            class="tracking-result">
            <div class="result-header">
              <h3>Informasi Pengiriman</h3>
              <span :class="statusBadgeClass">{{ statusMeta.label }}</span>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <label>Nomor DO:</label>
                <span>{{ trackingResult.nomorDO }}</span>
              </div>
              <div class="info-item">
                <label>Nama Penerima:</label>
                <span>{{ trackingResult.nama }}</span>
              </div>
              <div class="info-item">
                <label>Ekspedisi:</label>
                <span>{{ trackingResult.ekspedisi }}</span>
              </div>
              <div class="info-item">
                <label>Tanggal Kirim:</label>
                <span>{{ formatDate(trackingResult.tanggalKirim) }}</span>
              </div>
              <div class="info-item">
                <label>Paket:</label>
                <span>{{ trackingResult.paket }}</span>
              </div>
              <div class="info-item">
                <label>Total Pembayaran:</label>
                <span>{{ trackingResult.total }}</span>
              </div>
            </div>

            <div class="status-section">
              <h3>Status Pengiriman</h3>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: progressWidth }">
                </div>
              </div>
            </div>

            <div class="timeline-section">
              <h3>Riwayat Perjalanan</h3>
              <div class="timeline" v-if="timelineItems.length">
                <div
                  v-for="(item, index) in timelineItems"
                  :key="item.waktu + index"
                  class="timeline-item"
                  :class="{ active: index === 0 }">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-time">
                      {{ formatTimelineTime(item.waktu) }}
                    </div>
                    <div class="timeline-desc">
                      {{ item.keterangan }}
                    </div>
                  </div>
                </div>
              </div>
              <EmptyState
                v-else
                icon="🛤️"
                title="Belum ada riwayat"
                description="Timeline pengiriman akan muncul setelah data tersedia.">
              </EmptyState>
            </div>
          </section>
        </transition>

        <transition name="fade">
          <section
            v-if="notFound && !loading"
            class="not-found">
            <div class="not-found-icon">🔍</div>
            <h3>Data Tidak Ditemukan</h3>
            <p>
              Nomor Delivery Order yang Anda masukkan tidak ditemukan dalam sistem.
              Periksa kembali nomor yang dimasukkan atau hubungi admin.
            </p>
            <ul class="helper-list">
              <li>Pastikan nomor DO terdiri dari angka saja.</li>
              <li>Coba masukkan nomor lain dari riwayat pencarian.</li>
            </ul>
          </section>
        </transition>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import UserInfo from '../components/UserInfo.vue'
import EmptyState from '../components/EmptyState.vue'
import { dataTracking } from '../data/data-source.js'

const router = useRouter()

const activePage = ref('tracking')
const currentUser = ref(null)
const nomorDO = ref('')
const trackingResult = ref(null)
const statusMeta = ref({
  badgeClass: 'status-pending',
  label: 'Belum Diproses',
  progress: 10
})
const notFound = ref(false)
const validationError = ref('')
const searchHistory = ref([])
const loading = ref(false)

const hasResult = computed(() => Boolean(trackingResult.value))

const timelineItems = computed(() => {
  if (!trackingResult.value) {
    return []
  }
  return trackingResult.value.perjalanan || []
})

const statusBadgeClass = computed(() => {
  return ['status-badge', statusMeta.value.badgeClass].join(' ')
})

const progressWidth = computed(() => {
  return `${statusMeta.value.progress}%`
})

const recentHistory = computed(() => {
  return searchHistory.value.slice(0, 5)
})

watch(nomorDO, (value) => {
  if (typeof value === 'string') {
    const sanitized = value.replace(/\D/g, '')
    if (sanitized !== value) {
      nomorDO.value = sanitized
      return
    }
  }
  if (validationError.value) {
    validationError.value = ''
  }
})

watch(trackingResult, (newValue) => {
  if (newValue) {
    statusMeta.value = mapStatus(newValue.status)
    notFound.value = false
    pushHistory(newValue.nomorDO)
  }
})

watch(searchHistory, (history) => {
  localStorage.setItem('trackingHistory', JSON.stringify(history))
}, { deep: true })

const loadUser = () => {
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
  } else {
    currentUser.value = {
      nama: 'Pengguna Tamu',
      role: 'Tamu',
      lokasi: ''
    }
  }
}

const loadHistory = () => {
  const stored = localStorage.getItem('trackingHistory')
  if (stored) {
    try {
      searchHistory.value = JSON.parse(stored)
    } catch (error) {
      console.error('Gagal membaca riwayat tracking:', error)
    }
  }
}

const pushHistory = (nomor) => {
  if (!nomor) return
  searchHistory.value = [
    nomor,
    ...searchHistory.value.filter(item => item !== nomor)
  ]
}

const searchTracking = () => {
  validationError.value = ''
  notFound.value = false
  trackingResult.value = null

  if (!nomorDO.value) {
    validationError.value = 'Nomor DO wajib diisi.'
    return
  }

  loading.value = true
  setTimeout(() => {
    const result = getTrackingByNumber(nomorDO.value)
    if (result) {
      trackingResult.value = {
        ...result,
        perjalanan: Array.isArray(result.perjalanan)
          ? result.perjalanan
          : []
      }
    } else {
      notFound.value = true
    }
    loading.value = false
  }, 350)
}

const getTrackingByNumber = (nomor) => {
  if (!dataTracking || typeof dataTracking !== 'object') {
    return null
  }
  return dataTracking[nomor] || null
}

const mapStatus = (status) => {
  switch (status) {
    case 'Dikirim':
      return {
        badgeClass: 'status-delivered',
        label: 'Dikirim',
        progress: 100
      }
    case 'Dalam Perjalanan':
      return {
        badgeClass: 'status-in-transit',
        label: 'Dalam Perjalanan',
        progress: 65
      }
    case 'Diproses':
      return {
        badgeClass: 'status-processing',
        label: 'Diproses',
        progress: 35
      }
    default:
      return {
        badgeClass: 'status-pending',
        label: status || 'Belum Diproses',
        progress: 10
      }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTimelineTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectHistory = (nomor) => {
  nomorDO.value = nomor
  searchTracking()
}

const clearSearch = () => {
  nomorDO.value = ''
  trackingResult.value = null
  notFound.value = false
  validationError.value = ''
}

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
}

onMounted(() => {
  loadUser()
  loadHistory()
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

