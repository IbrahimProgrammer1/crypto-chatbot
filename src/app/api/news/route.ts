import { NextRequest, NextResponse } from "next/server";
import { newsService } from "@/services/news";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("filter") || "all") as any;
    const currencies = searchParams.get("currencies")?.split(",");

    const data = await newsService.getLatestNews(filter, currencies);

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch news" },
      { status: 500 }
    );
  }
}
