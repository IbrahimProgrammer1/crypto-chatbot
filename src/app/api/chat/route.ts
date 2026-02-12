import { NextRequest, NextResponse } from "next/server";
import { cohereService } from "@/services/cohere";
import { chatToolsService } from "@/services/chat-tools";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if Cohere API key is configured
    if (!process.env.COHERE_API_KEY) {
      return NextResponse.json(
        { error: "Cohere API key not configured" },
        { status: 500 }
      );
    }

    // Process message with chat tools to detect intent and fetch data
    const { enhancedMessage, toolData, toolType } = await chatToolsService.processUserMessage(
      message,
      context
    );

    // Generate response with enhanced context
    const response = await cohereService.generateResponse(enhancedMessage, context);

    return NextResponse.json({
      response,
      toolData,
      toolType
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}
