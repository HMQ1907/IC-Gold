export const useUser = () => {
  const { user, refreshUser } = useAuth()
  const toast = useToast()

  // Update profile
  async function updateProfile(data: {
    fullName?: string
    phone?: string
  }) {
    try {
      const { error } = await useFetch('/api/user/update', {
        method: 'PUT',
        body: data
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Update failed')
      }

      await refreshUser()
      toast.add({
        title: 'Profile updated',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: 'Update failed',
        description: error.message,
        color: 'error'
      })
      throw error
    }
  }

  // Change password
  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      const { error } = await useFetch('/api/user/change-password', {
        method: 'POST',
        body: { currentPassword, newPassword }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Password change failed')
      }

      toast.add({
        title: 'Password changed successfully',
        color: 'success'
      })
    } catch (error: any) {
      toast.add({
        title: 'Password change failed',
        description: error.message,
        color: 'error'
      })
      throw error
    }
  }

  // Enable 2FA
  async function enable2FA() {
    try {
      const { error } = await useFetch('/api/user/enable-2fa', {
        method: 'POST'
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Failed to enable 2FA')
      }

      await refreshUser()
      toast.add({
        title: '2FA enabled',
        description: 'You will need to enter OTP when logging in',
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

  // Disable 2FA
  async function disable2FA(password: string) {
    try {
      const { error } = await useFetch('/api/user/disable-2fa', {
        method: 'POST',
        body: { password }
      })

      if (error.value) {
        throw new Error(error.value.data?.message || 'Failed to disable 2FA')
      }

      await refreshUser()
      toast.add({
        title: '2FA disabled',
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

  return {
    user,
    updateProfile,
    changePassword,
    enable2FA,
    disable2FA
  }
}
