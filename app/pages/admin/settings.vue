<template>
  <div class="p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Cài đặt hệ thống</h1>
      <p class="text-gray-300">Cấu hình các thông số hệ thống</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-gray-500 animate-spin"
      />
    </div>

    <div v-else class="space-y-6">
      <!-- Cài đặt giao dịch -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-banknotes"
                class="w-5 h-5 text-green-500"
              />
            </div>
            <h3 class="text-white font-semibold">Cài đặt giao dịch</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Nạp tối thiểu ($)</label
              >
              <input
                v-model="settings.min_deposit"
                type="number"
                placeholder="10"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Rút tối thiểu ($)</label
              >
              <input
                v-model="settings.min_withdraw"
                type="number"
                placeholder="50"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Cài đặt giới thiệu -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center"
            >
              <UIcon name="i-heroicons-gift" class="w-5 h-5 text-purple-500" />
            </div>
            <h3 class="text-white font-semibold">Cài đặt giới thiệu</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Thưởng giới thiệu ($)</label
              >
              <input
                v-model="settings.referral_bonus"
                type="number"
                placeholder="10"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Số lần giới thiệu tối đa</label
              >
              <input
                v-model="settings.max_referral_uses"
                type="number"
                placeholder="10"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Cài đặt Copy Trade -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-chart-bar"
                class="w-5 h-5 text-blue-500"
              />
            </div>
            <h3 class="text-white font-semibold">Cài đặt Copy Trade</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Số dư tối thiểu cho Copy Trade ($)</label
              >
              <input
                v-model="settings.copy_trade_min_balance"
                type="number"
                placeholder="1000"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Phần trăm Copy Trade mặc định (%)</label
              >
              <input
                v-model="settings.copy_trade_percentage"
                type="number"
                placeholder="5"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Thông tin website -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-globe-alt"
                class="w-5 h-5 text-cyan-500"
              />
            </div>
            <h3 class="text-white font-semibold">Thông tin website</h3>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Tên website</label
            >
            <input
              v-model="settings.site_name"
              placeholder="IC-Gold"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Mô tả</label
            >
            <textarea
              v-model="settings.site_description"
              placeholder="Mô tả website..."
              rows="3"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
            ></textarea>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Email hỗ trợ</label
              >
              <input
                v-model="settings.support_email"
                placeholder="support@example.com"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Link Telegram hỗ trợ</label
              >
              <input
                v-model="settings.telegram_link"
                placeholder="https://t.me/..."
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button
          @click="saveSettings"
          :disabled="saving"
          class="px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <UIcon
            v-if="saving"
            name="i-heroicons-arrow-path"
            class="w-5 h-5 animate-spin"
          />
          <UIcon v-else name="i-heroicons-check" class="w-5 h-5" />
          Lưu cài đặt
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin" });
const { getSettings, updateSettings } = useAdmin();
const loading = ref(true);
const saving = ref(false);
const settings = ref<Record<string, string>>({
  trc20_wallet_address: "",
  min_deposit: "10",
  min_withdraw: "50",
  referral_bonus: "10",
  max_referral_uses: "10",
  copy_trade_min_balance: "1000",
  copy_trade_percentage: "5",
  site_name: "IC-Gold",
  site_description: "",
  support_email: "",
  telegram_link: "",
});

onMounted(async () => {
  try {
    const data = await getSettings();
    if (data) settings.value = { ...settings.value, ...data };
  } catch {
  } finally {
    loading.value = false;
  }
});
async function saveSettings() {
  saving.value = true;
  try {
    await updateSettings(settings.value);
  } catch {
  } finally {
    saving.value = false;
  }
}
</script>
