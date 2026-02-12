import { NextRequest, NextResponse } from "next/server";
import { coinGeckoService } from "@/services/coingecko";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const data = await coinGeckoService.searchCoins(query);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search coins" },
      { status: 500 }
    );
  }
}
