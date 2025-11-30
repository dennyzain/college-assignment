<template>
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
</template>

<script setup>
defineProps({
  cards: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* Styles are in global style.css */
</style>

