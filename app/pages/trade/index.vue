<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Trade</h1>
      <p class="text-gray-400">Track markets and Copy Trade from experts</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Trading Chart - Available for everyone -->
      <div class="lg:col-span-2">
        <TradeTradingViewWidget :height="550" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- If logged in: Show Copy Trade and Balance -->
        <template v-if="user">
          <TradeCopyTradeButton />
          
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-400">Available Balance</span>
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="canCopyTrade ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/50 text-gray-400'"
              >
                {{ canCopyTrade ? 'Copy Trade Eligible' : 'Need $1,000+' }}
              </span>
            </div>
            <p class="text-3xl font-bold text-white mb-4">${{ formatNumber(user?.balance || 0) }}</p>
            <div class="flex gap-2">
              <NuxtLink 
                to="/wallet/deposit" 
                class="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-lg text-center text-sm transition-colors"
              >
                Deposit More
              </NuxtLink>
              <NuxtLink 
                to="/wallet/withdraw" 
                class="flex-1 py-2 px-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg text-center text-sm transition-colors"
              >
                Withdraw
              </NuxtLink>
            </div>
          </div>
        </template>

        <!-- If NOT logged in: Show CTA to sign up -->
        <template v-else>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div class="text-center">
              <UIcon name="i-heroicons-chart-bar-square" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 class="text-lg font-bold text-white mb-2">Start Trading</h3>
              <p class="text-gray-400 text-sm mb-6">
                Sign in to access Copy Trade feature and track your portfolio
              </p>
              <div class="space-y-3">
                <NuxtLink 
                  to="/auth/register" 
                  class="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-xl text-center transition-colors"
                >
                  Create Free Account
                </NuxtLink>
                <NuxtLink 
                  to="/auth/login" 
                  class="block w-full py-3 px-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-xl text-center transition-colors"
                >
                  Sign In
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Copy Trade Info for guests -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 class="font-semibold text-white mb-3 flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-amber-500" />
              Copy Trade Feature
            </h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li class="flex items-start gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Automatically copy expert traders</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Copy 5% of your total assets</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>Requires minimum $1,000 balance</span>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>

    <!-- Market Table - Available for everyone -->
    <div class="mt-8">
      <TradeMarketTable />
    </div>
  </div>
</template>

<script setup lang="ts">
// No auth middleware - page is accessible to everyone
const { user } = useAuth()

const canCopyTrade = computed(() => (user.value?.balance || 0) >= 1000)

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}
</script>
