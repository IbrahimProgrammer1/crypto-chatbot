"use client";

import React, { useState, useEffect } from "react";
import { useAlertStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/helpers";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Search } from "lucide-react";
import type { PriceAlert } from "@/types";

export function PriceAlerts() {
  const { alerts, addAlert, removeAlert, updateAlert } = useAlertStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (alerts.length > 0) {
      updateCurrentPrices();
      const interval = setInterval(updateCurrentPrices, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  const updateCurrentPrices = async () => {
    if (alerts.length === 0) return;

    try {
      const coinIds = [...new Set(alerts.map((a) => a.coinId))];
      const response = await fetch(
        `/api/market?ids=${coinIds.join(",")}&perPage=${coinIds.length}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        const prices: Record<string, number> = {};
        data.data.forEach((coin: any) => {
          prices[coin.id] = coin.current_price;
        });
        setCurrentPrices(prices);

        // Check if any alerts should be triggered
        alerts.forEach((alert) => {
          if (!alert.active) return;

          const currentPrice = prices[alert.coinId];
          if (!currentPrice) return;

          const shouldTrigger =
            (alert.condition === "above" && currentPrice >= alert.targetPrice) ||
            (alert.condition === "below" && currentPrice <= alert.targetPrice);

          if (shouldTrigger) {
            triggerAlert(alert, currentPrice);
          }
        });
      }
    } catch (error) {
      console.error("Error updating prices:", error);
    }
  };

  const triggerAlert = (alert: PriceAlert, currentPrice: number) => {
    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Price Alert: ${alert.symbol.toUpperCase()}`, {
        body: `${alert.symbol.toUpperCase()} is now ${alert.condition} ${formatCurrency(alert.targetPrice)}. Current price: ${formatCurrency(currentPrice)}`,
        icon: "/favicon.ico",
      });
    }

    // Deactivate the alert
    updateAlert(alert.id, { active: false });
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

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

  const handleSelectCoin = async (coin: any) => {
    setSelectedCoin(coin);
    setSearchResults([]);
    setSearchQuery("");

    // Fetch current price
    try {
      const response = await fetch(`/api/market/${coin.id}`);
      const data = await response.json();
      if (data.success && data.data) {
        setTargetPrice(data.data.current_price.toString());
      }
    } catch (error) {
      console.error("Error fetching coin price:", error);
    }
  };

  const handleAddAlert = () => {
    if (!selectedCoin || !targetPrice) {
      window.alert("Please select a coin and enter a target price");
      return;
    }

    const alert: PriceAlert = {
      id: Date.now().toString(),
      coinId: selectedCoin.id,
      symbol: selectedCoin.symbol,
      condition,
      targetPrice: parseFloat(targetPrice),
      currentPrice: currentPrices[selectedCoin.id] || 0,
      active: true,
      createdAt: new Date(),
    };

    addAlert(alert);
    setShowAddDialog(false);
    setSelectedCoin(null);
    setTargetPrice("");
    requestNotificationPermission();
  };

  const activeAlerts = alerts.filter((a) => a.active);
  const triggeredAlerts = alerts.filter((a) => !a.active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-blue-600" />
              <CardTitle>Price Alerts</CardTitle>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Alert
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Get notified when cryptocurrencies reach your target prices
          </p>
        </CardHeader>
      </Card>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Alerts ({activeAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAlerts.map((alert) => {
                const currentPrice = currentPrices[alert.coinId] || alert.currentPrice;
                const progress =
                  alert.condition === "above"
                    ? (currentPrice / alert.targetPrice) * 100
                    : ((alert.targetPrice - currentPrice) / alert.targetPrice) * 100 + 100;

                return (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold uppercase">{alert.symbol}</h4>
                        {alert.condition === "above" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <Badge variant={alert.condition === "above" ? "success" : "danger"}>
                          {alert.condition === "above" ? "Above" : "Below"}{" "}
                          {formatCurrency(alert.targetPrice)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Current: {formatCurrency(currentPrice)} • Target:{" "}
                        {formatCurrency(alert.targetPrice)}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            alert.condition === "above"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAlert(alert.id)}
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Triggered Alerts ({triggeredAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {triggeredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-semibold uppercase">{alert.symbol}</h4>
                      <Badge variant="outline">Triggered</Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {formatCurrency(alert.targetPrice)} ({alert.condition})
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAlert(alert.id)}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {alerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Price Alerts</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Set up price alerts to get notified when cryptocurrencies reach your target prices.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Alert
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Alert Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Price Alert</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAddDialog(false);
                  setSelectedCoin(null);
                  setSearchResults([]);
                }}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coin Search */}
              {!selectedCoin ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Cryptocurrency</label>
                  <div className="flex space-x-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Bitcoin, Ethereum..."
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), handleSearch())
                      }
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
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
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {selectedCoin.thumb && (
                      <img
                        src={selectedCoin.thumb}
                        alt={selectedCoin.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{selectedCoin.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {selectedCoin.symbol}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCoin(null)}
                  >
                    Change
                  </Button>
                </div>
              )}

              {/* Condition */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Alert Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={condition === "above" ? "default" : "outline"}
                    onClick={() => setCondition("above")}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Above
                  </Button>
                  <Button
                    variant={condition === "below" ? "default" : "outline"}
                    onClick={() => setCondition("below")}
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Below
                  </Button>
                </div>
              </div>

              {/* Target Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Price (USD)</label>
                <Input
                  type="number"
                  step="any"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setSelectedCoin(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAlert}
                  disabled={!selectedCoin || !targetPrice}
                  className="flex-1"
                >
                  Add Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
