// Message Types
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    coinData?: CoinData;
    newsData?: NewsItem[];
    portfolioData?: Portfolio;
    chartData?: ChartData;
  };
}

// Cryptocurrency Data Types
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinMarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

// Portfolio Types
export interface PortfolioHolding {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice?: number;
}

export interface Portfolio {
  id: string;
  name: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  lastUpdated: Date;
}

// News Types
export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: Date;
  sentiment?: "positive" | "negative" | "neutral";
  coins?: string[];
  image?: string;
}

// Blockchain Explorer Types
export interface WalletBalance {
  address: string;
  balance: number;
  chain: "ethereum" | "bitcoin" | "bsc";
  usdValue?: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: Date;
  status: "success" | "failed" | "pending";
  gasUsed?: number;
  gasPrice?: number;
}

// User Preferences Types
export interface UserPreferences {
  theme: "light" | "dark";
  currency: "USD" | "EUR" | "BTC";
  notifications: boolean;
  riskProfile: "conservative" | "moderate" | "aggressive";
  favoriteCoins: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Chat Context Types
export interface ChatContext {
  messages: Message[];
  currentPortfolio?: Portfolio;
  watchlist: string[];
  userPreferences: UserPreferences;
}

// Alert Types
export interface PriceAlert {
  id: string;
  coinId: string;
  symbol: string;
  condition: "above" | "below";
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: Date;
}

// Educational Content Types
export interface EducationalTopic {
  id: string;
  title: string;
  category: "basics" | "defi" | "nft" | "trading" | "security";
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  relatedTopics: string[];
}

// DCA Calculator Types
export interface DCACalculation {
  coinId: string;
  investmentAmount: number;
  frequency: "daily" | "weekly" | "monthly";
  duration: number; // in months
  projectedValue: number;
  totalInvested: number;
  averageBuyPrice: number;
}
