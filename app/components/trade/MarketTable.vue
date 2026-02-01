<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
    <div class="p-4 border-b border-gray-800"><h3 class="text-white font-semibold">Markets</h3></div>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-800/50">
          <tr>
            <th class="px-4 py-3 text-left text-gray-400 font-medium text-sm">Pair</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">Price</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">24h %</th>
            <th class="px-4 py-3 text-right text-gray-400 font-medium text-sm">Volume</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-for="market in markets" :key="market.symbol" class="hover:bg-gray-800/50 transition-colors cursor-pointer">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <img :src="market.icon" :alt="market.symbol" class="w-6 h-6 rounded-full" />
                <span class="text-white font-medium">{{ market.symbol }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right text-white font-medium">${{ formatNumber(market.price) }}</td>
            <td class="px-4 py-3 text-right">
              <span class="font-medium" :class="market.change >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ market.change >= 0 ? '+' : '' }}{{ market.change.toFixed(2) }}%
              </span>
            </td>
            <td class="px-4 py-3 text-right text-gray-400">${{ formatVolume(market.volume) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const markets = ref([
  { symbol: 'BTC/USDT', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029', price: 67432.50, change: 2.34, volume: 28500000000 },
  { symbol: 'ETH/USDT', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', price: 3521.80, change: 1.82, volume: 15200000000 },
  { symbol: 'BNB/USDT', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=029', price: 589.45, change: -0.56, volume: 1850000000 },
  { symbol: 'SOL/USDT', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=029', price: 178.92, change: 5.21, volume: 3200000000 },
  { symbol: 'XRP/USDT', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=029', price: 0.5234, change: -1.23, volume: 1420000000 },
  { symbol: 'DOGE/USDT', icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=029', price: 0.1245, change: 3.67, volume: 980000000 }
])
function formatNumber(num: number): string {
  return num < 1 ? num.toFixed(4) : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}
function formatVolume(num: number): string {
  return num >= 1e9 ? (num / 1e9).toFixed(2) + 'B' : num >= 1e6 ? (num / 1e6).toFixed(2) + 'M' : num.toLocaleString()
}
</script>
