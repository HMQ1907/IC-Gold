<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-white mb-4">{{ $t('support.terms') }}</h1>
        <p class="text-gray-400">{{ $t('support.termsContent.lastUpdated') }}: {{ lastUpdated }}</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 class="text-xl font-bold text-white mt-8 mb-4">1. {{ $t('support.termsContent.introTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.introDesc') }}</p>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">2. {{ $t('support.termsContent.useTitle') }}</h2>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>{{ $t('support.termsContent.useItem1') }}</li>
          <li>{{ $t('support.termsContent.useItem2') }}</li>
          <li>{{ $t('support.termsContent.useItem3') }}</li>
          <li>{{ $t('support.termsContent.useItem4') }}</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">3. {{ $t('support.termsContent.servicesTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.servicesDesc') }}</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>{{ $t('support.termsContent.servicesItem1') }}</li>
          <li>{{ $t('support.termsContent.servicesItem2') }}</li>
          <li>{{ $t('support.termsContent.servicesItem3') }}</li>
          <li>{{ $t('support.termsContent.servicesItem4') }}</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">4. {{ $t('support.termsContent.transactionsTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.transactionsDesc') }}</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>{{ $t('support.termsContent.transactionsItem1') }}</li>
          <li>{{ $t('support.termsContent.transactionsItem2') }}</li>
          <li>{{ $t('support.termsContent.transactionsItem3') }}</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">5. {{ $t('support.termsContent.risksTitle') }}</h2>
        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-4">
          <p class="text-red-400 font-semibold mb-2">{{ $t('support.termsContent.riskWarning') }}:</p>
          <p class="text-red-300">{{ $t('support.termsContent.riskDesc') }}</p>
        </div>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">6. {{ $t('support.termsContent.copyTradeTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.copyTradeDesc') }}</p>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">7. {{ $t('support.termsContent.referralTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.referralDesc') }}</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>{{ $t('support.termsContent.referralItem1') }}</li>
          <li>{{ $t('support.termsContent.referralItem2') }}</li>
          <li>{{ $t('support.termsContent.referralItem3') }}</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">8. {{ $t('support.termsContent.securityTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.securityDesc') }}</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>{{ $t('support.termsContent.securityItem1') }}</li>
          <li>{{ $t('support.termsContent.securityItem2') }}</li>
          <li>{{ $t('support.termsContent.securityItem3') }}</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">9. {{ $t('support.termsContent.liabilityTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.liabilityDesc') }}</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>{{ $t('support.termsContent.liabilityItem1') }}</li>
          <li>{{ $t('support.termsContent.liabilityItem2') }}</li>
          <li>{{ $t('support.termsContent.liabilityItem3') }}</li>
          <li>{{ $t('support.termsContent.liabilityItem4') }}</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">10. {{ $t('support.termsContent.changesTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.changesDesc') }}</p>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">11. {{ $t('support.termsContent.contactTitle') }}</h2>
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.contactDesc') }}</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Email: support@ic-gold.com</li>
          <li>Telegram: @icgold_support</li>
        </ul>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-400 mb-4">{{ $t('support.termsContent.agreementNote') }}</p>
        <UButton to="/auth/register" color="primary" size="lg">{{ $t('home.signUpNow') }}</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const lastUpdated = computed(() => {
  const format = locale.value === 'vi' ? 'vi-VN' : 'en-US'
  return new Intl.DateTimeFormat(format, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())
})
</script>
