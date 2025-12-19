/**
 * CoinGecko API
 * Fetch cryptocurrency data from CoinGecko
 */

const COINGECKO_API_KEY = 'CG-ic1ChFVTR8Tezh1rt11aS8CY';
const COINGECKO_BASE_URL = process.env.NEXT_PUBLIC_COINGECKO_URL || 'https://api.coingecko.com/api/v3';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface CoinGeckoPing {
  gecko_says: string;
}

export interface CoinPrice {
  [coinId: string]: {
    inr: number;
    inr_24h_change?: number;
    usd?: number;
    usd_24h_change?: number;
  };
}

export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
  };
}

export interface TrendingResponse {
  coins: TrendingCoin[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ============================================
// HELPER FUNCTION
// ============================================

function buildUrl(endpoint: string): string {
  const separator = endpoint.includes('?') ? '&' : '?';
  return `${COINGECKO_BASE_URL}${endpoint}${separator}x_cg_demo_api_key=${COINGECKO_API_KEY}`;
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Ping CoinGecko API to check if it's online
 */
export async function pingCoinGecko(): Promise<ApiResponse<CoinGeckoPing>> {
  try {
    const response = await fetch(buildUrl('/ping'));
    
    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to ping CoinGecko API',
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error pinging CoinGecko:', error);
    return {
      success: false,
      message: 'Network error while pinging CoinGecko',
    };
  }
}

/**
 * Get simple price for specific coins
 * @param coinIds - Comma-separated coin IDs (e.g., 'bitcoin,ethereum')
 * @param vsCurrencies - Comma-separated currencies (e.g., 'inr,usd')
 * @param include24hrChange - Include 24h price change
 */
export async function getCoinPrices(
  coinIds: string = 'bitcoin,ethereum',
  vsCurrencies: string = 'inr,usd',
  include24hrChange: boolean = true
): Promise<ApiResponse<CoinPrice>> {
  try {
    const endpoint = `/simple/price?ids=${coinIds}&vs_currencies=${vsCurrencies}&include_24hr_change=${include24hrChange}`;
    const response = await fetch(buildUrl(endpoint));
    
    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to fetch coin prices',
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching coin prices:', error);
    return {
      success: false,
      message: 'Network error while fetching coin prices',
    };
  }
}

/**
 * Get market data for coins with pagination
 * @param vsCurrency - Target currency (default: 'inr')
 * @param order - Sort order (default: 'market_cap_desc')
 * @param perPage - Results per page (default: 10)
 * @param page - Page number (default: 1)
 * @param sparkline - Include 7d sparkline (default: false)
 */
export async function getCoinsMarkets(
  vsCurrency: string = 'inr',
  order: string = 'market_cap_desc',
  perPage: number = 10,
  page: number = 1,
  sparkline: boolean = false
): Promise<ApiResponse<CoinMarketData[]>> {
  try {
    const endpoint = `/coins/markets?vs_currency=${vsCurrency}&order=${order}&per_page=${perPage}&page=${page}&sparkline=${sparkline}`;
    const response = await fetch(buildUrl(endpoint));
    
    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to fetch market data',
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      success: false,
      message: 'Network error while fetching market data',
    };
  }
}

/**
 * Get trending coins (top 7 trending coins on CoinGecko)
 */
export async function getTrendingCoins(): Promise<ApiResponse<TrendingResponse>> {
  try {
    const response = await fetch(buildUrl('/search/trending'));
    
    if (!response.ok) {
      return {
        success: false,
        message: 'Failed to fetch trending coins',
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return {
      success: false,
      message: 'Network error while fetching trending coins',
    };
  }
}

/**
 * Get Bitcoin price in INR (convenience function)
 */
export async function getBitcoinPriceINR(): Promise<ApiResponse<{ price: number; change24h: number }>> {
  try {
    const response = await getCoinPrices('bitcoin', 'inr', true);
    
    if (!response.success || !response.data?.bitcoin) {
      return {
        success: false,
        message: 'Failed to fetch Bitcoin price',
      };
    }
    
    return {
      success: true,
      data: {
        price: response.data.bitcoin.inr,
        change24h: response.data.bitcoin.inr_24h_change || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return {
      success: false,
      message: 'Network error while fetching Bitcoin price',
    };
  }
}

/**
 * Get Ethereum price in INR (convenience function)
 */
export async function getEthereumPriceINR(): Promise<ApiResponse<{ price: number; change24h: number }>> {
  try {
    const response = await getCoinPrices('ethereum', 'inr', true);
    
    if (!response.success || !response.data?.ethereum) {
      return {
        success: false,
        message: 'Failed to fetch Ethereum price',
      };
    }
    
    return {
      success: true,
      data: {
        price: response.data.ethereum.inr,
        change24h: response.data.ethereum.inr_24h_change || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching Ethereum price:', error);
    return {
      success: false,
      message: 'Network error while fetching Ethereum price',
    };
  }
}
