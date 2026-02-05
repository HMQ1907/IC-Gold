<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <UIcon name="i-heroicons-language" class="w-5 h-5" />
      <span class="hidden sm:block text-sm">{{ currentLocaleName }}</span>
      <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          @click="switchLocale(loc.code)"
          class="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left cursor-pointer"
          :class="{ 'bg-amber-500/10 text-amber-500': locale === loc.code }"
        >
          <span class="text-lg">{{ loc.flag }}</span>
          <span>{{ loc.name }}</span>
          <UIcon
            v-if="locale === loc.code"
            name="i-heroicons-check"
            class="w-4 h-4 ml-auto"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
  return (locales.value as Array<{ code: string; name: string }>).map((loc) => ({
    ...loc,
    flag: loc.code === 'en' ? '🇺🇸' : '🇻🇳'
  }))
})

const currentLocaleName = computed(() => {
  const current = availableLocales.value.find((l) => l.code === locale.value)
  return current?.name || 'English'
})

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function switchLocale(code: string) {
  setLocale(code)
  dropdownOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}
</script>
