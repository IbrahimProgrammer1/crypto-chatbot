"use client";

import React, { useState, useEffect } from "react";
import { usePortfolioStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddHoldingDialog } from "./add-holding-dialog";
import { formatCurrency, formatPercentage } from "@/utils/helpers";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit,
  PieChart as PieChartIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export function PortfolioDetail() {
  const { portfolio, removeHolding, updatePortfolioValues } = usePortfolioStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (portfolio && portfolio.holdings.length > 0) {
      updatePrices();
      const interval = setInterval(updatePrices, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [portfolio?.holdings.length]);

  const updatePrices = async () => {
    if (!portfolio || portfolio.holdings.length === 0) return;

    setIsUpdating(true);
    try {
      const coinIds = portfolio.holdings.map((h) => h.coinId);
      const response = await fetch(
        `/api/market?ids=${coinIds.join(",")}&perPage=${coinIds.length}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        const prices: Record<string, number> = {};
        data.data.forEach((coin: any) => {
          prices[coin.id] = coin.current_price;
        });
        updatePortfolioValues(prices);
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!portfolio || portfolio.holdings.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="glass-strong border-0">
          <CardContent className="flex flex-col items-center justify-center py-16 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse-glow" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {/* 3D-style wallet icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse-glow" />
                <div className="relative glass-strong p-8 rounded-3xl shadow-glow-lg">
                  <PieChartIcon className="h-20 w-20 text-purple-400" />
                </div>
              </div>

              <h3 className="text-2xl font-display font-bold mb-3 gradient-text">
                Start Your Crypto Journey
              </h3>
              <p className="text-gray-400 mb-2 text-center max-w-md leading-relaxed">
                Track your investments and watch your portfolio grow.
              </p>
              <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
                Add your first holding to unlock portfolio analytics, profit/loss tracking, and diversification insights.
              </p>

              {/* Progress indicator */}
              <div className="w-full max-w-md mb-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Profile Setup</span>
                  <span className="font-mono">0%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" />
                </div>
                <p className="text-xs text-gray-600 mt-2">Add your first holding to get started</p>
              </div>

              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-glow-lg hover:shadow-glow-lg hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Holding
              </Button>
            </div>
          </CardContent>
        </Card>
        {showAddDialog && <AddHoldingDialog onClose={() => setShowAddDialog(false)} />}
      </div>
    );
  }

  const isProfitable = portfolio.totalProfitLoss >= 0;

  // Prepare data for pie chart
  const chartData = portfolio.holdings.map((holding) => ({
    name: holding.symbol.toUpperCase(),
    value: (holding.currentPrice || holding.purchasePrice) * holding.quantity,
  }));

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Portfolio Overview</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={updatePrices}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Refresh"}
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Holding
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Value
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(portfolio.totalValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total Cost
              </p>
              <p className="text-2xl font-semibold">
                {formatCurrency(portfolio.totalCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Profit/Loss
              </p>
              <div className="flex items-center space-x-2">
                {isProfitable ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <p
                  className={`text-2xl font-semibold ${
                    isProfitable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(portfolio.totalProfitLoss))}
                </p>
                <Badge variant={isProfitable ? "success" : "danger"}>
                  {formatPercentage(portfolio.totalProfitLossPercentage)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diversification Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Diversification</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent !== undefined ? `${name} ${(percent * 100).toFixed(1)}%` : name
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) =>
                  value !== undefined ? formatCurrency(value) : "N/A"
                }
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Holdings List */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings ({portfolio.holdings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolio.holdings.map((holding) => {
              const currentValue =
                (holding.currentPrice || holding.purchasePrice) * holding.quantity;
              const costBasis = holding.purchasePrice * holding.quantity;
              const profitLoss = currentValue - costBasis;
              const profitLossPercentage = (profitLoss / costBasis) * 100;
              const isProfit = profitLoss >= 0;

              return (
                <div
                  key={holding.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-lg">{holding.name}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {holding.symbol}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Quantity</p>
                        <p className="font-semibold">{holding.quantity.toFixed(6)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Avg. Cost</p>
                        <p className="font-semibold">
                          {formatCurrency(holding.purchasePrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Current Price</p>
                        <p className="font-semibold">
                          {formatCurrency(holding.currentPrice || holding.purchasePrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total Value</p>
                        <p className="font-semibold">{formatCurrency(currentValue)}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        P/L:
                      </span>
                      <span
                        className={`font-semibold ${
                          isProfit ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(Math.abs(profitLoss))}
                      </span>
                      <Badge variant={isProfit ? "success" : "danger"} className="text-xs">
                        {formatPercentage(profitLossPercentage)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHolding(holding.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showAddDialog && <AddHoldingDialog onClose={() => setShowAddDialog(false)} />}
    </div>
  );
}
