<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Referral Program</h1>
      <p class="text-gray-400">
        Refer friends and earn $10 for each successful registration
      </p>
    </div>

    <div
      class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 mb-6"
    >
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <p class="text-purple-200 text-sm mb-1">Your Referral Code</p>
          <p class="text-3xl font-bold text-white tracking-wider">
            {{ stats?.referralCode || "..." }}
          </p>
          <p class="text-purple-200 text-sm mt-2">
            {{ stats?.usesRemaining || 0 }}/{{ stats?.maxUses || 10 }} uses
            remaining
          </p>
        </div>
        <div class="flex gap-2">
          <UButton color="neutral" @click="copyCode"
            ><UIcon
              name="i-heroicons-clipboard-document"
              class="w-5 h-5 mr-2"
            />Copy Code</UButton
          >
          <UButton
            color="neutral"
            variant="outline"
            class="!text-white !border-white/50"
            @click="shareLink"
            ><UIcon
              name="i-heroicons-share"
              class="w-5 h-5 mr-2"
            />Share</UButton
          >
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p class="text-gray-400 text-xs">Total Referrals</p>
            <p class="text-white font-bold text-xl">
              {{ stats?.totalReferrals || 0 }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-green-500"
            />
          </div>
          <div>
            <p class="text-gray-400 text-xs">Bonus Received</p>
            <p class="text-white font-bold text-xl">
              {{ stats?.paidReferrals || 0 }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-currency-dollar"
              class="w-5 h-5 text-amber-500"
            />
          </div>
          <div>
            <p class="text-gray-400 text-xs">Total Bonus</p>
            <p class="text-white font-bold text-xl">
              ${{ stats?.totalBonus || 0 }}
            </p>
          </div>
        </div>
      </div>
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center"
          >
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p class="text-gray-400 text-xs">Pending</p>
            <p class="text-white font-bold text-xl">
              ${{ stats?.pendingBonus || 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
      <h3 class="text-white font-semibold mb-6">How It Works</h3>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="text-center">
          <div
            class="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UIcon name="i-heroicons-share" class="w-8 h-8 text-purple-500" />
          </div>
          <h4 class="text-white font-medium mb-2">1. Share Code</h4>
          <p class="text-gray-400 text-sm">
            Send your referral code or link to friends
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UIcon name="i-heroicons-user-plus" class="w-8 h-8 text-blue-500" />
          </div>
          <h4 class="text-white font-medium mb-2">2. Friends Sign Up</h4>
          <p class="text-gray-400 text-sm">
            Friends register an account using your code
          </p>
        </div>
        <div class="text-center">
          <div
            class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UIcon name="i-heroicons-gift" class="w-8 h-8 text-green-500" />
          </div>
          <h4 class="text-white font-medium mb-2">3. Get Rewarded</h4>
          <p class="text-gray-400 text-sm">
            Earn $10 when friends make their first deposit
          </p>
        </div>
      </div>
    </div>

    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div class="p-4 border-b border-gray-800">
        <h3 class="text-white font-semibold">Referral History</h3>
      </div>
      <div v-if="loading" class="p-8 text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 text-gray-500 animate-spin"
        />
      </div>
      <div v-else-if="!stats?.referrals?.length" class="p-8 text-center">
        <UIcon
          name="i-heroicons-users"
          class="w-12 h-12 text-gray-600 mx-auto mb-3"
        />
        <p class="text-gray-500">No referrals yet</p>
      </div>
      <div v-else class="divide-y divide-gray-800">
        <div
          v-for="ref in stats.referrals"
          :key="ref.id"
          class="p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="ref.referred?.fullName || ref.referred?.email || ''"
              size="sm"
              class="bg-gray-700"
            />
            <div>
              <p class="text-white font-medium">
                {{
                  ref.referred?.fullName || maskEmail(ref.referred?.email || "")
                }}
              </p>
              <p class="text-gray-500 text-sm">
                {{ formatDate(ref.createdAt) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-green-500 font-semibold">+${{ ref.bonusAmount }}</p>
            <UBadge
              :color="ref.bonusPaid ? 'success' : 'warning'"
              variant="subtle"
              size="xs"
              >{{ ref.bonusPaid ? "Received" : "Pending" }}</UBadge
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
const toast = useToastCustom();

interface ReferralStats {
  referralCode: string;
  usesRemaining: number;
  maxUses: number;
  currentUses: number;
  totalReferrals: number;
  paidReferrals: number;
  totalBonus: number;
  pendingBonus: number;
  referrals: Array<{
    id: number;
    bonusAmount: number;
    bonusPaid: boolean;
    createdAt: string;
    referred: {
      email: string;
      fullName: string | null;
      createdAt: string;
    } | null;
  }>;
}

const loading = ref(true);
const stats = ref<ReferralStats | null>(null);
const referralLink = computed(() => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/auth/register?ref=${stats.value?.referralCode || ""}`;
});

onMounted(async () => {
  try {
    const { data } = await useFetch<ReferralStats>("/api/referral/stats");
    if (data.value) stats.value = data.value;
  } catch {
  } finally {
    loading.value = false;
  }
});

async function copyCode() {
  if (!stats.value?.referralCode) return;
  await navigator.clipboard.writeText(stats.value.referralCode);
  toast.success("Referral code copied");
}
async function copyLink() {
  await navigator.clipboard.writeText(referralLink.value);
  toast.success("Referral link copied");
}
async function shareLink() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Join IC-Gold",
        text: `Sign up for IC-Gold with referral code ${stats.value?.referralCode}!`,
        url: referralLink.value,
      });
    } catch {}
  } else {
    copyLink();
  }
}
function maskEmail(email: string): string {
  if (!email) return "";
  const [local, domain] = email.split("@");
  return local.length <= 2
    ? `${local[0]}***@${domain}`
    : `${local[0]}${local[1]}***@${domain}`;
}
function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}
</script>
