import axios from "axios";
import type { NewsItem } from "@/types";

const CRYPTOPANIC_BASE_URL = "https://cryptopanic.com/api/v1";

/**
 * CryptoPanic News Service
 * Free tier: Limited requests
 */
class NewsService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.CRYPTOPANIC_API_KEY;
  }

  /**
   * Get latest crypto news
   */
  async getLatestNews(
    filter: "rising" | "hot" | "bullish" | "bearish" | "important" | "all" = "all",
    currencies?: string[]
  ): Promise<NewsItem[]> {
    try {
      // If no API key, return mock data
      if (!this.apiKey) {
        console.log("No CryptoPanic API key found, using mock data");
        return this.getMockNews();
      }

      const params: any = {
        auth_token: this.apiKey,
        filter,
      };

      if (currencies && currencies.length > 0) {
        params.currencies = currencies.join(",");
      }

      const response = await axios.get(`${CRYPTOPANIC_BASE_URL}/posts/`, {
        params,
        timeout: 5000, // 5 second timeout
      });

      return response.data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        source: item.source.title,
        publishedAt: new Date(item.published_at),
        coins: item.currencies?.map((c: any) => c.code) || [],
      }));
    } catch (error) {
      console.log("CryptoPanic API unavailable, using mock data");
      return this.getMockNews();
    }
  }

  /**
   * Get news for specific coins
   */
  async getNewsForCoins(coinSymbols: string[]): Promise<NewsItem[]> {
    return this.getLatestNews("all", coinSymbols);
  }

  /**
   * Mock news data for when API is unavailable
   */
  private getMockNews(): NewsItem[] {
    return [
      {
        id: "1",
        title: "Bitcoin Reaches New All-Time High",
        description: "Bitcoin surpasses previous records amid institutional adoption",
        url: "#",
        source: "CryptoNews",
        publishedAt: new Date(),
        sentiment: "positive",
        coins: ["BTC"],
      },
      {
        id: "2",
        title: "Ethereum 2.0 Upgrade Shows Promising Results",
        description: "Network efficiency improves following latest upgrade",
        url: "#",
        source: "CoinDesk",
        publishedAt: new Date(Date.now() - 3600000),
        sentiment: "positive",
        coins: ["ETH"],
      },
      {
        id: "3",
        title: "Regulatory Updates Impact Crypto Markets",
        description: "New regulations announced in major markets",
        url: "#",
        source: "Bloomberg Crypto",
        publishedAt: new Date(Date.now() - 7200000),
        sentiment: "neutral",
        coins: ["BTC", "ETH"],
      },
      {
        id: "4",
        title: "DeFi Protocol Launches New Features",
        description: "Popular DeFi platform introduces innovative staking options",
        url: "#",
        source: "DeFi Pulse",
        publishedAt: new Date(Date.now() - 10800000),
        sentiment: "positive",
        coins: ["ETH"],
      },
      {
        id: "5",
        title: "Market Analysis: Altcoin Season Approaching?",
        description: "Analysts predict potential altcoin rally based on market indicators",
        url: "#",
        source: "CryptoSlate",
        publishedAt: new Date(Date.now() - 14400000),
        sentiment: "neutral",
        coins: ["BTC", "ETH", "SOL"],
      },
    ];
  }
}

export const newsService = new NewsService();
