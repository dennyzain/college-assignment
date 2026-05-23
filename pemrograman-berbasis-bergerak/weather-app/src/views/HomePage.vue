<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title>Prakiraan Cuaca Jakarta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Prakiraan Cuaca Jakarta</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="info-card">
        <ion-icon :icon="locationOutline" />
        <span>Jakarta, Indonesia (-6.2°, 106.8°)</span>
      </div>

      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent" />
        <p>Memuat data cuaca...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <ion-icon :icon="cloudOfflineOutline" color="danger" />
        <p>{{ error }}</p>
        <ion-button @click="fetchWeather">Coba Lagi</ion-button>
      </div>

      <div v-else>
        <div class="table-header">
          <div class="col-time">Waktu</div>
          <div class="col-temp">Suhu (°C)</div>
        </div>
        <ion-list lines="full">
          <ion-item v-for="(item, index) in weatherData" :key="index" class="weather-item">
            <ion-icon :icon="thermometerOutline" slot="start" :color="getTempColor(item.temperature)" />
            <ion-label>
              <h3>{{ formatDate(item.time) }}</h3>
              <p>{{ formatTime(item.time) }}</p>
            </ion-label>
            <div slot="end" class="temp-badge" :class="getTempClass(item.temperature)">
              {{ item.temperature }}°C
            </div>
          </ion-item>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonSpinner, IonButton, IonIcon
} from '@ionic/vue';
import { thermometerOutline, locationOutline, cloudOfflineOutline } from 'ionicons/icons';

interface WeatherEntry {
  time: string;
  temperature: number;
}

const loading = ref(true);
const error = ref('');
const weatherData = ref<WeatherEntry[]>([]);

const fetchWeather = async () => {
  loading.value = true;
  error.value = '';
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil data dari API');
    const data = await res.json();
    const times: string[] = data.hourly.time;
    const temps: number[] = data.hourly.temperature_2m;
    weatherData.value = times.slice(0, 10).map((time, i) => ({
      time,
      temperature: temps[i],
    }));
  } catch (e: any) {
    error.value = e.message || 'Terjadi kesalahan';
  } finally {
    loading.value = false;
  }
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const getTempColor = (temp: number) => {
  if (temp >= 35) return 'danger';
  if (temp >= 30) return 'warning';
  return 'primary';
};

const getTempClass = (temp: number) => {
  if (temp >= 35) return 'temp-hot';
  if (temp >= 30) return 'temp-warm';
  return 'temp-cool';
};

onMounted(fetchWeather);
</script>

<style scoped>
.info-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--ion-color-primary);
  color: white;
  font-size: 14px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: var(--ion-color-medium);
}

.error-container ion-icon {
  font-size: 48px;
}

.table-header {
  display: flex;
  padding: 8px 16px;
  background: var(--ion-color-light);
  font-weight: 600;
  font-size: 13px;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--ion-color-light-shade);
}

.col-time { flex: 1; }
.col-temp { width: 80px; text-align: right; }

.weather-item ion-label h3 {
  font-weight: 600;
  font-size: 15px;
}

.weather-item ion-label p {
  font-size: 13px;
  color: var(--ion-color-medium);
}

.temp-badge {
  font-weight: 700;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  min-width: 70px;
  text-align: center;
}

.temp-hot {
  background: #fde8e8;
  color: #c53030;
}

.temp-warm {
  background: #fef3c7;
  color: #92400e;
}

.temp-cool {
  background: #dbeafe;
  color: #1e40af;
}
</style>
