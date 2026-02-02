import type { Transaction } from '~~/server/utils/supabase'

export const useWallet = () => {
  const { user, refreshUser } = useAuth()
  const toast = useToastCustom()

  // Get balance
  const balance = computed(() => user.value?.balance || 0)

  // Can use copy trade (balance >= 1000)
  const canCopyTrade = computed(() => balance.value >= 1000)

  // Get transactions
  async function getTransactions(params?: {
    type?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const { data, error } = await useFetch<{
      data: Transaction[]
      total: number
      page: number
      totalPages: number
    }>('/api/wallet/transactions', {
      params
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to load transactions')
    }

    return data.value
  }

  // Request deposit
  async function requestDeposit(amount: number, txHash: string) {
    try {
      const { error } = await useFetch('/api/wallet/deposit', {
        method: 'POST',
        body: { amount, txHash }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Deposit request failed')
      }

      toast.success('Deposit request submitted', 'Please wait for admin confirmation')
    } catch (error: any) {
      toast.error('Error', error.message)
      throw error
    }
  }

  // Request withdrawal
  async function requestWithdraw(amount: number, walletAddress: string) {
    try {
      const { error } = await useFetch('/api/wallet/withdraw', {
        method: 'POST',
        body: { amount, walletAddress }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Withdrawal request failed')
      }

      await refreshUser()
      toast.success('Withdrawal request submitted', 'Please wait for processing')
    } catch (error: any) {
      toast.error('Error', error.message)
      throw error
    }
  }

  // Get deposit address
  async function getDepositAddress() {
    const { data, error } = await useFetch<{ address: string; network: string }>('/api/wallet/deposit-address')

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to get deposit address')
    }

    return data.value
  }

  return {
    balance,
    canCopyTrade,
    getTransactions,
    requestDeposit,
    requestWithdraw,
    getDepositAddress
  }
}
