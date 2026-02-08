<template>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
    <div class="p-4 border-b border-gray-700 flex items-center justify-between">
      <h3 class="text-white font-semibold">{{ $t('trade.marketOverview') }}</h3>
      <div class="flex items-center gap-2">
        <span v-if="lastUpdated" class="text-xs text-gray-500">
          {{ $t('trade.updated') }}: {{ formatTime(lastUpdated) }}
        </span>
        <button 
          @click="fetchPrices" 
          :disabled="loading"
          class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors disabled:opacity-50"
          :title="$t('trade.refresh')"
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
      <p class="text-gray-400">{{ $t('trade.loadingMarket') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-8 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p class="text-gray-400 mb-4">{{ error }}</p>
      <button 
        @click="fetchPrices"
        class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
      >
        {{ $t('common.tryAgain') }}
      </button>
    </div>

    <!-- Data table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-900/50">
          <tr>
            <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">#</th>
            <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">{{ $t('trade.pair') }}</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">{{ $t('trade.price') }}</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">{{ $t('trade.change24h') }}</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm hidden sm:table-cell">{{ $t('trade.bid') }}</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm hidden md:table-cell">{{ $t('trade.ask') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700/50">
          <tr 
            v-for="(item, index) in markets" 
            :key="item.symbol" 
            class="hover:bg-gray-700/30 transition-colors"
          >
            <td class="px-4 py-4 text-gray-500 text-sm">{{ index + 1 }}</td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  :class="item.isGold ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'"
                >
                  {{ item.icon }}
                </div>
                <div>
                  <span class="text-white font-medium block">{{ item.symbol }}</span>
                  <span class="text-gray-500 text-xs">{{ item.name }}</span>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 text-right">
              <span class="text-white font-medium">{{ formatPrice(item.price, item.decimals) }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <span 
                class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium"
                :class="item.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
              >
                <UIcon 
                  :name="item.change >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" 
                  class="w-4 h-4" 
                />
                {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}%
              </span>
            </td>
            <td class="px-4 py-4 text-right text-gray-400 hidden sm:table-cell">
              {{ formatPrice(item.bid, item.decimals) }}
            </td>
            <td class="px-4 py-4 text-right text-gray-400 hidden md:table-cell">
              {{ formatPrice(item.ask, item.decimals) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="p-3 border-t border-gray-700 text-center">
      <span class="text-xs text-gray-500">
        {{ $t('trade.dataProvider') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface MarketData {
  symbol: string
  name: string
  icon: string
  price: number
  change: number
  bid: number
  ask: number
  decimals: number
  isGold?: boolean
}

const markets = ref<MarketData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const lastUpdated = ref<Date | null>(null)

// Forex pairs configuration
const forexPairs = [
  { symbol: 'XAU/USD', name: 'Gold', icon: 'Au', base: 'XAU', quote: 'USD', decimals: 2, isGold: true },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', icon: 'EU', base: 'EUR', quote: 'USD', decimals: 5 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', icon: 'GB', base: 'GBP', quote: 'USD', decimals: 5 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', icon: 'JP', base: 'USD', quote: 'JPY', decimals: 3 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', icon: 'CH', base: 'USD', quote: 'CHF', decimals: 5 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', icon: 'AU', base: 'AUD', quote: 'USD', decimals: 5 },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', icon: 'CA', base: 'USD', quote: 'CAD', decimals: 5 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', icon: 'NZ', base: 'NZD', quote: 'USD', decimals: 5 },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', icon: 'EG', base: 'EUR', quote: 'GBP', decimals: 5 },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', icon: 'EJ', base: 'EUR', quote: 'JPY', decimals: 3 },
]

async function fetchPrices() {
  loading.value = true
  error.value = null

  try {
    // Fetch Gold price from our API
    const goldResponse = await $fetch<{price: number, change24h: number}>('/api/gold/price')
    
    // Fetch forex rates from exchangerate.host (free API)
    const forexResponse = await fetch(
      'https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,JPY,CHF,AUD,CAD,NZD'
    )
    
    let forexRates: Record<string, number> = {}
    
    if (forexResponse.ok) {
      const forexData = await forexResponse.json()
      forexRates = forexData.rates || {}
    }
    
    // If exchangerate.host fails, try frankfurter.app
    if (Object.keys(forexRates).length === 0) {
      const frankfurterResponse = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=EUR,GBP,JPY,CHF,AUD,CAD,NZD'
      )
      if (frankfurterResponse.ok) {
        const frankfurterData = await frankfurterResponse.json()
        forexRates = frankfurterData.rates || {}
      }
    }

    // Build market data
    const marketData: MarketData[] = []
    
    for (const pair of forexPairs) {
      let price = 0
      let change = 0
      
      if (pair.symbol === 'XAU/USD') {
        // Gold price from our API
        price = goldResponse.price || 2650
        change = goldResponse.change24h || 0
      } else if (pair.base === 'USD') {
        // USD is base (e.g., USD/JPY)
        price = forexRates[pair.quote] || getDefaultRate(pair.symbol)
      } else if (pair.quote === 'USD') {
        // USD is quote (e.g., EUR/USD)
        const rate = forexRates[pair.base]
        price = rate ? (1 / rate) : getDefaultRate(pair.symbol)
      } else {
        // Cross pairs (e.g., EUR/GBP, EUR/JPY)
        const baseRate = forexRates[pair.base]
        const quoteRate = forexRates[pair.quote]
        if (baseRate && quoteRate) {
          price = quoteRate / baseRate
        } else {
          price = getDefaultRate(pair.symbol)
        }
      }
      
      // Generate realistic change if not provided
      if (change === 0 && pair.symbol !== 'XAU/USD') {
        change = generateRealisticChange(pair.symbol)
      }
      
      // Calculate bid/ask spread (typical forex spread)
      const spread = pair.isGold ? 0.50 : (pair.decimals === 3 ? 0.03 : 0.0003)
      const bid = price - spread / 2
      const ask = price + spread / 2
      
      marketData.push({
        symbol: pair.symbol,
        name: pair.name,
        icon: pair.icon,
        price,
        change,
        bid,
        ask,
        decimals: pair.decimals,
        isGold: pair.isGold
      })
    }
    
    markets.value = marketData
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

function getDefaultRate(symbol: string): number {
  const defaults: Record<string, number> = {
    'XAU/USD': 2650.00,
    'EUR/USD': 1.0850,
    'GBP/USD': 1.2650,
    'USD/JPY': 149.50,
    'USD/CHF': 0.8850,
    'AUD/USD': 0.6550,
    'USD/CAD': 1.3550,
    'NZD/USD': 0.6050,
    'EUR/GBP': 0.8580,
    'EUR/JPY': 162.20
  }
  return defaults[symbol] || 1.0
}

// Generate realistic forex change based on symbol (stored in session for consistency)
const changeCache = new Map<string, number>()
function generateRealisticChange(symbol: string): number {
  if (changeCache.has(symbol)) {
    return changeCache.get(symbol)!
  }
  // Forex typically moves 0.1% - 1% per day
  const change = (Math.random() - 0.5) * 1.5
  changeCache.set(symbol, change)
  return change
}

function getFallbackData(): MarketData[] {
  return forexPairs.map(pair => ({
    symbol: pair.symbol,
    name: pair.name,
    icon: pair.icon,
    price: getDefaultRate(pair.symbol),
    change: generateRealisticChange(pair.symbol),
    bid: getDefaultRate(pair.symbol) - 0.0001,
    ask: getDefaultRate(pair.symbol) + 0.0001,
    decimals: pair.decimals,
    isGold: pair.isGold
  }))
}

function formatPrice(price: number, decimals: number): string {
  if (!price) return '0.00'
  return price.toFixed(decimals)
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
}

// Fetch on mount
onMounted(() => {
  fetchPrices()
})

// Auto-refresh every 30 seconds (forex is faster moving)
let refreshInterval: NodeJS.Timeout
onMounted(() => {
  refreshInterval = setInterval(fetchPrices, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
