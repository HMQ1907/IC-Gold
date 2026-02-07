<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 py-20 lg:py-32">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-amber-500 text-sm font-medium">{{ $t('home.platformBadge') }}</span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {{ $t('home.heroTitle1') }} <span class="text-amber-500">{{ $t('home.heroTitle2') }}</span>
              <br />
              {{ $t('home.heroTitle3') }} <span class="text-amber-500">{{ $t('home.heroTitle4') }}</span>
            </h1>

            <p class="text-xl text-gray-400 mb-8 max-w-lg">
              {{ $t('home.heroDescription') }}
            </p>

            <div class="flex flex-wrap gap-4">
              <UButton to="/auth/register" color="primary" size="xl" class="font-semibold">
                {{ $t('common.getStarted') }}
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
              <UButton to="/support/faq" color="neutral" variant="outline" size="xl">
                {{ $t('common.learnMore') }}
              </UButton>
            </div>

            <!-- Quick Stats -->
            <div class="flex flex-wrap gap-8 mt-12">
              <div>
                <p class="text-3xl font-bold text-white">$10M+</p>
                <p class="text-gray-500">{{ $t('home.tradingVolume') }}</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-white">50K+</p>
                <p class="text-gray-500">{{ $t('home.users') }}</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-white">99.9%</p>
                <p class="text-gray-500">{{ $t('home.uptime') }}</p>
              </div>
            </div>
          </div>

          <!-- Hero Image/Chart -->
          <div class="relative">
            <div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">Au</span>
                  </div>
                  <span class="text-white font-bold">XAU/USD</span>
                </div>
                <span :class="goldPrice.change24h >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium">
                  {{ goldPrice.change24h >= 0 ? '+' : '' }}{{ goldPrice.change24h }}%
                </span>
              </div>
              
              <!-- Mini chart placeholder -->
              <div class="h-48 bg-gradient-to-t from-amber-500/20 to-transparent rounded-lg flex items-end justify-center">
                <svg viewBox="0 0 400 100" class="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,40 C350,30 380,20 400,25"
                    fill="none"
                    stroke="url(#gradient)"
                    stroke-width="3"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#f59e0b" />
                      <stop offset="100%" stop-color="#d97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div class="flex items-center justify-between mt-4">
                <div>
                  <p class="text-gray-400 text-sm">{{ $t('home.currentPrice') }}</p>
                  <p class="text-2xl font-bold text-white">${{ formatPrice(goldPrice.price) }}</p>
                  <p class="text-gray-500 text-xs">{{ $t('home.perOunce') }}</p>
                </div>
                <NuxtLink to="/auth/register" class="text-white hover:text-amber-500 text-sm font-medium transition-colors">
                  {{ $t('common.tradeNow') }}
                </NuxtLink>
              </div>
            </div>

            <!-- Floating cards -->
            <div class="absolute -top-4 -right-4 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 animate-bounce">
              <span class="text-green-500 font-medium">+$1,234</span>
            </div>
            <div class="absolute -bottom-4 -left-4 bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
              <span class="text-purple-500 font-medium">Copy Trade Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-950">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            {{ $t('home.whyChoose') }}
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            {{ $t('home.whyChooseDesc') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-chart-bar" class="w-7 h-7 text-amber-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.featRealtimeTitle') }}</h3>
            <p class="text-gray-400">{{ $t('home.featRealtimeDesc') }}</p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-document-duplicate" class="w-7 h-7 text-blue-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.featCopyTradeTitle') }}</h3>
            <p class="text-gray-400">{{ $t('home.featCopyTradeDesc') }}</p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-shield-check" class="w-7 h-7 text-green-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.featSecurityTitle') }}</h3>
            <p class="text-gray-400">{{ $t('home.featSecurityDesc') }}</p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-gift" class="w-7 h-7 text-purple-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.featReferralTitle') }}</h3>
            <p class="text-gray-400">{{ $t('home.featReferralDesc') }}</p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-bolt" class="w-7 h-7 text-red-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.featFastTitle') }}</h3>
            <p class="text-gray-400">{{ $t('home.featFastDesc') }}</p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-7 h-7 text-cyan-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.featSupportTitle') }}</h3>
            <p class="text-gray-400">{{ $t('home.featSupportDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            {{ $t('home.howItWorks') }}
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            {{ $t('home.howItWorksDesc') }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              1
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.step1Title') }}</h3>
            <p class="text-gray-400">
              {{ $t('home.step1Desc') }}
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              2
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.step2Title') }}</h3>
            <p class="text-gray-400">
              {{ $t('home.step2Desc') }}
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              3
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ $t('home.step3Title') }}</h3>
            <p class="text-gray-400">
              {{ $t('home.step3Desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-amber-600 to-amber-700">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
          {{ $t('home.readyToStart') }}
        </h2>
        <p class="text-amber-100 text-xl mb-8 max-w-2xl mx-auto">
          {{ $t('home.readyToStartDesc') }}
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton to="/auth/register" color="primary" size="xl" class="font-semibold">
            {{ $t('home.createFreeAccount') }}
          </UButton>
          <UButton to="/auth/login" variant="outline" size="xl" class="!text-white !border-white">
            {{ $t('auth.hasAccount') }} {{ $t('auth.login') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-gray-950">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Users Say About IC-Gold
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div class="flex items-center gap-1 mb-4">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-5 h-5 text-amber-500" />
            </div>
            <p class="text-gray-300 mb-6">
              "IC-Gold's Copy Trade is really effective. I increased my profit by 30% in the first month without doing much."
            </p>
            <div class="flex items-center gap-3">
              <UAvatar alt="John D" class="bg-amber-500" />
              <div>
                <p class="text-white font-medium">John D.</p>
                <p class="text-gray-500 text-sm">Individual Investor</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div class="flex items-center gap-1 mb-4">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-5 h-5 text-amber-500" />
            </div>
            <p class="text-gray-300 mb-6">
              "Easy to use interface, fast deposits and withdrawals. Support team is very responsive and professional."
            </p>
            <div class="flex items-center gap-3">
              <UAvatar alt="Sarah M" class="bg-purple-500" />
              <div>
                <p class="text-white font-medium">Sarah M.</p>
                <p class="text-gray-500 text-sm">Trader</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div class="flex items-center gap-1 mb-4">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-5 h-5 text-amber-500" />
            </div>
            <p class="text-gray-300 mb-6">
              "IC-Gold's referral program is great. I earned an extra $500 just from referring friends."
            </p>
            <div class="flex items-center gap-3">
              <UAvatar alt="Mike R" class="bg-green-500" />
              <div>
                <p class="text-white font-medium">Mike R.</p>
                <p class="text-gray-500 text-sm">Affiliate Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gold Image Section -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800"
              alt="Gold Investment"
              class="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
              {{ $t('home.goldSectionTitle') }}
            </h2>
            <p class="text-gray-400 text-lg mb-6">
              {{ $t('home.goldSectionDesc') }}
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                {{ $t('home.goldFeature1') }}
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                {{ $t('home.goldFeature2') }}
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                {{ $t('home.goldFeature3') }}
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                {{ $t('home.goldFeature4') }}
              </li>
            </ul>
            <UButton to="/auth/register" color="primary" size="lg">
              {{ $t('home.signUpNow') }}
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Homepage - landing page for IC-Gold

// Gold price state
const goldPrice = ref({
  price: 2650,
  change24h: 0.75
})

// Format price with commas
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Fetch gold price
async function fetchGoldPrice() {
  try {
    const data = await $fetch('/api/gold/price')
    goldPrice.value = {
      price: data.price,
      change24h: data.change24h
    }
  } catch (e) {
    console.error('Failed to fetch gold price:', e)
  }
}

// Fetch on mount and refresh every 60 seconds
onMounted(() => {
  fetchGoldPrice()
  setInterval(fetchGoldPrice, 60000)
})
</script>
