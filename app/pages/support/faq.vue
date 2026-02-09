<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-white mb-4">{{ $t('support.faq') }}</h1>
        <p class="text-gray-400">{{ $t('support.faqDesc') }}</p>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
        >
          <button
            @click="toggleItem(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/80 transition-colors"
          >
            <span class="font-medium text-white">{{ item.label }}</span>
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="w-5 h-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': openItems.includes(index) }"
            />
          </button>
          <div
            v-show="openItems.includes(index)"
            class="px-6 pb-5 pt-2"
          >
            <div class="bg-gray-900/50 rounded-lg p-4">
              <p class="text-gray-300 leading-relaxed">{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mt-12 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">{{ $t('support.stillNeedHelp') }}</h3>
        <p class="text-gray-400 mb-6">{{ $t('support.supportAvailable') }}</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <UButton
            href="https://t.me/icgold_support"
            target="_blank"
            color="primary"
            size="lg"
            icon="i-simple-icons-telegram"
          >
            {{ $t('support.telegram') }}
          </UButton>
          <UButton
            href="mailto:support@ic-gold.com"
            color="neutral"
            variant="outline"
            size="lg"
            icon="i-heroicons-envelope"
          >
            {{ $t('support.email') }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const openItems = ref<number[]>([])

function toggleItem(index: number) {
  const pos = openItems.value.indexOf(index)
  if (pos === -1) {
    openItems.value.push(index)
  } else {
    openItems.value.splice(pos, 1)
  }
}

const faqItems = computed(() => [
  { label: t('support.faqItems.q1'), content: t('support.faqItems.a1') },
  { label: t('support.faqItems.q2'), content: t('support.faqItems.a2') },
  { label: t('support.faqItems.q3'), content: t('support.faqItems.a3') },
  { label: t('support.faqItems.q4'), content: t('support.faqItems.a4') },
  { label: t('support.faqItems.q5'), content: t('support.faqItems.a5') },
  { label: t('support.faqItems.q6'), content: t('support.faqItems.a6') },
  { label: t('support.faqItems.q7'), content: t('support.faqItems.a7') },
  { label: t('support.faqItems.q8'), content: t('support.faqItems.a8') },
  { label: t('support.faqItems.q9'), content: t('support.faqItems.a9') }
])
</script>
