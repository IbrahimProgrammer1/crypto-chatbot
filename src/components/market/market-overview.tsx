"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/helpers";
import type { CoinData } from "@/types";

// Mini sparkline component
function MiniSparkline({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 20;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="60" height="20" className="opacity-70">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#10b981" : "#f43f5e"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Get coin-specific glow color
function getCoinGlow(symbol: string): string {
  const glowMap: Record<string, string> = {
    btc: "shadow-[0_0_20px_rgba(247,147,26,0.15)]", // Bitcoin orange
    eth: "shadow-[0_0_20px_rgba(168,85,247,0.15)]", // Ethereum purple
    bnb: "shadow-[0_0_20px_rgba(234,179,8,0.15)]", // BNB yellow
    sol: "shadow-[0_0_20px_rgba(168,85,247,0.15)]", // Solana purple
    xrp: "shadow-[0_0_20px_rgba(6,182,212,0.15)]", // XRP cyan
    ada: "shadow-[0_0_20px_rgba(59,130,246,0.15)]", // Cardano blue
    doge: "shadow-[0_0_20px_rgba(234,179,8,0.15)]", // Doge yellow
    dot: "shadow-[0_0_20px_rgba(236,72,153,0.15)]", // Polkadot pink
  };
  return glowMap[symbol.toLowerCase()] || "shadow-glow-sm";
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await fetch("/api/market?perPage=10");
      if (!response.ok) throw new Error("Failed to fetch market data");
      const data = await response.json();
      setMarketData(data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load market data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-400" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-strong">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-emerald-400" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-rose-400 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-strong animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 mr-2 text-emerald-400 animate-pulse" />
          Market Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {marketData.map((coin, index) => {
            const isPositive = coin.price_change_percentage_24h >= 0;
            // Generate mock sparkline data based on price change
            const sparklineData = Array.from({ length: 12 }, (_, i) => {
              const trend = isPositive ? 1 : -1;
              return 50 + trend * (i * 2) + Math.random() * 10;
            });

            return (
              <div
                key={coin.id}
                className={`group relative flex items-center justify-between p-3 rounded-xl glass hover:glass-strong transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up ${getCoinGlow(coin.symbol)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-center space-x-3 flex-1 min-w-0">
                  {coin.image && (
                    <div className="relative">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-10 h-10 rounded-full ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-300"
                      />
                      {/* Glow effect behind icon */}
                      <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                        style={{
                          background: coin.symbol.toLowerCase() === 'btc' ? '#f7931a' :
                                     coin.symbol.toLowerCase() === 'eth' ? '#a855f7' :
                                     coin.symbol.toLowerCase() === 'bnb' ? '#eab308' : '#3b82f6'
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-100 truncate group-hover:text-white transition-colors">
                      {coin.name}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-medium tracking-wider">
                      {coin.symbol}
                    </p>
                  </div>
                </div>

                {/* Sparkline */}
                <div className="hidden sm:block mx-3">
                  <MiniSparkline data={sparklineData} isPositive={isPositive} />
                </div>

                <div className="relative text-right ml-2">
                  <p className="font-mono text-sm font-bold text-gray-100 group-hover:text-white transition-colors price-number">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <div className="flex items-center justify-end space-x-1.5 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold transition-all duration-300 ${
                        isPositive
                          ? "bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 group-hover:bg-rose-500/30"
                      }`}
                    >
                      {isPositive ? "+" : ""}{formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
