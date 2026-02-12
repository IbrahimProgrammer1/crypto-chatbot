"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "@/utils/helpers";
import { format } from "date-fns";

interface PriceChartProps {
  coinId: string;
  coinName: string;
}

type TimeRange = "1" | "7" | "30" | "90" | "365";

export function PriceChart({ coinId, coinName }: PriceChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("7");

  useEffect(() => {
    fetchChartData();
  }, [coinId, timeRange]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/market/${coinId}/chart?days=${timeRange}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }

      const data = await response.json();

      if (data.success && data.data.prices) {
        const formattedData = data.data.prices.map((item: [number, number]) => ({
          timestamp: item[0],
          price: item[1],
          date: format(new Date(item[0]), getDateFormat(timeRange)),
        }));

        setChartData(formattedData);
      }
    } catch (err) {
      console.error("Chart error:", err);
      setError("Failed to load chart data");
    } finally {
      setLoading(false);
    }
  };

  const getDateFormat = (range: TimeRange): string => {
    switch (range) {
      case "1":
        return "HH:mm";
      case "7":
        return "MMM dd";
      case "30":
        return "MMM dd";
      case "90":
        return "MMM dd";
      case "365":
        return "MMM yyyy";
      default:
        return "MMM dd";
    }
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "1", label: "24H" },
    { value: "7", label: "7D" },
    { value: "30", label: "30D" },
    { value: "90", label: "90D" },
    { value: "365", label: "1Y" },
  ];

  const calculateChange = () => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };

    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;

    return { value: change, percentage };
  };

  const change = calculateChange();
  const isPositive = change.value >= 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{coinName} Price Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{coinName} Price Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400 text-center py-8">
            {error}
          </p>
          <div className="flex justify-center">
            <Button onClick={fetchChartData}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{coinName} Price Chart</CardTitle>
            {chartData.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-2xl font-bold">
                  {formatCurrency(chartData[chartData.length - 1].price)}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {change.percentage.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "#10b981" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value: number | undefined) =>
                value !== undefined ? [formatCurrency(value), "Price"] : ["N/A", "Price"]
              }
              labelStyle={{ color: "#9ca3af" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fill="url(#colorPrice)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
