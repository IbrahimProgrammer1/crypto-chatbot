"use client";

import React, { useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { MarketOverview } from "@/components/market/market-overview";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { PortfolioDetail } from "@/components/portfolio/portfolio-detail";
import { NewsFeed } from "@/components/news/news-feed";
import { ToolsHub } from "@/components/tools/tools-hub";
import { EducationalHub } from "@/components/education/educational-hub";
import { Button } from "@/components/ui/button";
import { usePreferencesStore } from "@/lib/store";
import {
  Menu,
  X,
  Moon,
  Sun,
  TrendingUp,
  Wallet,
  Newspaper,
  MessageSquare,
  Calculator,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "market" | "portfolio" | "news" | "tools" | "learn">("chat");
  const { preferences, updatePreferences } = usePreferencesStore();

  const toggleTheme = () => {
    const newTheme = preferences.theme === "dark" ? "light" : "dark";
    updatePreferences({ theme: newTheme });
    document.documentElement.classList.toggle("dark");
  };

  const tabs = [
    { id: "chat" as const, label: "Chat", icon: MessageSquare, color: "blue" },
    { id: "market" as const, label: "Market", icon: TrendingUp, color: "emerald" },
    { id: "portfolio" as const, label: "Portfolio", icon: Wallet, color: "purple" },
    { id: "news" as const, label: "News", icon: Newspaper, color: "orange" },
    { id: "tools" as const, label: "Tools", icon: Calculator, color: "cyan" },
    { id: "learn" as const, label: "Learn", icon: GraduationCap, color: "pink" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex lg:flex-col glass-strong border-r border-white/10 relative transition-all duration-300 ${sidebarOpen ? 'lg:w-80' : 'lg:w-20'}`}>
        {/* Vertical gradient accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-50" />

        <div className={`p-6 border-b border-white/10 ${!sidebarOpen && 'lg:p-4'}`}>
          <h1 className={`text-2xl font-display font-bold flex items-center group cursor-pointer transition-all ${!sidebarOpen && 'lg:flex-col lg:text-base'}`}>
            <div className="relative">
              <TrendingUp className={`${sidebarOpen ? 'h-7 w-7 mr-3' : 'h-6 w-6 lg:mr-0'} text-blue-500 group-hover:text-blue-400 transition-colors`} />
              <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
            </div>
            {sidebarOpen && <span className="gradient-text">CryptoAI</span>}
          </h1>
          {sidebarOpen && (
            <p className="text-sm text-gray-400 mt-2 font-medium">
              Your Intelligent Crypto Assistant
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {sidebarOpen ? (
            <>
              <MarketOverview />
              <PortfolioSummary />
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 glass rounded-xl cursor-pointer hover:glass-strong transition-all">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="p-3 glass rounded-xl cursor-pointer hover:glass-strong transition-all">
                <Wallet className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex items-center justify-center p-3 border-t border-white/10 hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-gray-400" />
          ) : (
            <Menu className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-80 glass-strong border-r border-white/10 flex flex-col animate-slide-right">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h1 className="text-2xl font-display font-bold flex items-center">
                <TrendingUp className="h-7 w-7 mr-3 text-blue-500" />
                <span className="gradient-text">CryptoAI</span>
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <MarketOverview />
              <PortfolioSummary />
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Header */}
        <header className="glass border-b border-white/10 px-4 py-3 shadow-glow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-white/10 hover:shadow-glow-sm transition-all duration-300"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <Button
                      key={tab.id}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative flex items-center space-x-2 transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-glow-md hover:shadow-glow-lg'
                          : 'hover:bg-white/10 hover:shadow-glow-sm'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
                      )}
                    </Button>
                  );
                })}
              </nav>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-white/10 hover:shadow-glow-sm transition-all duration-300 group"
            >
              {preferences.theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </Button>
          </div>

          {/* Mobile Tab Navigation */}
          <nav className="flex md:hidden space-x-2 mt-3 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 flex-shrink-0 transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-glow-md'
                      : 'hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </nav>
        </header>

        {/* Content Area with Animation */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full animate-fade-in">
            {activeTab === "chat" && <ChatInterface />}
            {activeTab === "market" && (
              <div className="h-full overflow-y-auto p-6">
                <MarketOverview />
              </div>
            )}
            {activeTab === "portfolio" && (
              <div className="h-full overflow-y-auto p-6">
                <PortfolioDetail />
              </div>
            )}
            {activeTab === "news" && (
              <div className="h-full overflow-y-auto p-6">
                <NewsFeed />
              </div>
            )}
            {activeTab === "tools" && (
              <div className="h-full overflow-y-auto p-6">
                <ToolsHub />
              </div>
            )}
            {activeTab === "learn" && (
              <div className="h-full overflow-y-auto p-6">
                <EducationalHub />
              </div>
            )}
          </div>
        </div>

        {/* Minimized Footer */}
        <footer className="glass border-t border-white/10 px-4 py-2">
          <p className="text-[10px] text-center text-gray-500 leading-relaxed opacity-60">
            <span className="text-yellow-400/70 mr-1">⚠️</span>
            <strong className="text-gray-400">Disclaimer:</strong>
            <span className="ml-1">
              Educational content only. Not financial advice. Crypto investments carry risk. DYOR.
            </span>
          </p>
          <div className="flex justify-center items-center space-x-3 mt-1">
            <a
              href="/terms"
              className="text-[10px] text-blue-400/70 hover:text-blue-300 hover:underline transition-colors"
            >
              Terms
            </a>
            <span className="text-[10px] text-gray-700">•</span>
            <a
              href="/privacy"
              className="text-[10px] text-blue-400/70 hover:text-blue-300 hover:underline transition-colors"
            >
              Privacy
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
