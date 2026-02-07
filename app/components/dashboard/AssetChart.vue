<template>
  <!-- <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
    <div ref="chartContainer" style="height: 400px;"></div>
  </div> -->
</template>

<script setup lang="ts">
const chartContainer = ref<HTMLElement | null>(null)
const symbols = [
  { label: 'BTC/USD', value: 'BINANCE:BTCUSDT' },
  { label: 'ETH/USD', value: 'BINANCE:ETHUSDT' },
  { label: 'BNB/USD', value: 'BINANCE:BNBUSDT' },
  { label: 'XRP/USD', value: 'BINANCE:XRPUSDT' },
  { label: 'SOL/USD', value: 'BINANCE:SOLUSDT' },
  { label: 'Gold', value: 'TVC:GOLD' }
]
const selectedSymbol = ref(symbols[0])

function loadWidget() {
  if (!chartContainer.value) return
  chartContainer.value.innerHTML = ''
  const container = document.createElement('div')
  container.className = 'tradingview-widget-container'
  container.style.height = '100%'
  container.style.width = '100%'
  const widget = document.createElement('div')
  widget.style.height = '100%'
  widget.style.width = '100%'
  container.appendChild(widget)
  chartContainer.value.appendChild(container)
  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
  script.type = 'text/javascript'
  script.async = true
  script.innerHTML = JSON.stringify({
    autosize: true, symbol: selectedSymbol.value.value, interval: 'D', timezone: 'Etc/UTC',
    theme: 'dark', style: '1', locale: 'en', allow_symbol_change: true, calendar: false,
    backgroundColor: 'rgba(17, 24, 39, 1)', gridColor: 'rgba(55, 65, 81, 0.5)'
  })
  container.appendChild(script)
}

onMounted(() => loadWidget())
watch(selectedSymbol, () => loadWidget())
</script>
