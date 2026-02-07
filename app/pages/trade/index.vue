<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">{{ $t('trade.title') }}</h1>
      <p class="text-gray-400">{{ $t('trade.subtitle') }}</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Trading Chart - Available for everyone -->
      <div class="lg:col-span-2">
        <TradeTradingViewWidget :height="550" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- If logged in: Show Copy Trade and Time-based notification -->
        <template v-if="user">
          <TradeCopyTradeButton />
          
          <!-- Copy Trade Reminder - Only show during specific time windows -->
          <div v-if="showCopyTradeReminder && !user.copy_trade_active" class="relative">
            <!-- Animated background glow -->
            <div class="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-xl blur-xl animate-pulse"></div>
            
            <div class="relative bg-gradient-to-br from-amber-900/80 to-orange-900/80 border-2 border-amber-500 rounded-xl p-6 animate-bounce-slow overflow-hidden">
              <!-- Sparkle effects -->
              <div class="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
              <div class="absolute top-4 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" style="animation-delay: 0.3s"></div>
              <div class="absolute bottom-4 left-4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping" style="animation-delay: 0.6s"></div>
              
              <div class="text-center">
                <!-- Bell icon with animation -->
                <div class="relative inline-block mb-3">
                  <UIcon name="i-heroicons-bell-alert" class="w-16 h-16 text-amber-400 animate-wiggle" />
                  <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">!</span>
                </div>
                
                <h3 class="text-xl font-bold text-amber-400 mb-2 animate-pulse">
                  {{ $t('trade.copyTradeReminderTitle') }}
                </h3>
                <p class="text-white text-sm mb-4">
                  {{ $t('trade.copyTradeReminderDesc') }}
                </p>
                
                <!-- Time window indicator -->
                <div class="bg-black/30 rounded-lg px-3 py-2 mb-4 inline-flex items-center gap-2">
                  <UIcon name="i-heroicons-clock" class="w-4 h-4 text-amber-400" />
                  <span class="text-amber-300 text-sm font-medium">{{ currentTimeWindow }}</span>
                </div>
                
                <p class="text-amber-200/80 text-xs">
                  {{ $t('trade.copyTradeReminderHint') }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Empty state when not in time window or already enabled -->
          <div v-else-if="!user.copy_trade_active" class="h-4"></div>
        </template>

        <!-- If NOT logged in: Show CTA to sign up -->
        <template v-else>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div class="text-center">
              <UIcon name="i-heroicons-chart-bar-square" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 class="text-lg font-bold text-white mb-2">{{ $t('trade.startTrading') }}</h3>
              <p class="text-gray-400 text-sm mb-6">
                {{ $t('trade.signInToAccess') }}
              </p>
              <div class="space-y-3">
                <NuxtLink 
                  to="/auth/register" 
                  class="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-center transition-colors cursor-pointer"
                >
                  {{ $t('trade.createFreeAccount') }}
                </NuxtLink>
                <NuxtLink 
                  to="/auth/login" 
                  class="block w-full py-3 px-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-xl text-center transition-colors"
                >
                  {{ $t('auth.signIn') }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Copy Trade Info for guests -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 class="font-semibold text-white mb-3 flex items-center gap-2">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-amber-500" />
              {{ $t('trade.copyTradeFeature') }}
            </h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li class="flex items-start gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>{{ $t('trade.copyTradeInfo1') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>{{ $t('trade.copyTradeInfo2') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>{{ $t('trade.copyTradeInfo3') }}</span>
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

// Time-based reminder logic
const currentTime = ref(new Date())
const currentTimeWindow = ref('')

// Check if current time is within reminder windows (10:00-10:15 or 15:00-15:15)
const showCopyTradeReminder = computed(() => {
  const now = currentTime.value
  const hours = now.getHours()
  const minutes = now.getMinutes()
  
  // Window 1: 10:00 - 10:15
  if (hours === 10 && minutes >= 0 && minutes < 15) {
    currentTimeWindow.value = '10:00 - 10:15'
    return true
  }
  
  // Window 2: 15:00 - 15:15
  if (hours === 15 && minutes >= 0 && minutes < 15) {
    currentTimeWindow.value = '15:00 - 15:15'
    return true
  }
  
  return false
})

// Update time every second
let timeInterval: NodeJS.Timeout
onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
