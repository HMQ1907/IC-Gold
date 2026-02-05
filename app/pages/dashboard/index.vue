<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Welcome -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">
        {{ $t('dashboard.hello') }}, {{ user?.full_name || $t('dashboard.trader') }}! 👋
      </h1>
      <p class="text-gray-400">{{ $t('dashboard.accountOverview') }}</p>
    </div>

    <!-- Balance Card & Quick Actions -->
    <div class="grid lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <DashboardBalanceCard :balance="user?.balance || 0" />
      </div>

      <!-- Quick Actions -->
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 class="text-white font-semibold mb-4">{{ $t('dashboard.quickActions') }}</h3>
        <div class="space-y-3">
          <NuxtLink
            to="/trade"
            class="flex items-center gap-3 w-full px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-white rounded-xl transition-colors cursor-pointer"
          >
            <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-amber-500" />
            <span class="font-medium">{{ $t('dashboard.copyTrade') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/referral"
            class="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            <UIcon name="i-heroicons-gift" class="w-5 h-5 text-purple-500" />
            <span class="font-medium">{{ $t('dashboard.referFriends') }}</span>
          </NuxtLink>
          <NuxtLink
            to="/wallet/history"
            class="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-500" />
            <span class="font-medium">{{ $t('dashboard.transactionHistory') }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="mb-8">
      <DashboardQuickStats
        :total-deposits="stats?.totalDeposits || 0"
        :total-withdrawals="stats?.totalWithdrawals || 0"
        :referral-bonus="stats?.referralBonus || 0"
        :referral-count="user?.referral_uses || 0"
      />
    </div>

    <!-- Chart -->
    <div class="mb-8">
      <DashboardAssetChart />
    </div>

    <!-- Recent Transactions -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div
        class="p-4 border-b border-gray-800 flex items-center justify-between"
      >
        <h3 class="text-white font-semibold">{{ $t('dashboard.recentTransactions') }}</h3>
        <UButton to="/wallet/history" color="neutral" variant="ghost" size="sm">
          {{ $t('common.viewAll') }}
        </UButton>
      </div>

      <div v-if="loading" class="p-8 text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 text-gray-500 animate-spin"
        />
      </div>

      <div
        v-else-if="!transactions?.length"
        class="p-8 text-center text-gray-500"
      >
        {{ $t('dashboard.noTransactions') }}
      </div>

      <div v-else class="divide-y divide-gray-800">
        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="getTransactionStyle(tx.type).bgColor"
            >
              <UIcon
                :name="getTransactionStyle(tx.type).icon"
                class="w-5 h-5"
                :class="getTransactionStyle(tx.type).iconColor"
              />
            </div>
            <div>
              <p class="text-white font-medium">
                {{ getTransactionLabel(tx.type) }}
              </p>
              <p class="text-gray-500 text-sm">
                {{ formatDate(tx.created_at) }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p
              class="font-semibold"
              :class="
                tx.type === 'withdraw' ? 'text-red-500' : 'text-green-500'
              "
            >
              {{ tx.type === "withdraw" ? "-" : "+" }}${{
                tx.amount.toLocaleString()
              }}
            </p>
            <UBadge
              :color="getStatusColor(tx.status)"
              variant="subtle"
              size="xs"
            >
              {{ getStatusLabel(tx.status) }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Gold Image Section -->
    <div
      class="mt-8 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
    >
      <div class="grid lg:grid-cols-2 gap-6 p-6">
        <div class="flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-white mb-4">
            Smart Investing with IC-Gold
          </h3>
          <p class="text-gray-400 mb-6">
            With advanced technology and experienced expert team, IC-Gold brings
            you safe and high-profit investment opportunities. Start your
            investment journey today!
          </p>
          <div class="flex gap-4">
            <NuxtLink to="/trade" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors cursor-pointer">
              {{ $t('dashboard.copyTrade') }}
            </NuxtLink>
            <NuxtLink to="/referral" class="px-6 py-3 border border-gray-600 hover:border-gray-500 text-white font-medium rounded-xl transition-colors cursor-pointer">
              {{ $t('dashboard.referFriends') }}
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600"
            alt="Gold Investment"
            class="rounded-xl max-h-64 object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from "~~/server/utils/supabase";

definePageMeta({
  middleware: "auth",
});

const { user } = useAuth();
const { getTransactions } = useWallet();
const { t } = useI18n();

const loading = ref(true);
const transactions = ref<Transaction[]>([]);
const stats = ref<{
  totalDeposits: number;
  totalWithdrawals: number;
  referralBonus: number;
} | null>(null);

onMounted(async () => {
  try {
    const result = await getTransactions({ limit: 5 });
    transactions.value = result?.data || [];

    const { data: allTx } = await useFetch<{ data: Transaction[] }>(
      "/api/wallet/transactions",
      {
        params: { limit: 1000 },
      },
    );

    if (allTx.value?.data) {
      stats.value = {
        totalDeposits: allTx.value.data
          .filter((t) => t.type === "deposit" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
        totalWithdrawals: allTx.value.data
          .filter((t) => t.type === "withdraw" && t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0),
        referralBonus: allTx.value.data
          .filter((t) => t.type === "referral_bonus")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  } finally {
    loading.value = false;
  }
});

function getTransactionStyle(type: string) {
  const styles: Record<
    string,
    { icon: string; bgColor: string; iconColor: string }
  > = {
    deposit: {
      icon: "i-heroicons-arrow-down-tray",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    withdraw: {
      icon: "i-heroicons-arrow-up-tray",
      bgColor: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    referral_bonus: {
      icon: "i-heroicons-gift",
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    admin_adjust: {
      icon: "i-heroicons-adjustments-horizontal",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    copy_trade: {
      icon: "i-heroicons-document-duplicate",
      bgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
    },
  };
  return styles[type] || styles.deposit;
}

function getTransactionLabel(type: string) {
  const labels: Record<string, string> = {
    deposit: t('wallet.type.deposit'),
    withdraw: t('wallet.type.withdraw'),
    referral_bonus: t('wallet.type.referral_bonus'),
    admin_adjust: 'Adjustment',
    copy_trade: 'Copy Trade',
  };
  return labels[type] || type;
}

function getStatusColor(status: string) {
  return (
    {
      pending: "yellow",
      completed: "green",
      rejected: "red",
      cancelled: "gray",
    }[status] || "gray"
  );
}

function getStatusLabel(status: string) {
  return (
    {
      pending: t('wallet.status.pending'),
      completed: t('wallet.status.completed'),
      rejected: t('wallet.status.rejected'),
      cancelled: 'Cancelled',
    }[status] || status
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
</script>
