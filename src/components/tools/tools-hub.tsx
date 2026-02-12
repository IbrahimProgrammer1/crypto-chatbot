"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DCACalculator } from "./dca-calculator";
import { PriceAlerts } from "./price-alerts";
import { Calculator, Bell, TrendingUp, PieChart, FileText } from "lucide-react";

type ToolType = "dca" | "alerts";

export function ToolsHub() {
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);

  if (activeTool === "dca") {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => setActiveTool(null)}
          className="mb-4 hover:bg-white/10"
        >
          ← Back to Tools
        </Button>
        <DCACalculator />
      </div>
    );
  }

  if (activeTool === "alerts") {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => setActiveTool(null)}
          className="mb-4 hover:bg-white/10"
        >
          ← Back to Tools
        </Button>
        <PriceAlerts />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-strong border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Investment Tools</CardTitle>
          <p className="text-sm text-gray-400 mt-2">
            Powerful tools to help you plan and manage your crypto investments
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DCA Calculator */}
        <Card className="glass-strong border-0 group hover:glass transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-lg cursor-pointer overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-300" />
          <CardContent className="pt-8 pb-6 relative">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="relative p-4 glass rounded-2xl group-hover:shadow-glow-md transition-all duration-300">
                  <Calculator className="h-8 w-8 text-blue-400" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  DCA Calculator
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Calculate potential returns from dollar-cost averaging strategy over time
                </p>
              </div>
              <Button
                onClick={() => setActiveTool("dca")}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300"
              >
                Open Calculator
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Price Alerts */}
        <Card className="glass-strong border-0 group hover:glass transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-lg cursor-pointer overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-300" />
          <CardContent className="pt-8 pb-6 relative">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="relative p-4 glass rounded-2xl group-hover:shadow-glow-emerald transition-all duration-300">
                  <Bell className="h-8 w-8 text-emerald-400" />
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <TrendingUp className="h-5 w-5 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                  Price Alerts
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Get notified when cryptocurrencies reach your target prices
                </p>
              </div>
              <Button
                onClick={() => setActiveTool("alerts")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-glow-sm group-hover:shadow-glow-emerald transition-all duration-300"
              >
                Manage Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-lg">Coming Soon</span>
            <span className="ml-2 px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">Beta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group p-5 glass rounded-xl opacity-60 hover:opacity-80 transition-all duration-300 cursor-not-allowed">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <PieChart className="h-5 w-5 text-purple-400" />
                </div>
                <h4 className="font-semibold">Risk Calculator</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Assess your risk tolerance and get personalized recommendations
              </p>
            </div>
            <div className="group p-5 glass rounded-xl opacity-60 hover:opacity-80 transition-all duration-300 cursor-not-allowed">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-400" />
                </div>
                <h4 className="font-semibold">Tax Calculator</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Estimate capital gains and tax obligations
              </p>
            </div>
            <div className="group p-5 glass rounded-xl opacity-60 hover:opacity-80 transition-all duration-300 cursor-not-allowed">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                </div>
                <h4 className="font-semibold">Rebalancing Tool</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Optimize your portfolio allocation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
