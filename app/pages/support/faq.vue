<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p class="text-gray-400">Find answers to common questions</p>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
        >
          <button
            @click="toggleItem(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/80 transition-colors"
          >
            <span class="font-medium text-white">{{ item.label }}</span>
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="w-5 h-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': openItems.includes(index) }"
            />
          </button>
          <div
            v-show="openItems.includes(index)"
            class="px-6 pb-4"
          >
            <p class="text-gray-400 leading-relaxed">{{ item.content }}</p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mt-12 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 text-center">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-white mb-2">Still Need Help?</h3>
        <p class="text-gray-400 mb-6">Our support team is available 24/7 to assist you</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="https://t.me/icgold_support" 
            target="_blank"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            <UIcon name="i-simple-icons-telegram" class="w-5 h-5" />
            Telegram
          </a>
          <a 
            href="mailto:support@ic-gold.com"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-xl transition-colors"
          >
            <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
            Email
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const openItems = ref<number[]>([])

function toggleItem(index: number) {
  const pos = openItems.value.indexOf(index)
  if (pos === -1) {
    openItems.value.push(index)
  } else {
    openItems.value.splice(pos, 1)
  }
}

const faqItems = [
  { 
    label: 'What is IC-Gold?', 
    content: 'IC-Gold is an advanced crypto investment platform that provides market tracking tools, Copy Trade from experts, and attractive referral programs. We are committed to delivering a safe and profitable investment experience.' 
  },
  { 
    label: 'How do I create an account?', 
    content: 'You can register an account using your email or phone number. After registration, the system will send an OTP code via email for verification. Complete the verification and you can start using immediately.' 
  },
  { 
    label: 'How do I deposit funds?', 
    content: 'IC-Gold supports deposits via TRC20 network (USDT). Go to Deposit, copy the wallet address, send USDT from your wallet, then enter the Transaction Hash to request deposit. Admin will confirm within 24 hours.' 
  },
  { 
    label: 'How does Copy Trade work?', 
    content: 'Copy Trade allows you to automatically copy trades from experts. With a balance of $1,000 or more, you can activate Copy Trade and the system will automatically copy 5% of your assets following expert trades.' 
  },
  { 
    label: 'What is the minimum requirement for Copy Trade?', 
    content: 'To use the Copy Trade feature, your account needs a minimum balance of $1,000. This ensures you have sufficient capital to participate in copy trading.' 
  },
  { 
    label: 'How does the referral program work?', 
    content: 'Each account has a unique referral code. When friends register with your code and make their first successful deposit, you will receive $10 bonus. Each code can be used up to 10 times.' 
  },
  { 
    label: 'How do I withdraw funds?', 
    content: 'Go to Withdraw, enter the amount you want to withdraw (minimum $50) and your TRC20 wallet address. Withdrawal requests are processed within 24 business hours.' 
  },
  { 
    label: 'What is 2FA and how do I enable it?', 
    content: 'Two-factor authentication (2FA) is an additional security feature. When 2FA is enabled, you will need to enter an OTP code sent via email each time you log in. Go to Settings > Security to enable 2FA.' 
  },
  { 
    label: 'I forgot my password, what should I do?', 
    content: 'On the login page, click "Forgot password" and enter your registered email. The system will send a password reset link to your email.' 
  },
  { 
    label: 'How long does transaction processing take?', 
    content: 'Deposits: 1-24 hours after admin confirmation. Withdrawals: 1-24 business hours. Actual time may be faster depending on blockchain network.' 
  }
]
</script>
