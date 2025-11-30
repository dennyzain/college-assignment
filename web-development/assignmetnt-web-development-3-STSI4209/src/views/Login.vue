<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <div class="logo">
          <h1>SITTA</h1>
          <p>Sistem Informasi Tiras dan Transaksi Bahan Ajar</p>
          <p class="subtitle">Universitas Terbuka</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="masukkan email anda"
              required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="masukkan password anda"
              required>
          </div>
          
          <button type="submit" class="btn-login">Login</button>
          
          <div class="login-options">
            <a href="#" @click.prevent="showLupaPassword = true">Lupa Password?</a>
            <a href="#" @click.prevent="showDaftar = true">Daftar</a>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Lupa Password -->
    <div
      v-if="showLupaPassword"
      class="modal show"
      @click.self="showLupaPassword = false">
      <div class="modal-content">
        <span class="close" @click="showLupaPassword = false">&times;</span>
        <h2>Lupa Password</h2>
        <p>Silakan hubungi administrator untuk reset password Anda.</p>
        <form @submit.prevent="handleLupaPassword">
          <div class="form-group">
            <label for="emailReset">Email Terdaftar</label>
            <input
              type="email"
              id="emailReset"
              v-model="emailReset"
              placeholder="email@ut.ac.id">
          </div>
          <button type="submit" class="btn-primary">
            Kirim Permintaan
          </button>
        </form>
      </div>
    </div>

    <!-- Modal Daftar -->
    <div
      v-if="showDaftar"
      class="modal show"
      @click.self="showDaftar = false">
      <div class="modal-content">
        <span class="close" @click="showDaftar = false">&times;</span>
        <h2>Daftar Akun Baru</h2>
        <form @submit.prevent="handleDaftar">
          <div class="form-group">
            <label for="namaLengkap">Nama Lengkap</label>
            <input
              type="text"
              id="namaLengkap"
              v-model="formDaftar.namaLengkap"
              placeholder="Nama lengkap">
          </div>
          <div class="form-group">
            <label for="emailDaftar">Email</label>
            <input
              type="email"
              id="emailDaftar"
              v-model="formDaftar.email"
              placeholder="email@ut.ac.id">
          </div>
          <div class="form-group">
            <label for="passwordDaftar">Password</label>
            <input
              type="password"
              id="passwordDaftar"
              v-model="formDaftar.password"
              placeholder="Password">
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" v-model="formDaftar.role">
              <option value="UPBJJ-UT">UPBJJ-UT</option>
              <option value="Puslaba">Puslaba</option>
              <option value="Fakultas">Fakultas</option>
            </select>
          </div>
          <button type="submit" class="btn-primary">Daftar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { dataPengguna } from '../data/data-source.js'

const router = useRouter()

const email = ref('')
const password = ref('')
const showLupaPassword = ref(false)
const showDaftar = ref(false)
const emailReset = ref('')
const formDaftar = ref({
  namaLengkap: '',
  email: '',
  password: '',
  role: 'UPBJJ-UT'
})

const handleLogin = () => {
  const user = dataPengguna.find(
    u => u.email === email.value && u.password === password.value
  )

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    alert('Login berhasil! Selamat datang ' + user.nama)
    router.push('/dashboard')
  } else {
    alert('Email atau password yang anda masukkan salah!')
  }
}

const handleLupaPassword = () => {
  alert('Permintaan reset password telah dikirim ke email Anda')
  showLupaPassword.value = false
  emailReset.value = ''
}

const handleDaftar = () => {
  alert('Pendaftaran berhasil! Silakan login.')
  showDaftar.value = false
  formDaftar.value = {
    namaLengkap: '',
    email: '',
    password: '',
    role: 'UPBJJ-UT'
  }
}
</script>

<style scoped>
/* Styles are in global style.css */
</style>

