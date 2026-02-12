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

    if (!process.env.COHERE_API_KEY) {
      return NextResponse.json(
        { error: "Cohere API key not configured" },
        { status: 500 }
      );
    }

    // Process message with chat tools to detect intent and fetch data
    const { enhancedMessage } = await chatToolsService.processUserMessage(
      message,
      context
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of cohereService.generateStreamingResponse(
            enhancedMessage,
            context
          )) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Stream API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate streaming response" },
      { status: 500 }
    );
  }
}
