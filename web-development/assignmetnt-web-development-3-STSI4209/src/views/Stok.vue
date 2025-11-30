<template>
  <div class="dashboard-layout" v-cloak>
    <AppSidebar
      :active="activePage"
      @logout="handleLogout">
    </AppSidebar>

    <main class="main-content">
      <header class="top-bar">
        <h2>Informasi Stok Bahan Ajar</h2>
        <UserInfo :user="currentUser"></UserInfo>
      </header>

      <div class="content">
        <section class="table-actions">
          <div class="action-buttons">
            <button type="button" class="btn-primary" @click="startCreate">
              {{ showForm ? 'Tambah Data Baru' : '+ Tambah Bahan Ajar' }}
            </button>
            <button
              v-if="showForm"
              type="button"
              class="btn-secondary"
              @click="toggleForm">
              Tutup Form
            </button>
          </div>
          <div class="table-filters">
            <input
              type="search"
              placeholder="Cari nama, kode, atau lokasi..."
              v-model="searchTerm"
              aria-label="Cari bahan ajar">
            <select v-model="filterJenis" aria-label="Filter jenis bahan ajar">
              <option value="Semua">Semua Jenis</option>
              <option
                v-for="jenis in jenisBarangOptions"
                :key="jenis"
                :value="jenis">
                {{ jenis }}
              </option>
            </select>
            <label class="filter-checkbox">
              <input type="checkbox" v-model="onlyLowStock">
              <span>Stok &lt; {{ stockThreshold }}</span>
            </label>
          </div>
        </section>

        <transition name="fade">
          <section
            v-if="showForm"
            class="form-container"
            aria-label="Form tambah bahan ajar">
            <h3>{{ formTitle }}</h3>
            <p class="form-hint">
              Lengkapi data berikut dengan benar. Field bertanda * wajib diisi.
            </p>
            <form @submit.prevent="submitForm" novalidate>
              <div class="form-row">
                <div class="form-group" :class="{ 'has-error': errors.kodeLokasi }">
                  <label for="kodeLokasi">Kode Lokasi *</label>
                  <input
                    id="kodeLokasi"
                    type="text"
                    v-model="form.kodeLokasi"
                    @blur="validateField('kodeLokasi')"
                    placeholder="Contoh: 0JKT01">
                  <small v-if="errors.kodeLokasi" class="error-text">
                    {{ errors.kodeLokasi }}
                  </small>
                </div>
                <div class="form-group" :class="{ 'has-error': errors.kodeBarang }">
                  <label for="kodeBarang">Kode Barang *</label>
                  <input
                    id="kodeBarang"
                    type="text"
                    v-model="form.kodeBarang"
                    @blur="validateField('kodeBarang')"
                    placeholder="Contoh: EKMA4216">
                  <small v-if="errors.kodeBarang" class="error-text">
                    {{ errors.kodeBarang }}
                  </small>
                </div>
              </div>

              <div class="form-group" :class="{ 'has-error': errors.namaBarang }">
                <label for="namaBarang">Nama Bahan Ajar *</label>
                <input
                  id="namaBarang"
                  type="text"
                  v-model="form.namaBarang"
                  @blur="validateField('namaBarang')"
                  placeholder="Masukkan nama bahan ajar">
                <small v-if="errors.namaBarang" class="error-text">
                  {{ errors.namaBarang }}
                </small>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="jenisBarang">Jenis Barang *</label>
                  <select
                    id="jenisBarang"
                    v-model="form.jenisBarang">
                    <option
                      v-for="jenis in jenisBarangOptions"
                      :key="jenis"
                      :value="jenis">
                      {{ jenis }}
                    </option>
                  </select>
                </div>
                <div class="form-group" :class="{ 'has-error': errors.edisi }">
                  <label for="edisi">Edisi *</label>
                  <input
                    id="edisi"
                    type="number"
                    min="1"
                    v-model="form.edisi"
                    @blur="validateField('edisi')"
                    placeholder="Contoh: 1">
                  <small v-if="errors.edisi" class="error-text">
                    {{ errors.edisi }}
                  </small>
                </div>
                <div class="form-group" :class="{ 'has-error': errors.stok }">
                  <label for="stok">Stok *</label>
                  <input
                    id="stok"
                    type="number"
                    min="0"
                    v-model="form.stok"
                    @blur="validateField('stok')"
                    placeholder="Contoh: 200">
                  <small v-if="errors.stok" class="error-text">
                    {{ errors.stok }}
                  </small>
                </div>
              </div>

              <div class="form-group">
                <label for="cover">URL Cover (opsional)</label>
                <input
                  id="cover"
                  type="url"
                  v-model="form.cover"
                  placeholder="https://contoh.com/cover.jpg">
                <small class="form-hint">
                  Biarkan kosong untuk menggunakan cover otomatis.
                </small>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  {{ submitButtonLabel }}
                </button>
                <button type="button" class="btn-secondary" @click="resetForm">
                  Reset
                </button>
              </div>
            </form>
          </section>
        </transition>

        <div
          id="infoBanner"
          class="info-banner"
          role="status"
          v-show="successMessage">
          {{ successMessage }}
        </div>

        <section class="table-wrapper" aria-live="polite">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Cover</th>
                <th>Kode Lokasi</th>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Jenis</th>
                <th>Edisi</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody v-if="filteredBahanAjar.length > 0">
              <tr
                v-for="(item, index) in filteredBahanAjar"
                :key="item.kodeBarang">
                <td>{{ index + 1 }}</td>
                <td>
                  <img
                    :src="item.coverUrl"
                    :alt="`Cover ${item.namaBarang}`"
                    class="cover-thumb"
                    @error="handleCoverError">
                </td>
                <td>{{ item.kodeLokasi }}</td>
                <td>{{ item.kodeBarang }}</td>
                <td>
                  <strong>{{ item.namaBarang }}</strong>
                </td>
                <td>
                  <span class="badge">{{ item.jenisBarang }}</span>
                </td>
                <td>Edisi {{ item.edisi }}</td>
                <td>
                  <span
                    :class="[
                      'stok-badge',
                      { 'warning': Number(item.stok) < stockThreshold }
                    ]">
                    {{ formatNumber(item.stok) }}
                  </span>
                </td>
                <td class="action-cell">
                  <button
                    type="button"
                    class="btn-action btn-edit"
                    @click="editItem(item.kodeBarang)"
                    title="Edit data">
                    ✏️
                  </button>
                  <button
                    type="button"
                    class="btn-action btn-delete"
                    @click="deleteItem(item.kodeBarang)"
                    title="Hapus data">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else-if="bahanAjarList.length === 0">
              <tr>
                <td colspan="9">
                  <EmptyState
                    icon="📦"
                    title="Belum ada data bahan ajar"
                    description="Tambahkan data baru untuk mulai mengelola stok.">
                  </EmptyState>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="9">
                  <EmptyState
                    icon="🔍"
                    title="Data tidak ditemukan"
                    :description="emptyStateDescription">
                  </EmptyState>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer class="table-info">
          <p>
            Total Bahan Ajar Terlihat:
            <strong>{{ totalData }}</strong>
          </p>
          <p>
            Total Stok Terfilter:
            <strong>{{ formatNumber(totalStokTerfilter) }}</strong>
            <span v-if="totalStokTerfilter !== totalStokKeseluruhan">
              dari {{ formatNumber(totalStokKeseluruhan) }} stok keseluruhan.
            </span>
          </p>
        </footer>
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
import { dataBahanAjar } from '../data/data-source.js'

const router = useRouter()

const activePage = ref('stok')
const currentUser = ref(null)
const bahanAjarList = ref([])
const showForm = ref(false)
const editingIndex = ref(null)
const form = ref({
  kodeLokasi: '',
  kodeBarang: '',
  namaBarang: '',
  jenisBarang: 'BMP',
  edisi: '',
  stok: '',
  cover: ''
})
const errors = ref({})
const searchTerm = ref('')
const filterJenis = ref('Semua')
const onlyLowStock = ref(false)
const jenisBarangOptions = ref(['BMP', 'Modul', 'Buku'])
const placeholderCover = ref('https://via.placeholder.com/60x85?text=Cover')
const stockThreshold = ref(200)
const successMessage = ref('')
const infoMessageTimeout = ref(null)

const createEmptyForm = () => ({
  kodeLokasi: '',
  kodeBarang: '',
  namaBarang: '',
  jenisBarang: 'BMP',
  edisi: '',
  stok: '',
  cover: ''
})

const normalizedList = computed(() => {
  return bahanAjarList.value.map(item => ({
    ...item,
    coverUrl: item.cover && item.cover.startsWith('http')
      ? item.cover
      : `${item.cover || buildCover(item.namaBarang)}`
  }))
})

const filteredBahanAjar = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  return normalizedList.value.filter(item => {
    const matchesTerm = !term || [
      item.kodeLokasi,
      item.kodeBarang,
      item.namaBarang,
      item.jenisBarang
    ].some(value => value.toLowerCase().includes(term))

    const matchesJenis = filterJenis.value === 'Semua'
      ? true
      : item.jenisBarang === filterJenis.value

    const matchesStock = onlyLowStock.value
      ? Number(item.stok) < stockThreshold.value
      : true

    return matchesTerm && matchesJenis && matchesStock
  })
})

const totalData = computed(() => filteredBahanAjar.value.length)

const totalStokKeseluruhan = computed(() => {
  return bahanAjarList.value.reduce(
    (sum, item) => sum + Number(item.stok || 0),
    0
  )
})

const totalStokTerfilter = computed(() => {
  return filteredBahanAjar.value.reduce(
    (sum, item) => sum + Number(item.stok || 0),
    0
  )
})

const formTitle = computed(() => {
  return editingIndex.value === null
    ? 'Tambah Bahan Ajar Baru'
    : 'Perbarui Data Bahan Ajar'
})

const submitButtonLabel = computed(() => {
  return editingIndex.value === null ? 'Simpan' : 'Update'
})

const emptyStateDescription = computed(() => {
  return 'Tidak ada data yang cocok dengan filter saat ini. Coba ubah kata kunci atau jenis.'
})

watch(() => form.value.kodeLokasi, (value) => {
  if (typeof value === 'string') {
    const formatted = value.replace(/\s+/g, '').toUpperCase()
    if (formatted !== value) {
      form.value.kodeLokasi = formatted
    }
  }
  if (errors.value.kodeLokasi) {
    validateField('kodeLokasi')
  }
})

watch(() => form.value.kodeBarang, (value) => {
  if (typeof value === 'string') {
    const formatted = value.replace(/\s+/g, '').toUpperCase()
    if (formatted !== value) {
      form.value.kodeBarang = formatted
    }
  }
  if (errors.value.kodeBarang) {
    validateField('kodeBarang')
  }
})

watch(bahanAjarList, (newValue) => {
  localStorage.setItem('bahanAjarList', JSON.stringify(newValue))
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

const loadData = () => {
  const stored = localStorage.getItem('bahanAjarList')
  if (stored) {
    try {
      bahanAjarList.value = JSON.parse(stored)
      return
    } catch (error) {
      console.error('Gagal membaca data bahan ajar dari localStorage:', error)
    }
  }

  if (Array.isArray(dataBahanAjar)) {
    bahanAjarList.value = dataBahanAjar.map(item => ({
      ...item
    }))
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  }
}

const startCreate = () => {
  resetForm()
  showForm.value = true
}

const editItem = (kodeBarang) => {
  const index = bahanAjarList.value.findIndex(
    item => item.kodeBarang === kodeBarang
  )
  if (index === -1) return

  editingIndex.value = index
  form.value = { ...bahanAjarList.value[index] }
  showForm.value = true
  errors.value = {}
}

const deleteItem = (kodeBarang) => {
  const index = bahanAjarList.value.findIndex(
    item => item.kodeBarang === kodeBarang
  )
  if (index === -1) return

  const item = bahanAjarList.value[index]
  if (confirm(`Apakah Anda yakin ingin menghapus "${item.namaBarang}"?`)) {
    bahanAjarList.value.splice(index, 1)
    showInfoMessage('Data berhasil dihapus.')
  }
}

const validateField = (field) => {
  const value = form.value[field]
  switch (field) {
    case 'kodeLokasi':
      if (!value) {
        errors.value[field] = 'Kode lokasi wajib diisi.'
      } else if (!/^[0-9A-Z]{5,}$/.test(value)) {
        errors.value[field] = 'Gunakan huruf kapital tanpa spasi, minimal 5 karakter.'
      } else {
        delete errors.value[field]
      }
      break
    case 'kodeBarang':
      if (!value) {
        errors.value[field] = 'Kode barang wajib diisi.'
      } else if (!/^[0-9A-Z]{5,}$/.test(value)) {
        errors.value[field] = 'Gunakan huruf kapital tanpa spasi, minimal 5 karakter.'
      } else if (isDuplicateKodeBarang(value)) {
        errors.value[field] = 'Kode barang sudah terdaftar.'
      } else {
        delete errors.value[field]
      }
      break
    case 'namaBarang':
      if (!value || value.trim().length < 3) {
        errors.value[field] = 'Nama barang minimal 3 karakter.'
      } else {
        delete errors.value[field]
      }
      break
    case 'edisi':
      if (!value) {
        errors.value[field] = 'Edisi wajib diisi.'
      } else if (Number(value) <= 0) {
        errors.value[field] = 'Edisi harus lebih dari 0.'
      } else {
        delete errors.value[field]
      }
      break
    case 'stok':
      if (value === '') {
        errors.value[field] = 'Stok wajib diisi.'
      } else if (Number(value) < 0) {
        errors.value[field] = 'Stok tidak boleh bernilai negatif.'
      } else {
        delete errors.value[field]
      }
      break
    default:
      break
  }
}

const validateForm = () => {
  const fields = ['kodeLokasi', 'kodeBarang', 'namaBarang', 'jenisBarang', 'edisi', 'stok']
  fields.forEach(field => validateField(field))
  return Object.keys(errors.value).length === 0
}

const isDuplicateKodeBarang = (kodeBarang) => {
  return bahanAjarList.value.some((item, index) => {
    if (editingIndex.value !== null && index === editingIndex.value) {
      return false
    }
    return item.kodeBarang === kodeBarang
  })
}

const submitForm = () => {
  if (!validateForm()) {
    showInfoMessage('Periksa kembali input Anda.', true)
    return
  }

  const payload = {
    ...form.value,
    stok: Number(form.value.stok),
    edisi: String(form.value.edisi),
    cover: form.value.cover || buildCover(form.value.namaBarang)
  }

  if (editingIndex.value === null) {
    bahanAjarList.value.push(payload)
    showInfoMessage('Data bahan ajar berhasil ditambahkan.')
  } else {
    bahanAjarList.value.splice(editingIndex.value, 1, payload)
    showInfoMessage('Data bahan ajar berhasil diperbarui.')
  }

  resetForm()
  showForm.value = false
}

const resetForm = () => {
  form.value = createEmptyForm()
  errors.value = {}
  editingIndex.value = null
  if (infoMessageTimeout.value) {
    clearTimeout(infoMessageTimeout.value)
    infoMessageTimeout.value = null
  }
}

const showInfoMessage = (message, isError = false) => {
  successMessage.value = message
  const banner = document.getElementById('infoBanner')
  if (banner) {
    banner.classList.toggle('error', isError)
  }
  if (infoMessageTimeout.value) {
    clearTimeout(infoMessageTimeout.value)
  }
  infoMessageTimeout.value = setTimeout(() => {
    successMessage.value = ''
  }, 3500)
}

const buildCover = (namaBarang) => {
  console.log(namaBarang)
  return `https://via.placeholder.com/300x400?text=${encodeURIComponent(namaBarang)}`
}

const handleCoverError = (event) => {
  event.target.src = placeholderCover.value
}

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString('id-ID')
}

const handleLogout = () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }
}

onMounted(() => {
  loadUser()
  loadData()
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

