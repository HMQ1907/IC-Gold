<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-white mb-4">Terms of Service</h1>
        <p class="text-gray-400">Last updated: {{ lastUpdated }}</p>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 class="text-xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
        <p class="text-gray-400 mb-4">Welcome to IC-Gold. By accessing and using our platform, you agree to comply with the following terms and conditions. Please read carefully before using our services.</p>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">2. Terms of Use</h2>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>You must be 18 years or older to use our services</li>
          <li>You must provide accurate information when registering</li>
          <li>You are responsible for securing your account</li>
          <li>You may not use the platform for illegal purposes</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">3. Our Services</h2>
        <p class="text-gray-400 mb-4">IC-Gold provides services including:</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Real-time crypto price tracking</li>
          <li>Copy Trade feature</li>
          <li>Deposits and withdrawals via TRC20 network</li>
          <li>Friend referral program</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">4. Deposits and Withdrawals</h2>
        <p class="text-gray-400 mb-4">All deposit and withdrawal transactions are conducted via TRC20 network (USDT). We are not responsible for:</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Transactions sent to wrong wallet addresses</li>
          <li>Transactions sent via different blockchain networks</li>
          <li>Delays caused by blockchain network</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">5. Investment Risks</h2>
        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-4">
          <p class="text-red-400 font-semibold mb-2">Risk Warning:</p>
          <p class="text-red-300">Investing in cryptocurrencies carries high risk and may result in total loss of investment. Crypto asset values can fluctuate significantly. You should carefully consider your financial capability and seek independent advice before investing.</p>
        </div>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">6. Copy Trade</h2>
        <p class="text-gray-400 mb-4">The Copy Trade feature allows you to automatically copy trades from experts. However, past performance does not guarantee future results. You are fully responsible for your decision to use Copy Trade.</p>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">7. Referral Program</h2>
        <p class="text-gray-400 mb-4">The referral program provides rewards for users who refer friends. We reserve the right to:</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Change referral bonus amounts</li>
          <li>Cancel bonuses if fraud is detected</li>
          <li>Limit the number of times a referral code can be used</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">8. Information Security</h2>
        <p class="text-gray-400 mb-4">We are committed to protecting your personal information according to our privacy policy. You are responsible for:</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Keeping your password and OTP codes confidential</li>
          <li>Not sharing login information</li>
          <li>Enabling two-factor authentication (2FA) for added security</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">9. Limitation of Liability</h2>
        <p class="text-gray-400 mb-4">IC-Gold is not responsible for:</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Losses due to market fluctuations</li>
          <li>Technical errors from third parties</li>
          <li>Losses caused by user actions</li>
          <li>Service interruptions due to maintenance or upgrades</li>
        </ul>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">10. Changes to Terms</h2>
        <p class="text-gray-400 mb-4">We reserve the right to change terms of service at any time. Continued use of services after changes implies acceptance of the new terms.</p>

        <h2 class="text-xl font-bold text-white mt-8 mb-4">11. Contact</h2>
        <p class="text-gray-400 mb-4">If you have any questions about the terms of service, please contact:</p>
        <ul class="list-disc list-inside text-gray-400 mb-4 space-y-2">
          <li>Email: support@ic-gold.com</li>
          <li>Telegram: @icgold_support</li>
        </ul>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-400 mb-4">By using IC-Gold, you confirm that you have read and agree to the above terms.</p>
        <UButton to="/auth/register" color="primary" size="lg">Sign Up Now</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())
</script>
