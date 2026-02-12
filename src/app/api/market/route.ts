import { NextRequest, NextResponse } from "next/server";
import { coinGeckoService } from "@/services/coingecko";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get("currency") || "usd";
    const perPage = parseInt(searchParams.get("perPage") || "100");
    const page = parseInt(searchParams.get("page") || "1");

    const data = await coinGeckoService.getMarketData(currency, perPage, page);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Market data API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
