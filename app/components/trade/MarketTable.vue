<template>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
    <div class="p-4 border-b border-gray-700 flex items-center justify-between">
      <h3 class="text-white font-semibold">Market Overview</h3>
      <div class="flex items-center gap-2">
        <span v-if="lastUpdated" class="text-xs text-gray-500">
          Updated: {{ formatTime(lastUpdated) }}
        </span>
        <button 
          @click="fetchPrices" 
          :disabled="loading"
          class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Refresh prices"
        >
          <UIcon 
            name="i-heroicons-arrow-path" 
            class="w-4 h-4" 
            :class="{ 'animate-spin': loading }"
          />
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !markets.length" class="p-8 text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-amber-500 animate-spin mx-auto mb-2" />
      <p class="text-gray-400">Loading market data...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-8 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p class="text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="fetchPrices"
        class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>

    <!-- Data table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-900/50">
          <tr>
            <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">#</th>
            <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Coin</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">Price</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">24h Change</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm hidden sm:table-cell">Market Cap</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm hidden md:table-cell">Volume (24h)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700/50">
          <tr 
            v-for="(coin, index) in markets" 
            :key="coin.id" 
            class="hover:bg-gray-700/30 transition-colors"
          >
            <td class="px-4 py-4 text-gray-500 text-sm">{{ index + 1 }}</td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <img 
                  :src="coin.image" 
                  :alt="coin.name" 
                  class="w-8 h-8 rounded-full"
                  @error="handleImageError"
                />
                <div>
                  <span class="text-white font-medium block">{{ coin.symbol.toUpperCase() }}</span>
                  <span class="text-gray-500 text-xs">{{ coin.name }}</span>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-right">
              <span class="text-white font-medium">${{ formatPrice(coin.current_price) }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <span 
                class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium"
                :class="coin.price_change_percentage_24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
              >
                <UIcon 
                  :name="coin.price_change_percentage_24h >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
                  class="w-4 h-4" 
                />
                {{ coin.price_change_percentage_24h >= 0 ? '+' : '' }}{{ coin.price_change_percentage_24h?.toFixed(2) || '0.00' }}%
              </span>
            </td>
            <td class="px-4 py-4 text-right text-gray-400 hidden sm:table-cell">
              ${{ formatLargeNumber(coin.market_cap) }}
            </td>
            <td class="px-4 py-4 text-right text-gray-400 hidden md:table-cell">
              ${{ formatLargeNumber(coin.total_volume) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="p-3 border-t border-gray-700 text-center">
      <span class="text-xs text-gray-500">
        Data provided by <a href="https://www.coingecko.com" target="_blank" class="text-amber-500 hover:text-amber-400">CoinGecko</a>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
}

const markets = ref<CoinData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const lastUpdated = ref<Date | null>(null)

// Coins to fetch (top coins by market cap)
const coinIds = [
  'bitcoin',
  'ethereum', 
  'tether',
  'binancecoin',
  'solana',
  'ripple',
  'cardano',
  'dogecoin',
  'tron',
  'polkadot'
]

async function fetchPrices() {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch market data')
    }

    const data = await response.json()
    markets.value = data
    lastUpdated.value = new Date()
  } catch (err: any) {
    console.error('Error fetching prices:', err)
    error.value = err.message || 'Failed to load market data'
    
    // Use fallback data if API fails
    if (!markets.value.length) {
      markets.value = getFallbackData()
    }
  } finally {
    loading.value = false
  }
}

function getFallbackData(): CoinData[] {
  return [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 0, market_cap: 0, total_volume: 0, price_change_percentage_24h: 0 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 0, market_cap: 0, total_volume: 0, price_change_percentage_24h: 0 },
  ]
}

function formatPrice(price: number): string {
  if (!price) return '0.00'
  if (price < 0.01) return price.toFixed(6)
  if (price < 1) return price.toFixed(4)
  return new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(price)
}

function formatLargeNumber(num: number): string {
  if (!num) return '0'
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  return num.toLocaleString()
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="%23374151"/><text x="16" y="20" text-anchor="middle" fill="%239CA3AF" font-size="12">?</text></svg>'
}

// Fetch on mount
onMounted(() => {
  fetchPrices()
})

// Auto-refresh every 60 seconds
let refreshInterval: NodeJS.Timeout
onMounted(() => {
  refreshInterval = setInterval(fetchPrices, 60000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
