import { NextRequest, NextResponse } from "next/server";
import { blockchainService } from "@/services/blockchain";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const chain = searchParams.get("chain") || "ethereum";

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    let data;
    if (chain === "ethereum") {
      data = await blockchainService.getEthereumBalance(address);
    } else if (chain === "bitcoin") {
      data = await blockchainService.getBitcoinBalance(address);
    } else {
      return NextResponse.json(
        { error: "Unsupported chain" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Blockchain balance API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
