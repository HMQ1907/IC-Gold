<template>
  <footer class="bg-gray-900 border-t border-gray-800 hidden lg:block">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <img src="/IC-Gold-TRC20 & BEP20/logo.png" alt="IC-Gold" class="w-10 h-10 rounded-lg object-cover" />
            <span class="text-xl font-bold text-white">IC-Gold</span>
          </NuxtLink>
          <p class="text-gray-400 mb-4 max-w-md">
            {{ $t('footer.description') }}
          </p>
          <div class="flex gap-4">
            <a :href="telegramLink" target="_blank" rel="noopener noreferrer">
              <UButton color="neutral" variant="ghost" icon="i-simple-icons-telegram" size="lg" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('footer.quickLinks') }}</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/dashboard" class="text-gray-400 hover:text-amber-500 transition-colors">
                {{ $t('nav.dashboard') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/trade" class="text-gray-400 hover:text-amber-500 transition-colors">
                {{ $t('nav.trade') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/wallet/deposit" class="text-gray-400 hover:text-amber-500 transition-colors">
                {{ $t('nav.deposit') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/referral" class="text-gray-400 hover:text-amber-500 transition-colors">
                {{ $t('nav.referral') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('footer.support') }}</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/support/faq" class="text-gray-400 hover:text-amber-500 transition-colors">
                {{ $t('nav.faq') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/support/legal" class="text-gray-400 hover:text-amber-500 transition-colors">
                {{ $t('support.legalDocuments') }}
              </NuxtLink>
            </li>
            <li>
              <a :href="telegramLink" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                <UIcon name="i-simple-icons-telegram" class="w-4 h-4" />
                {{ $t('support.contact') }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-500 text-sm">
          © 2024 IC-Gold. {{ $t('footer.allRightsReserved') }}
        </p>
        <p class="text-gray-600 text-xs">
          {{ locale === 'vi' ? 'Đầu tư IC-Gold có rủi ro. Vui lòng cân nhắc kỹ trước khi đầu tư.' : 'IC-Gold investment carries risks. Please consider carefully before investing.' }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const runtimeConfig = useRuntimeConfig()
const telegramLink = computed(() => runtimeConfig.public.telegramSupportLink || 'https://t.me/ic_gold_support')
</script>
