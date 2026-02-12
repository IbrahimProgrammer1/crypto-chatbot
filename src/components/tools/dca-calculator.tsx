"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatCurrency } from "@/utils/helpers";
import { Calculator, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DCAResult {
  totalInvested: number;
  totalCoins: number;
  averagePrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  investmentSchedule: {
    date: string;
    investment: number;
    price: number;
    coins: number;
    totalCoins: number;
    totalInvested: number;
  }[];
}

export function DCACalculator() {
  const [coinId, setCoinId] = useState("bitcoin");
  const [investmentAmount, setInvestmentAmount] = useState("100");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [duration, setDuration] = useState("12"); // months
  const [result, setResult] = useState<DCAResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>({
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `/api/market/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSelectCoin = (coin: any) => {
    setSelectedCoin(coin);
    setCoinId(coin.id);
    setSearchResults([]);
    setSearchQuery("");
  };

  const calculateDCA = async () => {
    setLoading(true);
    try {
      const durationMonths = parseInt(duration);
      const amount = parseFloat(investmentAmount);

      // Calculate number of investments based on frequency
      let numberOfInvestments = 0;
      switch (frequency) {
        case "daily":
          numberOfInvestments = durationMonths * 30;
          break;
        case "weekly":
          numberOfInvestments = durationMonths * 4;
          break;
        case "monthly":
          numberOfInvestments = durationMonths;
          break;
      }

      // Fetch historical data
      const days = durationMonths * 30;
      const response = await fetch(`/api/market/${coinId}/chart?days=${days}`);
      const data = await response.json();

      if (!data.success || !data.data.prices) {
        throw new Error("Failed to fetch historical data");
      }

      const prices = data.data.prices;
      const interval = Math.floor(prices.length / numberOfInvestments);

      let totalInvested = 0;
      let totalCoins = 0;
      const schedule: DCAResult["investmentSchedule"] = [];

      for (let i = 0; i < numberOfInvestments; i++) {
        const priceIndex = Math.min(i * interval, prices.length - 1);
        const [timestamp, price] = prices[priceIndex];
        const coins = amount / price;

        totalInvested += amount;
        totalCoins += coins;

        schedule.push({
          date: new Date(timestamp).toLocaleDateString(),
          investment: amount,
          price,
          coins,
          totalCoins,
          totalInvested,
        });
      }

      const currentPrice = prices[prices.length - 1][1];
      const currentValue = totalCoins * currentPrice;
      const averagePrice = totalInvested / totalCoins;
      const profitLoss = currentValue - totalInvested;
      const profitLossPercentage = (profitLoss / totalInvested) * 100;

      setResult({
        totalInvested,
        totalCoins,
        averagePrice,
        currentValue,
        profitLoss,
        profitLossPercentage,
        investmentSchedule: schedule,
      });
    } catch (error) {
      console.error("DCA calculation error:", error);
      alert("Failed to calculate DCA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.investmentSchedule.map((item) => ({
    date: item.date,
    invested: item.totalInvested,
    value: item.totalCoins * item.price,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-6 w-6 text-blue-600" />
            <CardTitle>Dollar-Cost Averaging (DCA) Calculator</CardTitle>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Calculate the potential returns of investing a fixed amount regularly over time.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coin Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cryptocurrency</label>
              {!searchResults.length ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-semibold">{selectedCoin.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                      {selectedCoin.symbol}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(selectedCoin.name)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cryptocurrency..."
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), handleSearch())
                      }
                    />
                    <Button onClick={handleSearch}>Search</Button>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => handleSelectCoin(coin)}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        {coin.thumb && (
                          <img
                            src={coin.thumb}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{coin.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Investment Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Amount (USD)</label>
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="100"
                min="1"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Investment Frequency</label>
              <div className="grid grid-cols-3 gap-2">
                {(["daily", "weekly", "monthly"] as const).map((freq) => (
                  <Button
                    key={freq}
                    variant={frequency === freq ? "default" : "outline"}
                    onClick={() => setFrequency(freq)}
                    className="capitalize"
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Months)</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="12"
                min="1"
                max="60"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={calculateDCA}
              disabled={loading || !investmentAmount || !duration}
              className="w-full"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate DCA Returns
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>DCA Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Invested
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.totalInvested)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Current Value
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Profit/Loss
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      result.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(result.profitLoss))}
                  </p>
                  <p
                    className={`text-sm ${
                      result.profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.profitLoss >= 0 ? "+" : ""}
                    {result.profitLossPercentage.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total {selectedCoin.symbol.toUpperCase()}
                  </p>
                  <p className="text-2xl font-bold">
                    {result.totalCoins.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Avg: {formatCurrency(result.averagePrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Investment Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    formatter={(value: number | undefined) =>
                      value !== undefined ? formatCurrency(value) : "N/A"
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Total Invested"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Portfolio Value"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
