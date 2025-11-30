<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
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
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

