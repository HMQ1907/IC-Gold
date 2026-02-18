<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        {{ $t("trade.title") }}
      </h1>
      <p class="text-gray-400">{{ $t("trade.subtitle") }}</p>
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
          <div v-if="showCopyTradeReminder" class="relative">
            <!-- Animated background glow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-xl blur-xl animate-pulse"
            ></div>

            <div
              class="relative bg-gradient-to-br from-amber-900/80 to-orange-900/80 border-2 border-amber-500 rounded-xl p-6 animate-bounce-slow overflow-hidden"
            >
              <!-- Sparkle effects -->
              <div
                class="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-ping"
              ></div>
              <div
                class="absolute top-4 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping"
                style="animation-delay: 0.3s"
              ></div>
              <div
                class="absolute bottom-4 left-4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-ping"
                style="animation-delay: 0.6s"
              ></div>

              <div class="text-center">
                <!-- Bell icon with animation -->
                <div class="relative inline-block mb-3">
                  <UIcon
                    name="i-heroicons-bell-alert"
                    class="w-16 h-16 text-amber-400 animate-wiggle"
                  />
                  <span
                    class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse"
                    >!</span
                  >
                </div>

                <h3 class="text-xl font-bold text-amber-400 mb-2 animate-pulse">
                  {{ $t("trade.copyTradeReminderTitle") }}
                </h3>
                <p class="text-white text-sm mb-4">
                  {{ $t("trade.copyTradeReminderDesc") }}
                </p>

                <!-- Time window indicator -->
                <div
                  class="bg-black/30 rounded-lg px-3 py-2 mb-4 inline-flex items-center gap-2"
                >
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-4 h-4 text-amber-400"
                  />
                  <span class="text-amber-300 text-sm font-medium">{{
                    currentTimeWindow
                  }}</span>
                </div>

                <!-- Daily Copy Trade Button -->
                <div class="mt-4">
                  <button
                    v-if="!dailyCopyStatus.hasSubmittedToday"
                    @click="submitDailyCopyTrade"
                    :disabled="submittingDailyCopy"
                    class="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <UIcon
                      v-if="submittingDailyCopy"
                      name="i-heroicons-arrow-path"
                      class="w-5 h-5 animate-spin"
                    />
                    <UIcon
                      v-else
                      name="i-heroicons-currency-dollar"
                      class="w-5 h-5"
                    />
                    {{
                      submittingDailyCopy
                        ? $t("trade.dailyCopyTradeSubmitting")
                        : $t("trade.dailyCopyTradeBtn")
                    }}
                  </button>

                  <!-- Already submitted status -->
                  <div v-else class="bg-black/30 rounded-xl p-4">
                    <div
                      v-if="dailyCopyStatus.status === 'pending'"
                      class="flex items-center justify-center gap-2 text-yellow-400"
                    >
                      <UIcon name="i-heroicons-clock" class="w-5 h-5" />
                      <span class="font-medium">{{ $t("trade.dailyCopyTradePending") }}</span>
                    </div>
                    <div
                      v-else-if="dailyCopyStatus.status === 'approved'"
                      class="flex items-center justify-center gap-2 text-green-400"
                    >
                      <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
                      <span class="font-medium">{{ $t("trade.dailyCopyTradeApproved") }}</span>
                    </div>
                    <div
                      v-else-if="dailyCopyStatus.status === 'rejected'"
                      class="flex items-center justify-center gap-2 text-red-400"
                    >
                      <UIcon name="i-heroicons-x-circle" class="w-5 h-5" />
                      <span class="font-medium">{{ $t("trade.dailyCopyTradeRejected") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state when not in time window or already enabled -->
          <div v-else class="h-4"></div>
        </template>

        <!-- If NOT logged in: Show CTA to sign up -->
        <template v-else>
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div class="text-center">
              <UIcon
                name="i-heroicons-chart-bar-square"
                class="w-12 h-12 text-amber-500 mx-auto mb-4"
              />
              <h3 class="text-lg font-bold text-white mb-2">
                {{ $t("trade.startTrading") }}
              </h3>
              <p class="text-gray-400 text-sm mb-6">
                {{ $t("trade.signInToAccess") }}
              </p>
              <div class="space-y-3">
                <NuxtLink
                  to="/auth/register"
                  class="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-center transition-colors cursor-pointer"
                >
                  {{ $t("trade.createFreeAccount") }}
                </NuxtLink>
                <NuxtLink
                  to="/auth/login"
                  class="block w-full py-3 px-4 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-xl text-center transition-colors"
                >
                  {{ $t("auth.signIn") }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Copy Trade Info for guests -->
          <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 class="font-semibold text-white mb-3 flex items-center gap-2">
              <UIcon
                name="i-heroicons-sparkles"
                class="w-5 h-5 text-amber-500"
              />
              {{ $t("trade.copyTradeFeature") }}
            </h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                />
                <span>{{ $t("trade.copyTradeInfo1") }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                />
                <span>{{ $t("trade.copyTradeInfo2") }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                />
                <span>{{ $t("trade.copyTradeInfo3") }}</span>
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
const { user } = useAuth();
const toast = useToast();
const { t } = useI18n();

// Time-based reminder logic
const currentTime = ref(new Date());
const currentTimeWindow = ref("");

// Daily copy trade status
const dailyCopyStatus = ref({
  hasSubmittedToday: false,
  status: null as string | null,
  timeWindow: null as string | null,
});
const submittingDailyCopy = ref(false);

// Check if current time is within reminder windows (10:00-10:15 or 15:00-15:15)
const showCopyTradeReminder = computed(() => {
  const now = currentTime.value;
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Window 1: 10:00 - 10:15
  if (hours === 10 && minutes >= 0 && minutes < 15) {
    currentTimeWindow.value = "10:00 - 10:15";
    return true;
  }

  // Window 2: 15:00 - 15:15
  if (hours === 15 && minutes >= 0 && minutes < 15) {
    currentTimeWindow.value = "15:00 - 15:15";
    return true;
  }

  // TEST Window: 21:30 - 22:00 (xóa sau khi test xong)
  // if (hours === 21 && minutes >= 0 && minutes < 60) {
  //   currentTimeWindow.value = "21:00 - 23:00 (TEST)";
  //   return true;
  // }

  return false;
});

// Fetch daily copy trade status for current time window
async function fetchDailyCopyStatus() {
  if (!user.value?.id) return;

  // Get normalized time window based on current hour
  const now = new Date();
  const hours = now.getHours();
  let normalizedTimeWindow = '';
  
  if (hours >= 10 && hours < 15) {
    normalizedTimeWindow = '10:00';
  } else if (hours >= 15 && hours < 21) {
    normalizedTimeWindow = '15:00';
  } else {
    normalizedTimeWindow = '21:00'; // Test window
  }

  try {
    const data = await $fetch("/api/trade/daily-copy-status", {
      params: { 
        userId: user.value.id,
        timeWindow: normalizedTimeWindow
      },
    });
    dailyCopyStatus.value = data;
  } catch (error) {
    console.error("Error fetching daily copy status:", error);
  }
}

// Submit daily copy trade request
async function submitDailyCopyTrade() {
  if (!user.value?.id || submittingDailyCopy.value) return;

  submittingDailyCopy.value = true;

  try {
    const response = await $fetch("/api/trade/daily-copy", {
      method: "POST",
      body: {
        userId: user.value.id,
        timeWindow: currentTimeWindow.value,
      },
    });

    if (response.success) {
      toast.add({
        title: t("common.success"),
        description: t("trade.dailyCopyTradeSuccess"),
        color: "success",
        icon: "i-heroicons-check-circle",
      });
      // Update status
      dailyCopyStatus.value = {
        hasSubmittedToday: true,
        status: "pending",
        timeWindow: currentTimeWindow.value,
      };
    } else {
      toast.add({
        title: t("common.warning"),
        description: response.message,
        color: "warning",
        icon: "i-heroicons-information-circle",
      });
    }
  } catch (error: any) {
    toast.add({
      title: t("common.error"),
      description: error.message || t("common.error"),
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    submittingDailyCopy.value = false;
  }
}

// Update time every second
let timeInterval: NodeJS.Timeout;
let lastTimeWindow = '';

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTime.value = new Date();
    
    // Re-fetch status when entering a new time window
    if (currentTimeWindow.value && currentTimeWindow.value !== lastTimeWindow) {
      lastTimeWindow = currentTimeWindow.value;
      fetchDailyCopyStatus();
    }
  }, 1000);

  // Fetch daily copy status on mount
  fetchDailyCopyStatus();
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>
