export const useUser = () => {
  const { user, refreshUser } = useAuth()
  const toast = useToastCustom()

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
      toast.success('Profile updated')
    } catch (error: any) {
      toast.error('Update failed', error.message)
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

      toast.success('Password changed successfully')
    } catch (error: any) {
      toast.error('Password change failed', error.message)
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
      toast.success('2FA enabled', 'You will need to enter OTP when logging in')
    } catch (error: any) {
      toast.error('Error', error.message)
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
      toast.success('2FA disabled')
    } catch (error: any) {
      toast.error('Error', error.message)
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
