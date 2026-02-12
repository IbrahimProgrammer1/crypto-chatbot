import { NextRequest, NextResponse } from "next/server";
import { coinGeckoService } from "@/services/coingecko";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ coinId: string }> }
) {
  try {
    const { coinId } = await params;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");
    const currency = searchParams.get("currency") || "usd";

    if (!coinId) {
      return NextResponse.json(
        { error: "Coin ID is required" },
        { status: 400 }
      );
    }

    const data = await coinGeckoService.getCoinMarketChart(
      coinId,
      days,
      currency
    );

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Chart data API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
