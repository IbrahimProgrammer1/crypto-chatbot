import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message, ChatContext } from "@/types";

/**
 * Google Gemini AI Service
 * Free tier: 60 requests per minute
 */
class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);

    // Using gemini-pro which is the most stable and widely available model
    this.modelName = "gemini-pro";

    try {
      this.model = this.genAI.getGenerativeModel({
        model: this.modelName,
      });
    } catch (error) {
      console.error("Error initializing Gemini model:", error);
      throw new Error("Failed to initialize Gemini AI. Please check your API key.");
    }
  }

  /**
   * System prompt for crypto chatbot context
   */
  private getSystemPrompt(): string {
    return `You are CryptoAI, an expert cryptocurrency assistant. Your role is to help users with:

1. Real-time market data and analysis
2. Portfolio management and tracking
3. Cryptocurrency education and explanations
4. News analysis and sentiment
5. Investment planning (educational, not financial advice)
6. Blockchain explorer queries
7. Technical analysis basics

IMPORTANT GUIDELINES:
- Always provide educational content, never specific financial advice
- Include disclaimers when discussing investments
- Be accurate with data and cite sources when possible
- Explain complex concepts in simple terms
- Adapt your language to the user's knowledge level
- When discussing prices, always mention they are real-time estimates
- Encourage users to do their own research (DYOR)
- Never guarantee returns or predict exact future prices
- Focus on risk management and diversification

RESPONSE STYLE:
- Be conversational and friendly
- Use clear, concise language
- Break down complex topics into digestible parts
- Use examples when helpful
- Ask clarifying questions when needed
- Provide actionable insights

Remember: You're an educational assistant, not a financial advisor. Always emphasize that users should consult with licensed financial professionals for investment decisions.`;
  }

  /**
   * Build conversation history for context
   */
  private buildConversationHistory(messages: Message[]): any[] {
    const history = messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // Gemini requires the first message to be from 'user'
    // If the first message is from 'model', remove it
    if (history.length > 0 && history[0].role === "model") {
      history.shift();
    }

    // Ensure we don't have consecutive messages from the same role
    const cleanedHistory: any[] = [];
    for (let i = 0; i < history.length; i++) {
      if (i === 0 || history[i].role !== history[i - 1].role) {
        cleanedHistory.push(history[i]);
      }
    }

    return cleanedHistory;
  }

  /**
   * Generate a response from Gemini
   */
  async generateResponse(
    userMessage: string,
    context?: ChatContext
  ): Promise<string> {
    try {
      const chat = this.model.startChat({
        history: context?.messages
          ? this.buildConversationHistory(context.messages)
          : [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      // Add system context if available
      let enhancedMessage = userMessage;
      if (context) {
        const contextInfo = [];

        if (context.currentPortfolio) {
          contextInfo.push(
            `User's Portfolio: ${context.currentPortfolio.holdings.length} holdings, Total Value: $${context.currentPortfolio.totalValue.toFixed(2)}`
          );
        }

        if (context.watchlist.length > 0) {
          contextInfo.push(`Watchlist: ${context.watchlist.join(", ")}`);
        }

        if (context.userPreferences) {
          contextInfo.push(
            `Risk Profile: ${context.userPreferences.riskProfile}, Currency: ${context.userPreferences.currency}`
          );
        }

        if (contextInfo.length > 0) {
          enhancedMessage = `[Context: ${contextInfo.join(" | ")}]\n\n${userMessage}`;
        }
      }

      const result = await chat.sendMessage(enhancedMessage);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("Error generating Gemini response:", error);

      // Handle rate limiting
      if (error?.message?.includes("429") || error?.message?.includes("quota")) {
        return "I'm currently experiencing high demand. Please try again in a moment. (Rate limit reached)";
      }

      // Handle model not found error
      if (error?.message?.includes("404") || error?.message?.includes("not found")) {
        return "I'm having trouble connecting to the AI service. Please check that your Gemini API key is valid and has access to the required models. You can get a free API key from https://makersuite.google.com/app/apikey";
      }

      throw error;
    }
  }

  /**
   * Generate streaming response from Gemini
   */
  async *generateStreamingResponse(
    userMessage: string,
    context?: ChatContext
  ): AsyncGenerator<string, void, unknown> {
    try {
      const chat = this.model.startChat({
        history: context?.messages
          ? this.buildConversationHistory(context.messages)
          : [],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      });

      const result = await chat.sendMessageStream(userMessage);

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield chunkText;
      }
    } catch (error: any) {
      console.error("Error generating streaming response:", error);

      if (error?.message?.includes("429") || error?.message?.includes("quota")) {
        yield "I'm currently experiencing high demand. Please try again in a moment.";
      } else if (error?.message?.includes("404") || error?.message?.includes("not found")) {
        yield "I'm having trouble connecting to the AI service. Please verify your Gemini API key is valid and try again. Get a free key at: https://makersuite.google.com/app/apikey";
      } else {
        yield "I encountered an error processing your request. Please try again.";
      }
    }
  }

  /**
   * Analyze news sentiment
   */
  async analyzeNewsSentiment(newsTitle: string, newsContent: string): Promise<{
    sentiment: "positive" | "negative" | "neutral";
    summary: string;
  }> {
    try {
      const prompt = `Analyze the sentiment of this crypto news article and provide a brief summary:

Title: ${newsTitle}
Content: ${newsContent}

Respond in JSON format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "summary": "Brief 1-2 sentence summary"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        sentiment: "neutral",
        summary: "Unable to analyze sentiment",
      };
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return {
        sentiment: "neutral",
        summary: "Sentiment analysis unavailable",
      };
    }
  }

  /**
   * Explain crypto concept
   */
  async explainConcept(
    concept: string,
    difficulty: "beginner" | "intermediate" | "advanced" = "beginner"
  ): Promise<string> {
    try {
      const prompt = `Explain the cryptocurrency concept "${concept}" at a ${difficulty} level.

Keep it concise (2-3 paragraphs), use clear language, and include a practical example if relevant.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error explaining concept:", error);
      throw error;
    }
  }

  /**
   * Generate investment insights (educational)
   */
  async generateInvestmentInsights(
    portfolioData: any,
    riskProfile: string
  ): Promise<string> {
    try {
      const prompt = `Based on this portfolio data and ${riskProfile} risk profile, provide educational insights about diversification and risk management:

${JSON.stringify(portfolioData, null, 2)}

Focus on:
1. Portfolio diversification analysis
2. Risk assessment
3. Educational suggestions for improvement
4. General market considerations

Remember: This is educational content, not financial advice.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating insights:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
