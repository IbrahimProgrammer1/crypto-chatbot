import { NextRequest, NextResponse } from "next/server";
import { coinGeckoService } from "@/services/coingecko";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ coinId: string }> }
) {
  try {
    const { coinId } = await params;

    if (!coinId) {
      return NextResponse.json(
        { error: "Coin ID is required" },
        { status: 400 }
      );
    }

    const data = await coinGeckoService.getCoinData(coinId);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Coin data API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch coin data" },
      { status: 500 }
    );
  }
}
