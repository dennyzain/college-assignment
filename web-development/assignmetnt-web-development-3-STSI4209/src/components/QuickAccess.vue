<template>
  <div class="quick-menu">
    <router-link
      v-for="item in items"
      :key="item.href"
      class="quick-card"
      :to="item.href">
      <div class="quick-icon">{{ item.icon }}</div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </router-link>
    <p v-if="items.length === 0" class="caption">
      Tidak ada menu cepat yang tersedia.
    </p>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

