"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PriceChart } from "./price-chart";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/helpers";
import { TrendingUp, TrendingDown, Star, ArrowLeft } from "lucide-react";
import type { CoinData } from "@/types";

interface CoinDetailProps {
  coinId: string;
  onBack: () => void;
}

export function CoinDetail({ coinId, onBack }: CoinDetailProps) {
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoinData();
  }, [coinId]);

  const fetchCoinData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/market/${coinId}`);
      if (!response.ok) throw new Error("Failed to fetch coin data");

      const data = await response.json();
      if (data.success && data.data) {
        setCoin(data.data);
      }
    } catch (err) {
      console.error("Error fetching coin:", err);
      setError("Failed to load coin data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !coin) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-red-600 dark:text-red-400 text-center mb-4">
            {error || "Coin not found"}
          </p>
          <div className="flex justify-center">
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Coin Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {coin.image && (
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-3xl font-bold">{coin.name}</h1>
                  <span className="text-xl text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Rank #{coin.market_cap_rank}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Current Price
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(coin.current_price)}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <Badge variant={isPositive ? "success" : "danger"}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Market Cap
              </p>
              <p className="text-xl font-semibold">
                ${formatNumber(coin.market_cap)}
              </p>
              {coin.market_cap_change_percentage_24h !== undefined && (
                <p
                  className={`text-sm ${
                    coin.market_cap_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatPercentage(coin.market_cap_change_percentage_24h)}
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                24h Volume
              </p>
              <p className="text-xl font-semibold">
                ${formatNumber(coin.total_volume)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Circulating Supply
              </p>
              <p className="text-xl font-semibold">
                {formatNumber(coin.circulating_supply)}
              </p>
              {coin.max_supply && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Max: {formatNumber(coin.max_supply)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">24h High</p>
                <p className="font-semibold">{formatCurrency(coin.high_24h)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">24h Low</p>
                <p className="font-semibold">{formatCurrency(coin.low_24h)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">All-Time High</p>
                <p className="font-semibold">{formatCurrency(coin.ath)}</p>
                <p className="text-xs text-red-600">
                  {formatPercentage(coin.ath_change_percentage)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">All-Time Low</p>
                <p className="font-semibold">{formatCurrency(coin.atl)}</p>
                <p className="text-xs text-green-600">
                  {formatPercentage(coin.atl_change_percentage)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Chart */}
      <PriceChart coinId={coin.id} coinName={coin.name} />
    </div>
  );
}
