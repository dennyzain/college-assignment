<template>
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => null
  }
})

const isGuest = computed(() => !props.user)

const roleLabel = computed(() => {
  if (!props.user) {
    return 'Tamu'
  }
  return [props.user.role, props.user.lokasi]
    .filter(Boolean)
    .join(' • ')
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

