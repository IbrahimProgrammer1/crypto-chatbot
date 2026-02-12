"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ExternalLink, TrendingUp, Clock } from "lucide-react";
import type { NewsItem } from "@/types";

// Generate abstract crypto placeholder based on title hash
function getPlaceholderGradient(title: string): string {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-cyan-500 to-blue-600",
    "from-pink-500 to-rose-600",
  ];
  return gradients[hash % gradients.length];
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      setNews(data.data);
    } catch (err) {
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
            <TrendingUp className="h-5 w-5 mr-2 text-orange-400" />
            Latest Crypto News
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-strong border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <TrendingUp className="h-6 w-6 mr-3 text-orange-400" />
            Latest Crypto News
          </CardTitle>
          <p className="text-sm text-gray-400 mt-2">
            Stay updated with the latest cryptocurrency news and market insights
          </p>
        </CardHeader>
      </Card>

      {/* Masonry-style grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((item, index) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="glass-strong border-0 h-full hover:glass transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-md overflow-hidden">
              {/* Abstract gradient thumbnail */}
              <div className={`relative h-32 bg-gradient-to-br ${getPlaceholderGradient(item.title)} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-white/30" />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors flex-1">
                    {item.title}
                  </h4>
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 ml-2 flex-shrink-0 transition-colors" />
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <span className="font-medium text-gray-400">{item.source}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {item.coins && item.coins.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.coins.slice(0, 3).map((coin) => (
                      <span
                        key={coin}
                        className="px-2 py-1 glass text-blue-400 text-xs rounded-full font-medium uppercase tracking-wide"
                      >
                        {coin}
                      </span>
                    ))}
                    {item.coins.length > 3 && (
                      <span className="px-2 py-1 glass text-gray-500 text-xs rounded-full font-medium">
                        +{item.coins.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
