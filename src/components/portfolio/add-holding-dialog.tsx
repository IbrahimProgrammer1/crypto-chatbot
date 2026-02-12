"use client";

import React, { useState } from "react";
import { usePortfolioStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Search } from "lucide-react";
import type { PortfolioHolding } from "@/types";

interface AddHoldingDialogProps {
  onClose: () => void;
}

export function AddHoldingDialog({ onClose }: AddHoldingDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { addHolding } = usePortfolioStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/market/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCoin = (coin: any) => {
    setSelectedCoin(coin);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCoin || !quantity || !purchasePrice) {
      alert("Please fill in all required fields");
      return;
    }

    const holding: PortfolioHolding = {
      id: Date.now().toString(),
      coinId: selectedCoin.id,
      symbol: selectedCoin.symbol,
      name: selectedCoin.name,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate: new Date(purchaseDate),
      currentPrice: selectedCoin.current_price,
    };

    addHolding(holding);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add Holding</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Coin Search */}
            {!selectedCoin ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Cryptocurrency</label>
                <div className="flex space-x-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Bitcoin, Ethereum..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                  />
                  <Button type="button" onClick={handleSearch} disabled={isSearching}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="border border-gray-200 dark:border-gray-800 rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((coin) => (
                      <button
                        key={coin.id}
                        type="button"
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
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCoin(null)}
                >
                  Change
                </Button>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Purchase Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Price (USD)</label>
              <Input
                type="number"
                step="any"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Purchase Date</label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>

            {/* Total Cost */}
            {quantity && purchasePrice && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Cost
                </p>
                <p className="text-xl font-bold">
                  ${(parseFloat(quantity) * parseFloat(purchasePrice)).toFixed(2)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedCoin} className="flex-1">
                Add Holding
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
