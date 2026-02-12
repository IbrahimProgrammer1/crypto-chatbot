import axios from "axios";
import type { WalletBalance, Transaction } from "@/types";

// Updated to Etherscan API V2
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/v2/api";
const BLOCKCHAIN_INFO_BASE_URL = "https://blockchain.info";

/**
 * Blockchain Explorer Service
 * Supports Ethereum and Bitcoin
 */
class BlockchainService {
  private etherscanApiKey: string | undefined;

  constructor() {
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY;
  }

  /**
   * Get Ethereum wallet balance
   */
  async getEthereumBalance(address: string): Promise<WalletBalance> {
    try {
      const params: any = {
        chainid: 1, // Ethereum mainnet
        module: "account",
        action: "balance",
        address,
        tag: "latest",
      };

      if (this.etherscanApiKey) {
        params.apikey = this.etherscanApiKey;
      }

      const response = await axios.get(ETHERSCAN_BASE_URL, { params });

      if (response.data.status === "1") {
        const balanceWei = response.data.result;
        const balanceEth = parseFloat(balanceWei) / 1e18;

        return {
          address,
          balance: balanceEth,
          chain: "ethereum",
        };
      }

      throw new Error("Failed to fetch Ethereum balance");
    } catch (error) {
      console.error("Error fetching Ethereum balance:", error);
      throw error;
    }
  }

  /**
   * Get Ethereum transaction history
   */
  async getEthereumTransactions(
    address: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    try {
      const params: any = {
        chainid: 1, // Ethereum mainnet
        module: "account",
        action: "txlist",
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: limit,
        sort: "desc",
      };

      if (this.etherscanApiKey) {
        params.apikey = this.etherscanApiKey;
      }

      const response = await axios.get(ETHERSCAN_BASE_URL, { params });

      if (response.data.status === "1") {
        return response.data.result.map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: parseFloat(tx.value) / 1e18,
          timestamp: new Date(parseInt(tx.timeStamp) * 1000),
          status: tx.isError === "0" ? "success" : "failed",
          gasUsed: parseInt(tx.gasUsed),
          gasPrice: parseFloat(tx.gasPrice) / 1e9, // Convert to Gwei
        }));
      }

      return [];
    } catch (error) {
      console.error("Error fetching Ethereum transactions:", error);
      throw error;
    }
  }

  /**
   * Get Bitcoin wallet balance
   */
  async getBitcoinBalance(address: string): Promise<WalletBalance> {
    try {
      const response = await axios.get(
        `${BLOCKCHAIN_INFO_BASE_URL}/q/addressbalance/${address}`
      );

      const balanceSatoshi = response.data;
      const balanceBTC = balanceSatoshi / 1e8;

      return {
        address,
        balance: balanceBTC,
        chain: "bitcoin",
      };
    } catch (error) {
      console.error("Error fetching Bitcoin balance:", error);
      throw error;
    }
  }

  /**
   * Get Bitcoin transactions
   */
  async getBitcoinTransactions(
    address: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    try {
      const response = await axios.get(
        `${BLOCKCHAIN_INFO_BASE_URL}/rawaddr/${address}?limit=${limit}`
      );

      return response.data.txs.map((tx: any) => ({
        hash: tx.hash,
        from: tx.inputs[0]?.prev_out?.addr || "Unknown",
        to: tx.out[0]?.addr || "Unknown",
        value: tx.out[0]?.value ? tx.out[0].value / 1e8 : 0,
        timestamp: new Date(tx.time * 1000),
        status: "success",
      }));
    } catch (error) {
      console.error("Error fetching Bitcoin transactions:", error);
      throw error;
    }
  }

  /**
   * Get current gas prices for Ethereum
   */
  async getGasPrices(): Promise<{
    low: number;
    average: number;
    high: number;
  }> {
    try {
      const params: any = {
        chainid: 1, // Ethereum mainnet
        module: "gastracker",
        action: "gasoracle",
      };

      if (this.etherscanApiKey) {
        params.apikey = this.etherscanApiKey;
      }

      const response = await axios.get(ETHERSCAN_BASE_URL, { params });

      if (response.data.status === "1") {
        const result = response.data.result;
        return {
          low: parseFloat(result.SafeGasPrice),
          average: parseFloat(result.ProposeGasPrice),
          high: parseFloat(result.FastGasPrice),
        };
      }

      throw new Error("Failed to fetch gas prices");
    } catch (error) {
      console.error("Error fetching gas prices:", error);
      return { low: 0, average: 0, high: 0 };
    }
  }
}

export const blockchainService = new BlockchainService();
