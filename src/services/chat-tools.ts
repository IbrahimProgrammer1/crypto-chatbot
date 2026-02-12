import type { ChatContext } from "@/types";
import { coinGeckoService } from "./coingecko";
import { newsService } from "./news";
import { blockchainService } from "./blockchain";

/**
 * Intent detection and tool integration service
 * Analyzes user messages and fetches relevant data
 */
class ChatToolsService {
  /**
   * Detect user intent and fetch relevant data
   */
  async processUserMessage(message: string, context?: ChatContext): Promise<{
    enhancedMessage: string;
    toolData?: any;
    toolType?: string;
  }> {
    const lowerMessage = message.toLowerCase();

    // Price query detection
    if (this.isPriceQuery(lowerMessage)) {
      return await this.handlePriceQuery(message, lowerMessage);
    }

    // Market overview query
    if (this.isMarketOverviewQuery(lowerMessage)) {
      return await this.handleMarketOverview(message);
    }

    // Top gainers/losers query
    if (this.isTopMoversQuery(lowerMessage)) {
      return await this.handleTopMovers(message, lowerMessage);
    }

    // News query
    if (this.isNewsQuery(lowerMessage)) {
      return await this.handleNewsQuery(message);
    }

    // Wallet/blockchain query
    if (this.isWalletQuery(lowerMessage)) {
      return await this.handleWalletQuery(message, lowerMessage);
    }

    // Gas fees query
    if (this.isGasFeesQuery(lowerMessage)) {
      return await this.handleGasFeesQuery(message);
    }

    // Portfolio query
    if (this.isPortfolioQuery(lowerMessage) && context?.currentPortfolio) {
      return await this.handlePortfolioQuery(message, context);
    }

    // No specific intent detected, return original message
    return { enhancedMessage: message };
  }

  // Intent detection methods
  private isPriceQuery(message: string): boolean {
    const priceKeywords = ["price", "cost", "worth", "value", "how much"];
    const cryptoKeywords = ["bitcoin", "btc", "ethereum", "eth", "crypto", "coin"];
    return priceKeywords.some((k) => message.includes(k)) &&
           (cryptoKeywords.some((k) => message.includes(k)) || message.includes("$"));
  }

  private isMarketOverviewQuery(message: string): boolean {
    return (
      message.includes("market") &&
      (message.includes("overview") || message.includes("summary") || message.includes("top"))
    );
  }

  private isTopMoversQuery(message: string): boolean {
    return (
      (message.includes("top") || message.includes("best") || message.includes("worst")) &&
      (message.includes("gainer") || message.includes("loser") || message.includes("performer"))
    );
  }

  private isNewsQuery(message: string): boolean {
    return message.includes("news") || message.includes("latest") || message.includes("headline");
  }

  private isWalletQuery(message: string): boolean {
    return (
      (message.includes("wallet") || message.includes("address") || message.includes("balance")) &&
      (message.includes("0x") || message.includes("check") || message.includes("look up"))
    );
  }

  private isGasFeesQuery(message: string): boolean {
    return message.includes("gas") && (message.includes("fee") || message.includes("price"));
  }

  private isPortfolioQuery(message: string): boolean {
    return (
      message.includes("portfolio") ||
      message.includes("my holdings") ||
      message.includes("my investment")
    );
  }

  // Handler methods
  private async handlePriceQuery(
    message: string,
    lowerMessage: string
  ): Promise<any> {
    try {
      // Extract coin name from message
      const coinName = this.extractCoinName(lowerMessage);
      if (!coinName) {
        return { enhancedMessage: message };
      }

      // Search for the coin
      const searchResults = await coinGeckoService.searchCoins(coinName);
      if (!searchResults || searchResults.length === 0) {
        return { enhancedMessage: message };
      }

      const coin = searchResults[0];
      const coinData = await coinGeckoService.getCoinData(coin.id);

      const dataContext = `
[LIVE DATA FETCHED]
Coin: ${coinData.name} (${coinData.symbol.toUpperCase()})
Current Price: $${coinData.current_price.toLocaleString()}
24h Change: ${coinData.price_change_percentage_24h.toFixed(2)}%
Market Cap: $${(coinData.market_cap / 1e9).toFixed(2)}B
24h Volume: $${(coinData.total_volume / 1e9).toFixed(2)}B

User Question: ${message}

Please provide a helpful response using this live data.`;

      return {
        enhancedMessage: dataContext,
        toolData: coinData,
        toolType: "price",
      };
    } catch (error) {
      console.error("Error handling price query:", error);
      return { enhancedMessage: message };
    }
  }

  private async handleMarketOverview(message: string): Promise<any> {
    try {
      const marketData = await coinGeckoService.getMarketData("usd", 10);

      const dataContext = `
[LIVE MARKET DATA FETCHED]
Top 10 Cryptocurrencies by Market Cap:

${marketData
  .map(
    (coin, i) =>
      `${i + 1}. ${coin.name} (${coin.symbol.toUpperCase()})
   Price: $${coin.current_price.toLocaleString()}
   24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%
   Market Cap: $${(coin.market_cap / 1e9).toFixed(2)}B`
  )
  .join("\n\n")}

User Question: ${message}

Please provide a helpful market overview using this data.`;

      return {
        enhancedMessage: dataContext,
        toolData: marketData,
        toolType: "market",
      };
    } catch (error) {
      console.error("Error handling market overview:", error);
      return { enhancedMessage: message };
    }
  }

  private async handleTopMovers(
    message: string,
    lowerMessage: string
  ): Promise<any> {
    try {
      const { gainers, losers } = await coinGeckoService.getTopMovers();

      const showGainers = lowerMessage.includes("gainer") || lowerMessage.includes("best");
      const showLosers = lowerMessage.includes("loser") || lowerMessage.includes("worst");

      let dataContext = "[LIVE DATA FETCHED]\n\n";

      if (showGainers || (!showGainers && !showLosers)) {
        dataContext += `Top 5 Gainers (24h):\n${gainers
          .slice(0, 5)
          .map(
            (coin, i) =>
              `${i + 1}. ${coin.name} (${coin.symbol.toUpperCase()}): +${coin.price_change_percentage_24h.toFixed(2)}%`
          )
          .join("\n")}\n\n`;
      }

      if (showLosers || (!showGainers && !showLosers)) {
        dataContext += `Top 5 Losers (24h):\n${losers
          .slice(0, 5)
          .map(
            (coin, i) =>
              `${i + 1}. ${coin.name} (${coin.symbol.toUpperCase()}): ${coin.price_change_percentage_24h.toFixed(2)}%`
          )
          .join("\n")}\n\n`;
      }

      dataContext += `User Question: ${message}\n\nPlease provide insights about these market movers.`;

      return {
        enhancedMessage: dataContext,
        toolData: { gainers, losers },
        toolType: "movers",
      };
    } catch (error) {
      console.error("Error handling top movers:", error);
      return { enhancedMessage: message };
    }
  }

  private async handleNewsQuery(message: string): Promise<any> {
    try {
      const news = await newsService.getLatestNews("all");

      const dataContext = `
[LATEST CRYPTO NEWS FETCHED]

${news
  .slice(0, 5)
  .map(
    (item, i) =>
      `${i + 1}. ${item.title}
   Source: ${item.source}
   Published: ${new Date(item.publishedAt).toLocaleString()}`
  )
  .join("\n\n")}

User Question: ${message}

Please summarize these news items and provide insights.`;

      return {
        enhancedMessage: dataContext,
        toolData: news,
        toolType: "news",
      };
    } catch (error) {
      console.error("Error handling news query:", error);
      return { enhancedMessage: message };
    }
  }

  private async handleWalletQuery(
    message: string,
    lowerMessage: string
  ): Promise<any> {
    try {
      // Extract address from message
      const ethAddressMatch = message.match(/0x[a-fA-F0-9]{40}/);
      if (!ethAddressMatch) {
        return { enhancedMessage: message };
      }

      const address = ethAddressMatch[0];
      const balance = await blockchainService.getEthereumBalance(address);

      const dataContext = `
[WALLET DATA FETCHED]
Address: ${address}
Balance: ${balance.balance.toFixed(6)} ETH
Chain: Ethereum

User Question: ${message}

Please provide information about this wallet.`;

      return {
        enhancedMessage: dataContext,
        toolData: balance,
        toolType: "wallet",
      };
    } catch (error) {
      console.error("Error handling wallet query:", error);
      return { enhancedMessage: message };
    }
  }

  private async handleGasFeesQuery(message: string): Promise<any> {
    try {
      const gasPrices = await blockchainService.getGasPrices();

      const dataContext = `
[ETHEREUM GAS PRICES FETCHED]
Low: ${gasPrices.low} Gwei
Average: ${gasPrices.average} Gwei
High: ${gasPrices.high} Gwei

User Question: ${message}

Please explain the current gas fees.`;

      return {
        enhancedMessage: dataContext,
        toolData: gasPrices,
        toolType: "gas",
      };
    } catch (error) {
      console.error("Error handling gas fees query:", error);
      return { enhancedMessage: message };
    }
  }

  private async handlePortfolioQuery(
    message: string,
    context: ChatContext
  ): Promise<any> {
    const portfolio = context.currentPortfolio;
    if (!portfolio) {
      return { enhancedMessage: message };
    }

    const dataContext = `
[USER PORTFOLIO DATA]
Total Value: $${portfolio.totalValue.toFixed(2)}
Total Cost: $${portfolio.totalCost.toFixed(2)}
Profit/Loss: $${portfolio.totalProfitLoss.toFixed(2)} (${portfolio.totalProfitLossPercentage.toFixed(2)}%)

Holdings:
${portfolio.holdings
  .map(
    (h) =>
      `- ${h.name} (${h.symbol.toUpperCase()}): ${h.quantity} @ $${h.purchasePrice}`
  )
  .join("\n")}

User Question: ${message}

Please provide portfolio analysis and insights.`;

    return {
      enhancedMessage: dataContext,
      toolData: portfolio,
      toolType: "portfolio",
    };
  }

  // Helper methods
  private extractCoinName(message: string): string | null {
    const coinPatterns = [
      { pattern: /bitcoin|btc/i, name: "bitcoin" },
      { pattern: /ethereum|eth(?!erscan)/i, name: "ethereum" },
      { pattern: /solana|sol/i, name: "solana" },
      { pattern: /cardano|ada/i, name: "cardano" },
      { pattern: /ripple|xrp/i, name: "ripple" },
      { pattern: /polkadot|dot/i, name: "polkadot" },
      { pattern: /dogecoin|doge/i, name: "dogecoin" },
      { pattern: /avalanche|avax/i, name: "avalanche" },
      { pattern: /polygon|matic/i, name: "polygon" },
      { pattern: /chainlink|link/i, name: "chainlink" },
    ];

    for (const { pattern, name } of coinPatterns) {
      if (pattern.test(message)) {
        return name;
      }
    }

    return null;
  }
}

export const chatToolsService = new ChatToolsService();
