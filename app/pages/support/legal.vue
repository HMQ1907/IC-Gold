<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
          <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-amber-500" />
          <span class="text-amber-400 font-medium text-sm">{{ $t('support.legalDocuments') }}</span>
        </div>
        <h1 class="text-3xl lg:text-4xl font-bold text-white mb-4">{{ $t('support.legalTitle') }}</h1>
        <p class="text-gray-400 max-w-2xl mx-auto">{{ $t('support.legalDesc') }}</p>
      </div>

      <!-- Legal Documents Grid -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Document 1 -->
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors">
          <div class="overflow-hidden">
            <img 
              src="/IC-Gold-TRC20 & BEP20/phaply1.jpg" 
              alt="Legal Document 1"
              class="w-full h-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
              @click="openImage('/IC-Gold-TRC20 & BEP20/phaply1.jpg')"
            />
          </div>
          <div class="p-6">
            <h3 class="text-white font-semibold text-lg mb-2">{{ $t('support.legalDoc1Title') }}</h3>
            <p class="text-gray-400 text-sm">{{ $t('support.legalDoc1Desc') }}</p>
          </div>
        </div>

        <!-- Document 2 -->
        <div class="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors">
          <div class="overflow-hidden">
            <img 
              src="/IC-Gold-TRC20 & BEP20/phaply2.jpg" 
              alt="Legal Document 2"
              class="w-full h-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
              @click="openImage('/IC-Gold-TRC20 & BEP20/phaply2.jpg')"
            />
          </div>
          <div class="p-6">
            <h3 class="text-white font-semibold text-lg mb-2">{{ $t('support.legalDoc2Title') }}</h3>
            <p class="text-gray-400 text-sm">{{ $t('support.legalDoc2Desc') }}</p>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 class="text-white font-semibold text-lg mb-2">{{ $t('support.legalInfoTitle') }}</h3>
            <p class="text-gray-400 leading-relaxed">{{ $t('support.legalInfoDesc') }}</p>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-8 text-center">
        <UButton to="/" color="neutral" variant="outline" size="lg">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 mr-2" />
          {{ $t('common.backToHome') }}
        </UButton>
      </div>
    </div>

    <!-- Image Modal -->
    <UModal v-model:open="showModal">
      <template #content>
        <div class="p-2 bg-gray-900">
          <img :src="selectedImage" alt="Legal Document" class="w-full h-auto rounded-lg" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const showModal = ref(false)
const selectedImage = ref('')

function openImage(src: string) {
  selectedImage.value = src
  showModal.value = true
}
</script>
