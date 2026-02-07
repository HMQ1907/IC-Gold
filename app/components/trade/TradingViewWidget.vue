<template>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <h3 class="text-white font-semibold">Trading Chart</h3>
        <div class="flex items-center gap-2">
          <select
            v-model="selectedSymbol"
            class="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
          >
            <option v-for="symbol in symbols" :key="symbol.value" :value="symbol.value">
              {{ symbol.label }}
            </option>
          </select>
          <select
            v-model="selectedInterval"
            class="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
          >
            <option v-for="interval in intervals" :key="interval.value" :value="interval.value">
              {{ interval.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    
    <div ref="chartContainer" :style="{ height: height + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 500
})

const chartContainer = ref<HTMLElement | null>(null)

const symbols = [
  { label: 'Gold/USD', value: 'TVC:GOLD' },
  { label: 'BTC/USDT', value: 'BINANCE:BTCUSDT' },
  { label: 'ETH/USDT', value: 'BINANCE:ETHUSDT' },
  { label: 'BNB/USDT', value: 'BINANCE:BNBUSDT' },
  { label: 'XRP/USDT', value: 'BINANCE:XRPUSDT' },
  { label: 'SOL/USDT', value: 'BINANCE:SOLUSDT' },
  { label: 'DOGE/USDT', value: 'BINANCE:DOGEUSDT' },
  { label: 'ADA/USDT', value: 'BINANCE:ADAUSDT' },
]

const intervals = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1D', value: 'D' },
  { label: '1W', value: 'W' }
]

const selectedSymbol = ref('TVC:GOLD')
const selectedInterval = ref('D')

function loadWidget() {
  if (!chartContainer.value) return

  chartContainer.value.innerHTML = ''

  const widgetContainer = document.createElement('div')
  widgetContainer.className = 'tradingview-widget-container'
  widgetContainer.style.height = '100%'
  widgetContainer.style.width = '100%'

  const widget = document.createElement('div')
  widget.className = 'tradingview-widget-container__widget'
  widget.style.height = '100%'
  widget.style.width = '100%'

  widgetContainer.appendChild(widget)
  chartContainer.value.appendChild(widgetContainer)

  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
  script.type = 'text/javascript'
  script.async = true
  script.innerHTML = JSON.stringify({
    autosize: true,
    symbol: selectedSymbol.value,
    interval: selectedInterval.value,
    timezone: 'Etc/UTC',
    theme: 'dark',
    style: '1',
    locale: 'en',
    enable_publishing: false,
    allow_symbol_change: true,
    calendar: false,
    hide_top_toolbar: false,
    hide_legend: false,
    save_image: false,
    backgroundColor: 'rgba(17, 24, 39, 1)',
    gridColor: 'rgba(55, 65, 81, 0.5)',
    withdateranges: true,
    hide_side_toolbar: false,
    details: true,
    hotlist: true,
    support_host: 'https://www.tradingview.com'
  })

  widgetContainer.appendChild(script)
}

onMounted(() => {
  loadWidget()
})

watch([selectedSymbol, selectedInterval], () => {
  loadWidget()
})
</script>
