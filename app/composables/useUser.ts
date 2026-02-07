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

  return {
    user,
    updateProfile,
    changePassword
  }
}
