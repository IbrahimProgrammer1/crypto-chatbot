import { NextRequest, NextResponse } from "next/server";
import { coinGeckoService } from "@/services/coingecko";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const data = await coinGeckoService.getTrendingCoins();

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch trending coins" },
      { status: 500 }
    );
  }
}
