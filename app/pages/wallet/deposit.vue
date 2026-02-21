<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ $t('wallet.depositTitle') }}</h1>
        <p class="text-gray-400">{{ $t('wallet.depositDesc') }}</p>
      </div>

      <!-- Step 1: QR Code & Address -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden mb-6"
      >
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold"
            >
              1
            </div>
            <div>
              <h3 class="text-white font-semibold">
                Gửi USDT đến địa chỉ này
              </h3>
              <p class="text-gray-500 text-sm">
                Quét mã QR hoặc sao chép địa chỉ ví
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div
            v-if="loadingAddress"
            class="flex items-center justify-center py-8"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-8 h-8 text-gray-500 animate-spin"
            />
          </div>

          <div v-else-if="depositAddress" class="space-y-4">
            <div class="bg-white p-4 rounded-xl w-fit mx-auto">
              <img
                :src="`/IC-Gold-TRC20/${depositAddress.address}.jpg`"
                :alt="depositAddress.address"
                class="w-48 h-48 rounded object-contain"
                @error="handleQrError"
              />
            </div>

            <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Địa chỉ ví TRC20 & BEP20:</p>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-amber-500 font-medium break-all">{{
                  depositAddress.address
                }}</code>
                <button
                  @click="copyAddress"
                  class="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  title="Copy address"
                >
                  <UIcon
                    name="i-heroicons-clipboard-document"
                    class="w-5 h-5 text-white"
                  />
                </button>
              </div>
            </div>

            <div
              class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4"
            >
              <div class="flex gap-3">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="text-amber-500 font-semibold mb-1">{{ $t('wallet.importantNotes') }}</p>
                  <p class="text-gray-300 text-sm">
                    {{ $t('wallet.note1') }}. {{ $t('wallet.note4') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Transaction Details -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden mb-6"
      >
        <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold"
            >
              2
            </div>
            <div>
              <h3 class="text-white font-semibold">
                Nhập thông tin giao dịch
              </h3>
              <p class="text-gray-500 text-sm">
                Điền số tiền và mã hash giao dịch
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <form @submit.prevent="onSubmit" class="space-y-5">
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300"
                  >Số tiền (USDT)</label
                >
                <span class="text-gray-500 text-sm">Tối thiểu: $10</span>
              </div>
              <input
                v-model.number="state.amount"
                type="number"
                placeholder="100"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-300"
                  >Email</label
                >
                <span class="text-gray-500 text-sm"
                  >Để được xác thực nhanh chóng</span
                >
              </div>
              <input
                v-model="state.txHash"
                type="text"
                placeholder="Nhập email để được xác thực nhanh chóng"
                class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              :disabled="submitting || !state.amount || !state.txHash"
              class="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <UIcon
                v-if="submitting"
                name="i-heroicons-arrow-path"
                class="w-5 h-5 animate-spin"
              />
              <UIcon v-else name="i-heroicons-arrow-up-tray" class="w-5 h-5" />
              Xác nhận Nạp tiền
            </button>
          </form>
        </div>
      </div>

      <!-- How to Deposit -->
      <div
        class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6"
      >
        <h4 class="text-white font-semibold mb-4 flex items-center gap-2">
          <UIcon
            name="i-heroicons-question-mark-circle"
            class="w-5 h-5 text-amber-500"
          />
          Hướng dẫn nạp tiền
        </h4>
        <ol class="space-y-3 text-gray-300">
          <li class="flex gap-3">
            <span class="text-amber-500 font-bold">1.</span>Sao chép địa chỉ ví TRC20 & BEP20 ở trên
          </li>
          <li class="flex gap-3">
            <span class="text-amber-500 font-bold">2.</span>Mở ví của bạn và chọn gửi USDT qua mạng TRC20 & BEP20
          </li>
          <li class="flex gap-3">
            <span class="text-amber-500 font-bold">3.</span>Dán địa chỉ ví và nhập số tiền
          </li>
          <li class="flex gap-3">
            <span class="text-amber-500 font-bold">4.</span>Xác nhận giao dịch và đợi xử lý (thường 1-5 phút)
          </li>
          <li class="flex gap-3">
            <span class="text-amber-500 font-bold">5.</span>Sao chép Transaction Hash (TxID) và nhập vào form ở trên
          </li>
          <li class="flex gap-3">
            <span class="text-amber-500 font-bold">6.</span>Admin sẽ xác minh và cộng tiền vào tài khoản trong vòng 24h
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const toast = useToastCustom();
const { getDepositAddress, requestDeposit } = useWallet();
const loadingAddress = ref(true);
const submitting = ref(false);
const depositAddress = ref<{ address: string; network: string } | null>(null);
const state = reactive({ amount: null as number | null, txHash: "" });

onMounted(async () => {
  try {
    const addressResult = await getDepositAddress();
    depositAddress.value = addressResult ?? { address: '', network: '' };
  } catch {
    toast.error("Lỗi", "Không thể tải địa chỉ nạp tiền");
  } finally {
    loadingAddress.value = false;
  }
});

async function copyAddress() {
  if (!depositAddress.value) return;
  await navigator.clipboard.writeText(depositAddress.value.address);
  toast.success("Đã sao chép địa chỉ");
}

function handleQrError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="%23ccc"><rect width="192" height="192"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12">QR Code</text></svg>';
}

async function onSubmit() {
  if (!state.amount || !state.txHash) return;
  submitting.value = true;
  try {
    await requestDeposit(state.amount, state.txHash);
    state.amount = null;
    state.txHash = "";
  } catch {
  } finally {
    submitting.value = false;
  }
}
</script>
