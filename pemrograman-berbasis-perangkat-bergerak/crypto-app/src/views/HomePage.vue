<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Crypto Market</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" :scroll-events="true">
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Loading market data...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <ion-button @click="fetchCryptos" fill="outline">Retry</ion-button>
      </div>

      <div v-else class="table-wrapper">
        <!-- Header Row -->
        <div class="table-header">
          <span class="col-coin">Cryptocurrency</span>
          <span class="col-price">Price ⇅</span>
          <span class="col-change">24h% ⇅</span>
          <span class="col-mcap">Market Cap</span>
          <span class="col-supply">Circulating Supply</span>
        </div>

        <!-- Data Rows -->
        <div
          v-for="coin in cryptos"
          :key="coin.id"
          class="table-row"
        >
          <!-- Coin -->
          <div class="col-coin">
            <div class="coin-avatar" :style="{ background: getAvatarColor(coin.symbol) }">
              <img
                :src="`https://cryptoicons.org/api/icon/${coin.symbol.toLowerCase()}/32`"
                :alt="coin.symbol"
                class="coin-icon-img"
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
              />
              <span class="avatar-fallback">{{ coin.symbol.slice(0, 2) }}</span>
            </div>
            <div class="coin-info">
              <span class="coin-name">{{ coin.name }}</span>
              <span class="coin-symbol">{{ coin.symbol }}</span>
            </div>
          </div>

          <!-- Price -->
          <div class="col-price">${{ formatPrice(coin.price_usd) }}</div>

          <!-- 24h Change -->
          <div
            class="col-change"
            :class="parseFloat(coin.percent_change_24h) >= 0 ? 'positive' : 'negative'"
          >
            <span class="triangle">{{ parseFloat(coin.percent_change_24h) >= 0 ? '▲' : '▼' }}</span>
            {{ Math.abs(parseFloat(coin.percent_change_24h)).toFixed(0) }}%
          </div>

          <!-- Market Cap -->
          <div class="col-mcap">{{ formatLargeNum(coin.market_cap_usd) }}</div>

          <!-- Circulating Supply -->
          <div class="col-supply">
            <span class="supply-text">{{ formatSupply(coin.csupply) }} {{ coin.symbol }}</span>
            <div class="supply-bar-track">
              <div
                class="supply-bar-fill"
                :style="{ width: supplyPercent(coin) + '%' }"
              ></div>
            </div>
          </div>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSpinner, IonButton
} from '@ionic/vue';

interface Coin {
  id: string;
  rank: string;
  name: string;
  symbol: string;
  price_usd: string;
  percent_change_24h: string;
  market_cap_usd: string;
  csupply: string;
  tsupply: string;
  msupply: string;
}

const cryptos = ref<Coin[]>([]);
const isLoading = ref(false);
const error = ref('');

const BRAND_COLORS: Record<string, string> = {
  BTC: '#F7931A', ETH: '#627EEA', USDT: '#26A17B', BNB: '#F0B90B',
  XRP: '#346AA9', USDC: '#2775CA', SOL: '#9945FF', ADA: '#0033AD',
  DOGE: '#C2A633', TRX: '#E50914', MATIC: '#8247E5', DOT: '#E6007A',
  LTC: '#BFBBBB', SHIB: '#FFA409', AVAX: '#E84142', UNI: '#FF007A',
  LINK: '#2A5ADA', XLM: '#000000', ATOM: '#2E3148', XMR: '#FF6600',
};

const FALLBACK_COLORS = [
  '#6C63FF','#FF6584','#43E97B','#FA709A','#4FACFE',
  '#43CBFF','#F093FB','#FDC830','#667EEA','#F5576C',
];

function getAvatarColor(symbol: string): string {
  if (BRAND_COLORS[symbol]) return BRAND_COLORS[symbol];
  let hash = 0;
  for (const c of symbol) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function formatPrice(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return val;
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(4);
  return n.toFixed(6);
}

function formatLargeNum(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return '-';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  return '$' + n.toFixed(0);
}

function formatSupply(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return '-';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(0);
}

function supplyPercent(coin: Coin): number {
  const c = parseFloat(coin.csupply);
  const max = parseFloat(coin.msupply) || parseFloat(coin.tsupply);
  if (!c || !max) return 0;
  return Math.min((c / max) * 100, 100);
}

async function fetchCryptos() {
  isLoading.value = true;
  error.value = '';
  try {
    const res = await fetch('https://api.coinlore.net/api/tickers/');
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    cryptos.value = json.data;
  } catch (e: any) {
    error.value = e.message || 'Error fetching data';
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchCryptos);
</script>

<style scoped>
ion-toolbar {
  --background: #ffffff;
  --color: #374151;
  font-weight: 700;
}

ion-title {
  font-size: 18px;
  font-weight: 700;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 12px;
  color: #888;
}

ion-content {
  --background: #ffffff;
}

/* ── Table ── */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #ffffff;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 200px 110px 90px 110px 170px;
  align-items: center;
  padding: 0 16px;
  min-width: 690px;
}

.table-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding-top: 10px;
  padding-bottom: 10px;
}

.table-header span {
  font-size: 13px;
  color: #868e96;
  font-weight: 500;
}

.table-row {
  padding-top: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f3f5;
  background: #ffffff;
  transition: background 0.15s;
}

.table-row:hover {
  background: #f8f9ff;
}

/* ── Coin Column ── */
.col-coin {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.coin-icon-img {
  width: 24px;
  height: 24px;
  position: absolute;
  object-fit: contain;
}

.avatar-fallback {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.coin-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.coin-name {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
}

.coin-symbol {
  font-size: 12px;
  color: #adb5bd;
  font-weight: 500;
}

/* ── Price Column ── */
.col-price {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* ── 24h Change Column ── */
.col-change {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.col-change.positive { color: #2f9e44; }
.col-change.negative { color: #e03131; }

.triangle {
  font-size: 10px;
}

/* ── Market Cap Column ── */
.col-mcap {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

/* ── Supply Column ── */
.col-supply {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.supply-text {
  font-size: 12px;
  color: #495057;
  font-weight: 500;
}

.supply-bar-track {
  width: 100%;
  height: 5px;
  background: #dee2e6;
  border-radius: 999px;
  overflow: hidden;
}

.supply-bar-fill {
  height: 100%;
  background: #4263eb;
  border-radius: 999px;
  transition: width 0.4s ease;
}


</style>
