import { CohereClient } from "cohere-ai";
import type { Message, ChatContext } from "@/types";

/**
 * Cohere AI Service
 * Handles all interactions with Cohere's API for chat functionality
 */
class CohereService {
  private client: CohereClient;
  private model: string;

  constructor() {
    const apiKey = process.env.COHERE_API_KEY || "";
    this.client = new CohereClient({
      token: apiKey,
    });
    // Using command-r7b-12-2024 which is the current available model
    this.model = "command-r7b-12-2024";
  }

  /**
   * Generate streaming response from Cohere
   */
  async *generateStreamingResponse(
    userMessage: string,
    context?: ChatContext
  ): AsyncGenerator<string, void, unknown> {
    try {
      const chatHistory = context?.messages
        ? this.buildConversationHistory(context.messages)
        : [];

      const stream = await this.client.chatStream({
        model: this.model,
        message: userMessage,
        chatHistory: chatHistory,
        temperature: 0.7,
        preamble: this.getCryptoPreamble(),
      });

      for await (const chunk of stream) {
        if (chunk.eventType === "text-generation") {
          yield chunk.text || "";
        }
      }
    } catch (error: any) {
      console.error("Error generating streaming response:", error);

      if (error?.message?.includes("429") || error?.message?.includes("rate limit")) {
        yield "I'm currently experiencing high demand. Please try again in a moment.";
      } else if (error?.message?.includes("401") || error?.message?.includes("unauthorized")) {
        yield "I'm having trouble connecting to the AI service. Please verify your Cohere API key is valid. Get a free key at: https://dashboard.cohere.com/api-keys";
      } else {
        yield "I encountered an error processing your request. Please try again.";
      }
    }
  }

  /**
   * Generate non-streaming response from Cohere
   */
  async generateResponse(
    userMessage: string,
    context?: ChatContext
  ): Promise<string> {
    try {
      const chatHistory = context?.messages
        ? this.buildConversationHistory(context.messages)
        : [];

      const response = await this.client.chat({
        model: this.model,
        message: userMessage,
        chatHistory: chatHistory,
        temperature: 0.7,
        preamble: this.getCryptoPreamble(),
      });

      return response.text;
    } catch (error: any) {
      console.error("Error generating response:", error);

      if (error?.message?.includes("429") || error?.message?.includes("rate limit")) {
        return "I'm currently experiencing high demand. Please try again in a moment.";
      } else if (error?.message?.includes("401") || error?.message?.includes("unauthorized")) {
        return "I'm having trouble connecting to the AI service. Please verify your Cohere API key is valid.";
      } else {
        return "I encountered an error processing your request. Please try again.";
      }
    }
  }

  /**
   * Build conversation history for Cohere
   */
  private buildConversationHistory(messages: Message[]): any[] {
    const history: any[] = [];

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];

      if (msg.role === "system") continue;

      history.push({
        role: msg.role === "user" ? "USER" : "CHATBOT",
        message: msg.content,
      });
    }

    return history;
  }

  /**
   * Get crypto-specific preamble for the AI
   */
  private getCryptoPreamble(): string {
    return `You are CryptoAI, an expert cryptocurrency and blockchain assistant. You provide accurate, helpful information about:
- Cryptocurrency prices, market data, and trends
- Blockchain technology and how it works
- DeFi (Decentralized Finance) concepts and protocols
- NFTs and digital assets
- Trading strategies and technical analysis
- Wallet security and best practices
- Crypto news and market sentiment

Important guidelines:
- Always provide educational, informative responses
- Never give specific financial advice or tell users to buy/sell specific assets
- Include disclaimers when discussing investments
- Explain complex concepts in simple terms
- Be helpful, friendly, and professional
- If you don't know something, admit it rather than guessing
- Focus on facts and avoid speculation

Remember: You are an educational assistant, not a financial advisor.`;
  }
}

export const cohereService = new CohereService();
