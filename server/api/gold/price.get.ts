export default defineEventHandler(async (event) => {
  try {
    // Fetch gold price from CoinGecko API (PAX Gold - backed 1:1 by physical gold)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true'
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch gold price from CoinGecko')
    }
    
    const data = await response.json()
    
    const price = data['pax-gold']?.usd || 2650
    const change24h = data['pax-gold']?.usd_24h_change || 0
    
    return {
      symbol: 'XAU/USD',
      price: price,
      change24h: parseFloat(change24h.toFixed(2)),
      currency: 'USD',
      unit: 'oz',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Gold price API error:', error)
    
    // Fallback price if API fails
    return {
      symbol: 'XAU/USD',
      price: 2650.00,
      change24h: 0.75,
      currency: 'USD',
      unit: 'oz',
      timestamp: new Date().toISOString()
    }
  }
})
