import type { User, Transaction } from '~~/server/utils/supabase'

export const useAdmin = () => {
  const toast = useToast()

  // Get all users
  async function getUsers(params?: {
    search?: string
    page?: number
    limit?: number
  }) {
    const { data, error } = await useFetch<{
      data: User[]
      total: number
      page: number
      totalPages: number
    }>('/api/admin/users', {
      params
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to load users')
    }

    return data.value
  }

  // Get user by ID
  async function getUser(id: number) {
    const { data, error } = await useFetch<{ user: User }>(`/api/admin/users/${id}`)

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to load user')
    }

    return data.value?.user
  }

  // Adjust user balance
  async function adjustBalance(userId: number, amount: number, note?: string) {
    try {
      const { error } = await useFetch('/api/admin/adjust-balance', {
        method: 'POST',
        body: { userId, amount, note }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Balance adjustment failed')
      }

      toast.add({
        title: 'Balance adjusted successfully',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'error'
      })
      throw error
    }
  }

  // Get all transactions
  async function getTransactions(params?: {
    userId?: number
    type?: string
    status?: string
    page?: number
    limit?: number
  }) {
    const { data, error } = await useFetch<{
      data: (Transaction & { user?: User })[]
      total: number
      page: number
      totalPages: number
    }>('/api/admin/transactions', {
      params
    })

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to load transactions')
    }

    return data.value
  }

  // Approve/reject transaction
  async function processTransaction(
    transactionId: number,
    action: 'approve' | 'reject',
    note?: string
  ) {
    try {
      const { error } = await useFetch('/api/admin/approve-transaction', {
        method: 'POST',
        body: { transactionId, action, note }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Transaction processing failed')
      }

      toast.add({
        title: action === 'approve' ? 'Transaction approved' : 'Transaction rejected',
        color: action === 'approve' ? 'success' : 'warning'
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'error'
      })
      throw error
    }
  }

  // Update site settings
  async function updateSettings(settings: Record<string, string>) {
    try {
      const { error } = await useFetch('/api/admin/settings', {
        method: 'PUT',
        body: { settings }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Settings update failed')
      }

      toast.add({
        title: 'Settings updated successfully',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'error'
      })
      throw error
    }
  }

  // Get site settings
  async function getSettings() {
    const { data, error } = await useFetch<{ settings: Record<string, string> }>('/api/admin/settings')

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to load settings')
    }

    return data.value?.settings
  }

  // Get dashboard stats
  async function getDashboardStats() {
    const { data, error } = await useFetch<{
      totalUsers: number
      newUsers24h: number
      totalDeposits: number
      totalWithdrawals: number
      pendingTransactions: number
      totalUserBalance: number
    }>('/api/admin/stats')

    if (error.value) {
      throw new Error(error.value.data?.message || 'Failed to load stats')
    }

    return data.value
  }

  return {
    getUsers,
    getUser,
    adjustBalance,
    getTransactions,
    processTransaction,
    updateSettings,
    getSettings,
    getDashboardStats
  }
}
