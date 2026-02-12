import axios from "axios";
import type { CoinData, CoinMarketChart } from "@/types";

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

/**
 * CoinGecko API Service
 * Free tier: 10-30 calls/minute
 */
class CoinGeckoService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY;
  }

  private getHeaders() {
    return this.apiKey ? { "x-cg-demo-api-key": this.apiKey } : {};
  }

  /**
   * Get list of all supported coins
   */
  async getCoinsList() {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/list`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching coins list:", error);
      throw error;
    }
  }

  /**
   * Get market data for multiple coins
   */
  async getMarketData(
    currency: string = "usd",
    perPage: number = 100,
    page: number = 1
  ): Promise<CoinData[]> {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: perPage,
          page,
          sparkline: false,
        },
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching market data:", error);
      throw error;
    }
  }

  /**
   * Get detailed data for a specific coin
   */
  async getCoinData(coinId: string): Promise<CoinData> {
    try {
      const response = await axios.get(
        `${COINGECKO_BASE_URL}/coins/markets`,
        {
          params: {
            vs_currency: "usd",
            ids: coinId,
          },
          headers: this.getHeaders(),
        }
      );
      return response.data[0];
    } catch (error) {
      console.error(`Error fetching data for ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Get historical market data for a coin
   */
  async getCoinMarketChart(
    coinId: string,
    days: number = 7,
    currency: string = "usd"
  ): Promise<CoinMarketChart> {
    try {
      const response = await axios.get(
        `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: currency,
            days,
          },
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching chart data for ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Search for coins by query
   */
  async searchCoins(query: string) {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/search`, {
        params: { query },
        headers: this.getHeaders(),
      });
      return response.data.coins;
    } catch (error) {
      console.error("Error searching coins:", error);
      throw error;
    }
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins() {
    try {
      const response = await axios.get(
        `${COINGECKO_BASE_URL}/search/trending`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data.coins;
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      throw error;
    }
  }

  /**
   * Get top gainers and losers
   */
  async getTopMovers(currency: string = "usd") {
    try {
      const data = await this.getMarketData(currency, 250, 1);

      const gainers = [...data]
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 10);

      const losers = [...data]
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 10);

      return { gainers, losers };
    } catch (error) {
      console.error("Error fetching top movers:", error);
      throw error;
    }
  }

  /**
   * Get global market data
   */
  async getGlobalData() {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/global`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching global data:", error);
      throw error;
    }
  }

  /**
   * Get current price for multiple coins
   */
  async getSimplePrice(coinIds: string[], currencies: string[] = ["usd"]) {
    try {
      const response = await axios.get(
        `${COINGECKO_BASE_URL}/simple/price`,
        {
          params: {
            ids: coinIds.join(","),
            vs_currencies: currencies.join(","),
            include_24hr_change: true,
            include_market_cap: true,
          },
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching simple price:", error);
      throw error;
    }
  }
}

export const coinGeckoService = new CoinGeckoService();
