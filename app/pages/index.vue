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

    <!-- Next Generation Platform -->
    <section class="py-20 bg-gray-950">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
              <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-amber-500" />
              <span class="text-amber-400 font-medium text-sm">{{ $t('home.nextGenBadge') }}</span>
            </div>
            <h2 class="text-3xl lg:text-5xl font-bold text-white mb-6">
              {{ $t('home.nextGenTitle') }}
            </h2>
            <p class="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto">
              {{ $t('home.nextGenDesc') }}
            </p>
          </div>

          <!-- Features Grid -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div class="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300">
              <div class="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-amber-500" />
              </div>
              <h3 class="text-white font-semibold text-lg mb-2">{{ $t('home.nextGenFeature1Title') }}</h3>
              <p class="text-gray-400 text-sm">{{ $t('home.nextGenFeature1Desc') }}</p>
            </div>

            <div class="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300">
              <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <UIcon name="i-heroicons-adjustments-horizontal" class="w-6 h-6 text-blue-500" />
              </div>
              <h3 class="text-white font-semibold text-lg mb-2">{{ $t('home.nextGenFeature2Title') }}</h3>
              <p class="text-gray-400 text-sm">{{ $t('home.nextGenFeature2Desc') }}</p>
            </div>

            <div class="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300">
              <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-green-500" />
              </div>
              <h3 class="text-white font-semibold text-lg mb-2">{{ $t('home.nextGenFeature3Title') }}</h3>
              <p class="text-gray-400 text-sm">{{ $t('home.nextGenFeature3Desc') }}</p>
            </div>
          </div>

          <!-- Account Types -->
          <div class="bg-gradient-to-r from-amber-500/10 via-gray-900 to-amber-500/10 border border-amber-500/20 rounded-2xl p-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="text-center md:text-left">
                <h3 class="text-white font-bold text-xl mb-2">{{ $t('home.nextGenAccountTitle') }}</h3>
                <p class="text-gray-400">{{ $t('home.nextGenAccountDesc') }}</p>
              </div>
              <div class="flex items-center gap-4">
                <div class="bg-amber-500/20 border border-amber-500/30 rounded-xl px-6 py-3 text-center">
                  <span class="text-amber-400 font-bold">Raw Spread</span>
                </div>
                <div class="bg-blue-500/20 border border-blue-500/30 rounded-xl px-6 py-3 text-center">
                  <span class="text-blue-400 font-bold">{{ $t('home.standardAccount') }}</span>
                </div>
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

    <!-- IC Markets Partnership Section -->
    <section class="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-amber-500" />
            <span class="text-amber-500 text-sm font-medium">{{ $t('home.partnerTitle') }}</span>
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            {{ $t('home.partnerSubtitle') }}
          </h2>
        </div>

        <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <!-- IC Markets Logo & Info -->
          <div class="relative">
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <span class="text-white font-bold text-2xl">IC</span>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">IC Markets</h3>
                  <p class="text-gray-400">{{ $t('home.globalPartner') }}</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <p class="text-gray-300 leading-relaxed">
                  {{ $t('home.partnerDesc1') }}
                </p>
                <p class="text-gray-300 leading-relaxed">
                  {{ $t('home.partnerDesc2') }}
                </p>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-700">
                <div class="text-center">
                  <p class="text-3xl font-bold text-amber-500">10+</p>
                  <p class="text-gray-400 text-sm">{{ $t('home.yearsExperience') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-3xl font-bold text-amber-500">500K+</p>
                  <p class="text-gray-400 text-sm">{{ $t('home.globalInvestors') }}</p>
                </div>
                <div class="text-center">
                  <p class="text-3xl font-bold text-amber-500">95%+</p>
                  <p class="text-gray-400 text-sm">{{ $t('home.accuracy') }}</p>
                </div>
              </div>
            </div>

            <!-- Floating badge -->
            <div class="absolute -top-4 -right-4 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
              <span class="text-green-500 font-medium flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {{ $t('home.fsaRegulated') }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <div class="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6 text-blue-500" />
                </div>
                <h3 class="text-xl font-bold text-white">{{ $t('home.hftTitle') }}</h3>
              </div>
              <p class="text-gray-300 leading-relaxed mb-6">
                {{ $t('home.partnerDesc3') }}
              </p>
              
              <ul class="space-y-3">
                <li class="flex items-center gap-3 text-gray-300">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 shrink-0" />
                  <span>{{ $t('home.hftFeature1') }}</span>
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 shrink-0" />
                  <span>{{ $t('home.hftFeature2') }}</span>
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 shrink-0" />
                  <span>{{ $t('home.hftFeature3') }}</span>
                </li>
                <li class="flex items-center gap-3 text-gray-300">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 shrink-0" />
                  <span>{{ $t('home.hftFeature4') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Legal Disclaimer Section -->
    <section class="py-16 bg-gray-950 border-t border-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-3 mb-8">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-gray-400" />
            <h3 class="text-xl font-bold text-white">{{ $t('home.legalTitle') }}</h3>
          </div>

          <div class="space-y-6 text-sm text-gray-400 leading-relaxed">
            <!-- License Info -->
            <div class="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div class="flex items-start gap-3">
                <UIcon name="i-heroicons-building-library" class="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <p>
                  {{ $t('home.legalLicense') }}
                  <NuxtLink to="/support/legal" class="text-amber-400 hover:text-amber-300 font-medium ml-1">
                    ({{ $t('support.legalDocuments') }})
                  </NuxtLink>
                </p>
              </div>
            </div>

            <!-- Long-term Development -->
            <div class="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
              <div class="flex items-start gap-3">
                <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p class="text-amber-400 font-semibold mb-2">{{ $t('home.riskWarning') }}</p>
                  <p class="text-gray-400">{{ $t('home.riskWarningText') }}</p>
                </div>
              </div>
            </div>

            <!-- Trading Rewards Policy -->
            <div class="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
              <div class="flex items-start gap-3">
                <UIcon name="i-heroicons-gift" class="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p class="text-green-400 font-semibold mb-3">{{ $t('home.restrictedCountries') }}</p>
                  <div class="space-y-3">
                    <div class="bg-green-500/10 rounded-lg p-3">
                      <p class="text-gray-300 text-sm">{{ $t('home.restrictedCountriesText') }}</p>
                    </div>
                    <div class="bg-green-500/10 rounded-lg p-3">
                      <p class="text-gray-300 text-sm">{{ $t('home.restrictedCountriesText2') }}</p>
                    </div>
                    <div class="bg-green-500/10 rounded-lg p-3">
                      <p class="text-gray-300 text-sm">{{ $t('home.restrictedCountriesText3') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Age Requirement & Disclaimer -->
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                  <p>{{ $t('home.ageRequirement') }}</p>
                </div>
              </div>
              <div class="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
                  <p>{{ $t('home.disclaimer') }}</p>
                </div>
              </div>
            </div>
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
