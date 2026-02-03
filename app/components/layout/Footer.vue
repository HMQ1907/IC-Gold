<template>
  <footer class="bg-gray-900 border-t border-gray-800 hidden lg:block">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <NuxtLink to="/" class="flex items-center gap-2 mb-4">
            <img src="/IC-Gold-TRC20/logo.png" alt="IC-Gold" class="w-10 h-10 rounded-lg object-cover" />
            <span class="text-xl font-bold text-white">IC-Gold</span>
          </NuxtLink>
          <p class="text-gray-400 mb-4 max-w-md">
            Leading crypto investment platform with advanced technology, 
            high security and attractive returns.
          </p>
          <div class="flex gap-4">
            <a :href="telegramLink" target="_blank" rel="noopener noreferrer">
              <UButton color="neutral" variant="ghost" icon="i-simple-icons-telegram" size="lg" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/dashboard" class="text-gray-400 hover:text-amber-500 transition-colors">
                Dashboard
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/trade" class="text-gray-400 hover:text-amber-500 transition-colors">
                Trade
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/wallet/deposit" class="text-gray-400 hover:text-amber-500 transition-colors">
                Deposit
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/referral" class="text-gray-400 hover:text-amber-500 transition-colors">
                Referral
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-white font-semibold mb-4">Support</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/support/faq" class="text-gray-400 hover:text-amber-500 transition-colors">
                FAQ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/support/terms" class="text-gray-400 hover:text-amber-500 transition-colors">
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <a :href="telegramLink" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2">
                <UIcon name="i-simple-icons-telegram" class="w-4 h-4" />
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-500 text-sm">
          © 2024 IC-Gold. All rights reserved.
        </p>
        <p class="text-gray-600 text-xs">
          Crypto investment carries risks. Please consider carefully before investing.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const telegramLink = computed(() => runtimeConfig.public.telegramSupportLink || 'https://t.me/ic_gold_support')
</script>
