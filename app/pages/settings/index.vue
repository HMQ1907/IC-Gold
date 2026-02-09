<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">{{ locale === 'vi' ? 'Cài đặt tài khoản' : 'Account Settings' }}</h1>
        <p class="text-gray-400">{{ locale === 'vi' ? 'Quản lý thông tin và bảo mật tài khoản' : 'Manage your account information and security' }}</p>
      </div>

      <div class="grid gap-6">
        <!-- Personal Information -->
        <div class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ locale === 'vi' ? 'Thông tin cá nhân' : 'Personal Information' }}</h3>
                <p class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Cập nhật thông tin của bạn' : 'Update your profile details' }}</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Họ và tên' : 'Full Name' }}</label>
                <input 
                  v-model="profile.fullName" 
                  :placeholder="locale === 'vi' ? 'Nhập tên của bạn' : 'Enter your name'" 
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Số điện thoại' : 'Phone Number' }}</label>
                <input 
                  v-model="profile.phone" 
                  :placeholder="locale === 'vi' ? 'Nhập số điện thoại' : 'Enter phone number'" 
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Địa chỉ Email' : 'Email Address' }}</label>
                <input 
                  :value="user?.email || ''" 
                  disabled 
                  class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 cursor-not-allowed"
                />
                <p class="text-gray-500 text-xs mt-1">{{ locale === 'vi' ? 'Email không thể thay đổi' : 'Email cannot be changed' }}</p>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button 
                :disabled="savingProfile" 
                @click="saveProfile" 
                class="px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <UIcon v-if="savingProfile" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                <UIcon v-else name="i-heroicons-check" class="w-5 h-5" />
                {{ locale === 'vi' ? 'Lưu thay đổi' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ locale === 'vi' ? 'Bảo mật' : 'Security' }}</h3>
                <p class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Quản lý cài đặt bảo mật' : 'Manage your security preferences' }}</p>
              </div>
            </div>
          </div>
          <div class="p-6 space-y-6">
            <!-- Change Password -->
            <div>
              <h4 class="text-white font-semibold mb-4 flex items-center gap-2">
                <UIcon name="i-heroicons-key" class="w-5 h-5 text-amber-500" />
                {{ locale === 'vi' ? 'Đổi mật khẩu' : 'Change Password' }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password' }}</label>
                  <input 
                    v-model="password.current" 
                    type="password" 
                    :placeholder="locale === 'vi' ? 'Nhập mật khẩu hiện tại' : 'Enter current password'" 
                    class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Mật khẩu mới' : 'New Password' }}</label>
                    <input 
                      v-model="password.new" 
                      type="password" 
                      :placeholder="locale === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'" 
                      class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">{{ locale === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password' }}</label>
                    <input 
                      v-model="password.confirm" 
                      type="password" 
                      :placeholder="locale === 'vi' ? 'Nhập lại mật khẩu mới' : 'Re-enter new password'" 
                      class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <button 
                  :disabled="changingPassword" 
                  @click="handleChangePassword" 
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UIcon v-if="changingPassword" name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
                  <UIcon v-else name="i-heroicons-arrow-path" class="w-5 h-5" />
                  {{ locale === 'vi' ? 'Đổi mật khẩu' : 'Change Password' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-800 bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-identification" class="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 class="text-white font-semibold">{{ locale === 'vi' ? 'Thông tin tài khoản' : 'Account Information' }}</h3>
                <p class="text-gray-500 text-sm">{{ locale === 'vi' ? 'Chi tiết tài khoản của bạn' : 'Your account details' }}</p>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid gap-3">
              <div class="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-gift" class="w-5 h-5 text-gray-500" />
                  <span class="text-gray-400">{{ locale === 'vi' ? 'Mã giới thiệu' : 'Referral Code' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <code class="text-amber-500 font-bold text-lg">{{ user?.referral_code }}</code>
                  <button 
                    @click="copyReferralCode" 
                    class="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    :title="locale === 'vi' ? 'Sao chép mã giới thiệu' : 'Copy referral code'"
                  >
                    <UIcon name="i-heroicons-clipboard-document" class="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-800 rounded-xl hover:bg-gray-800/50 transition-colors">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-gray-500" />
                  <span class="text-gray-400">{{ locale === 'vi' ? 'Ngày tạo tài khoản' : 'Account Created' }}</span>
                </div>
                <span class="text-white font-medium">{{ formatDate(user?.created_at || '') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const { locale } = useI18n()
const { user, refreshUser } = useAuth()
const { updateProfile, changePassword } = useUser()
const toast = useToastCustom()
const savingProfile = ref(false)
const changingPassword = ref(false)
const profile = reactive({ fullName: user.value?.full_name || '', phone: user.value?.phone || '' })
const password = reactive({ current: '', new: '', confirm: '' })

watch(user, (newUser) => { if (newUser) { profile.fullName = newUser.full_name || ''; profile.phone = newUser.phone || '' } }, { immediate: true })

async function saveProfile() { savingProfile.value = true; try { await updateProfile({ fullName: profile.fullName, phone: profile.phone }) } catch {} finally { savingProfile.value = false } }
async function handleChangePassword() {
  if (password.new !== password.confirm) { toast.error(locale.value === 'vi' ? 'Lỗi' : 'Error', locale.value === 'vi' ? 'Mật khẩu không khớp' : 'Passwords do not match'); return }
  changingPassword.value = true; try { await changePassword(password.current, password.new); password.current = ''; password.new = ''; password.confirm = '' } catch {} finally { changingPassword.value = false }
}
async function copyReferralCode() { if (user.value?.referral_code) { await navigator.clipboard.writeText(user.value.referral_code); toast.success(locale.value === 'vi' ? 'Đã sao chép mã giới thiệu' : 'Referral code copied') } }
function formatDate(date: string) { return date ? new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date)) : '' }
</script>
