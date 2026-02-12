"use client";

import React, { useState } from "react";
import { usePortfolioStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/helpers";
import { AddHoldingDialog } from "./add-holding-dialog";

export function PortfolioSummary() {
  const { portfolio } = usePortfolioStore();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (!portfolio || portfolio.holdings.length === 0) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No portfolio holdings yet
              </p>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Holding
              </Button>
            </div>
          </CardContent>
        </Card>
        {showAddDialog && <AddHoldingDialog onClose={() => setShowAddDialog(false)} />}
      </>
    );
  }

  const isProfitable = portfolio.totalProfitLoss >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Value
            </p>
            <p className="text-3xl font-bold">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Cost
              </p>
              <p className="font-semibold">
                {formatCurrency(portfolio.totalCost)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profit/Loss
              </p>
              <div className="flex items-center space-x-1">
                {isProfitable ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p
                  className={`font-semibold ${
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

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold mb-2">Holdings</p>
            <div className="space-y-2">
              {portfolio.holdings.slice(0, 5).map((holding) => (
                <div
                  key={holding.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {holding.symbol.toUpperCase()}
                  </span>
                  <span className="font-semibold">
                    {holding.quantity.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
