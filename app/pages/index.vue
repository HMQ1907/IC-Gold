<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 py-20 lg:py-32">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-amber-500 text-sm font-medium">#1 Investment Platform</span>
            </div>

            <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Invest in <span class="text-amber-500">Crypto</span>
              <br />
              Earn <span class="text-amber-500">Smart</span>
            </h1>

            <p class="text-xl text-gray-400 mb-8 max-w-lg">
              Join IC-Gold to experience the most advanced crypto investment platform. 
              Copy Trade from experts, track real-time markets, and earn attractive referral rewards.
            </p>

            <div class="flex flex-wrap gap-4">
              <UButton to="/auth/register" color="primary" size="xl" class="font-semibold">
                Get Started
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
              </UButton>
              <UButton to="/support/faq" color="neutral" variant="outline" size="xl">
                Learn More
              </UButton>
            </div>

            <!-- Quick Stats -->
            <div class="flex flex-wrap gap-8 mt-12">
              <div>
                <p class="text-3xl font-bold text-white">$10M+</p>
                <p class="text-gray-500">Trading Volume</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-white">50K+</p>
                <p class="text-gray-500">Users</p>
              </div>
              <div>
                <p class="text-3xl font-bold text-white">99.9%</p>
                <p class="text-gray-500">Uptime</p>
              </div>
            </div>
          </div>

          <!-- Hero Image/Chart -->
          <div class="relative">
            <div class="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029" class="w-8 h-8" alt="BTC" />
                  <span class="text-white font-bold">BTC/USDT</span>
                </div>
                <span class="text-white text-sm font-medium">+2.34%</span>
              </div>
              
              <!-- Mini chart placeholder -->
              <div class="h-48 bg-gradient-to-t from-amber-500/20 to-transparent rounded-lg flex items-end justify-center">
                <svg viewBox="0 0 400 100" class="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M0,80 C50,70 100,90 150,60 C200,30 250,50 300,40 C350,30 380,20 400,25"
                    fill="none"
                    stroke="url(#gradient)"
                    stroke-width="3"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#f59e0b" />
                      <stop offset="100%" stop-color="#d97706" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div class="flex items-center justify-between mt-4">
                <div>
                  <p class="text-gray-400 text-sm">Current Price</p>
                  <p class="text-2xl font-bold text-white">$67,432.50</p>
                </div>
                <NuxtLink to="/auth/register" class="text-white hover:text-amber-500 text-sm font-medium transition-colors">
                  Trade Now
                </NuxtLink>
              </div>
            </div>

            <!-- Floating cards -->
            <div class="absolute -top-4 -right-4 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 animate-bounce">
              <span class="text-green-500 font-medium">+$1,234</span>
            </div>
            <div class="absolute -bottom-4 -left-4 bg-purple-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
              <span class="text-purple-500 font-medium">Copy Trade Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-950">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Why Choose IC-Gold?
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Comprehensive crypto investment platform with advanced technology and top expert team
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-chart-bar" class="w-7 h-7 text-amber-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Real-time Charts</h3>
            <p class="text-gray-400">
              Track crypto prices with professional TradingView charts, 
              updated real-time 24/7
            </p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-document-duplicate" class="w-7 h-7 text-blue-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Copy Trade</h3>
            <p class="text-gray-400">
              Automatically copy trades from experienced experts, 
              no deep knowledge required
            </p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-shield-check" class="w-7 h-7 text-green-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">High Security</h3>
            <p class="text-gray-400">
              Two-factor authentication (2FA), data encryption and 
              international standard security
            </p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-gift" class="w-7 h-7 text-purple-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Referral Rewards</h3>
            <p class="text-gray-400">
              Earn $10 for each successful friend referral. 
              Unlimited referrals!
            </p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-bolt" class="w-7 h-7 text-red-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Fast Deposits/Withdrawals</h3>
            <p class="text-gray-400">
              Deposit and withdraw via TRC20 quickly, 
              processed within 24h
            </p>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-amber-500/50 transition-colors">
            <div class="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-7 h-7 text-cyan-500" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">24/7 Support</h3>
            <p class="text-gray-400">
              Professional support team ready to answer 
              all your questions
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Get Started in 3 Steps
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto">
            Simple, fast, and secure process
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              1
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Create Account</h3>
            <p class="text-gray-400">
              Create a free account in just 2 minutes with email or phone number
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              2
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Deposit Funds</h3>
            <p class="text-gray-400">
              Deposit USDT via TRC20 network to start investing
            </p>
          </div>

          <div class="text-center">
            <div class="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
              3
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Start Investing</h3>
            <p class="text-gray-400">
              Track the market and use Copy Trade to earn profits
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-amber-600 to-amber-700">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
          Ready to Start Investing?
        </h2>
        <p class="text-amber-100 text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of investors who trust IC-Gold. 
          Sign up now and get special offers!
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <UButton to="/auth/register" color="primary" size="xl" class="font-semibold">
            Sign Up Free
          </UButton>
          <UButton to="/auth/login" variant="outline" size="xl" class="!text-white !border-white">
            Already have an account? Login
          </UButton>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-gray-950">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Users Say About IC-Gold
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div class="flex items-center gap-1 mb-4">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-5 h-5 text-amber-500" />
            </div>
            <p class="text-gray-300 mb-6">
              "IC-Gold's Copy Trade is really effective. I increased my profit by 30% in the first month without doing much."
            </p>
            <div class="flex items-center gap-3">
              <UAvatar alt="John D" class="bg-amber-500" />
              <div>
                <p class="text-white font-medium">John D.</p>
                <p class="text-gray-500 text-sm">Individual Investor</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div class="flex items-center gap-1 mb-4">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-5 h-5 text-amber-500" />
            </div>
            <p class="text-gray-300 mb-6">
              "Easy to use interface, fast deposits and withdrawals. Support team is very responsive and professional."
            </p>
            <div class="flex items-center gap-3">
              <UAvatar alt="Sarah M" class="bg-purple-500" />
              <div>
                <p class="text-white font-medium">Sarah M.</p>
                <p class="text-gray-500 text-sm">Trader</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <div class="flex items-center gap-1 mb-4">
              <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="w-5 h-5 text-amber-500" />
            </div>
            <p class="text-gray-300 mb-6">
              "IC-Gold's referral program is great. I earned an extra $500 just from referring friends."
            </p>
            <div class="flex items-center gap-3">
              <UAvatar alt="Mike R" class="bg-green-500" />
              <div>
                <p class="text-white font-medium">Mike R.</p>
                <p class="text-gray-500 text-sm">Affiliate Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gold Image Section -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800"
              alt="Gold Investment"
              class="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
              Digital Gold Investment with IC-Gold
            </h2>
            <p class="text-gray-400 text-lg mb-6">
              IC-Gold brings you the opportunity to invest in the crypto market with safety 
              and high profit potential. With advanced technology and experienced expert team, 
              we are committed to delivering the best investment experience.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                24/7 trading, no limits
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                Lowest transaction fees in the market
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                Fast withdrawals within 24h
              </li>
              <li class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500" />
                Top-tier asset security
              </li>
            </ul>
            <UButton to="/auth/register" color="primary" size="lg">
              Sign Up Now
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 ml-2" />
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Homepage - landing page for IC-Gold
</script>
