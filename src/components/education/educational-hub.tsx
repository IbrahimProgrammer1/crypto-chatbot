"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BookOpen, Search, GraduationCap, Lightbulb } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  category: "basics" | "defi" | "nft" | "trading" | "security";
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  content?: string;
}

const educationalTopics: Topic[] = [
  {
    id: "blockchain-basics",
    title: "What is Blockchain?",
    category: "basics",
    difficulty: "beginner",
    description: "Learn the fundamental concepts of blockchain technology",
  },
  {
    id: "bitcoin-intro",
    title: "Introduction to Bitcoin",
    category: "basics",
    difficulty: "beginner",
    description: "Understanding the first cryptocurrency and how it works",
  },
  {
    id: "ethereum-intro",
    title: "Introduction to Ethereum",
    category: "basics",
    difficulty: "beginner",
    description: "Learn about Ethereum and smart contracts",
  },
  {
    id: "defi-explained",
    title: "What is DeFi?",
    category: "defi",
    difficulty: "intermediate",
    description: "Decentralized Finance and its applications",
  },
  {
    id: "yield-farming",
    title: "Yield Farming & Liquidity Mining",
    category: "defi",
    difficulty: "advanced",
    description: "Advanced DeFi strategies for earning returns",
  },
  {
    id: "nft-basics",
    title: "Understanding NFTs",
    category: "nft",
    difficulty: "beginner",
    description: "Non-Fungible Tokens and digital ownership",
  },
  {
    id: "trading-basics",
    title: "Crypto Trading Fundamentals",
    category: "trading",
    difficulty: "beginner",
    description: "Basic concepts of cryptocurrency trading",
  },
  {
    id: "technical-analysis",
    title: "Technical Analysis",
    category: "trading",
    difficulty: "intermediate",
    description: "Reading charts and identifying patterns",
  },
  {
    id: "wallet-security",
    title: "Wallet Security Best Practices",
    category: "security",
    difficulty: "beginner",
    description: "How to keep your crypto assets safe",
  },
  {
    id: "private-keys",
    title: "Private Keys & Seed Phrases",
    category: "security",
    difficulty: "intermediate",
    description: "Understanding cryptographic security",
  },
];

const glossaryTerms = [
  { term: "HODL", definition: "Hold On for Dear Life - a strategy of holding crypto long-term despite volatility" },
  { term: "FOMO", definition: "Fear Of Missing Out - anxiety about missing potential gains" },
  { term: "FUD", definition: "Fear, Uncertainty, and Doubt - negative information spread to influence prices" },
  { term: "Altcoin", definition: "Any cryptocurrency other than Bitcoin" },
  { term: "Market Cap", definition: "Total value of a cryptocurrency (price × circulating supply)" },
  { term: "Whale", definition: "An individual or entity holding large amounts of cryptocurrency" },
  { term: "Gas Fees", definition: "Transaction fees paid on blockchain networks like Ethereum" },
  { term: "Staking", definition: "Locking up crypto to support network operations and earn rewards" },
  { term: "Mining", definition: "Process of validating transactions and creating new coins" },
  { term: "Smart Contract", definition: "Self-executing contracts with terms written in code" },
  { term: "DEX", definition: "Decentralized Exchange - peer-to-peer trading without intermediaries" },
  { term: "CEX", definition: "Centralized Exchange - traditional crypto exchange with central authority" },
  { term: "Cold Wallet", definition: "Offline storage for cryptocurrencies (hardware wallet)" },
  { term: "Hot Wallet", definition: "Online wallet connected to the internet" },
  { term: "Airdrop", definition: "Free distribution of tokens to wallet addresses" },
];

export function EducationalHub() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicContent, setTopicContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showGlossary, setShowGlossary] = useState(false);

  const loadTopicContent = async (topic: Topic) => {
    setSelectedTopic(topic);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Explain the cryptocurrency concept "${topic.title}" at a ${topic.difficulty} level. Keep it educational, clear, and concise (3-4 paragraphs). Include practical examples where relevant.`,
        }),
      });

      const data = await response.json();
      setTopicContent(data.response);
    } catch (error) {
      console.error("Error loading topic:", error);
      setTopicContent("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = educationalTopics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || topic.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || topic.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const filteredGlossary = glossaryTerms.filter((item) =>
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedTopic) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedTopic(null)}>
          ← Back to Topics
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedTopic.title}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {selectedTopic.description}
                </p>
                <div className="flex space-x-2 mt-3">
                  <Badge variant="outline" className="capitalize">
                    {selectedTopic.category}
                  </Badge>
                  <Badge
                    variant={
                      selectedTopic.difficulty === "beginner"
                        ? "success"
                        : selectedTopic.difficulty === "intermediate"
                        ? "default"
                        : "danger"
                    }
                    className="capitalize"
                  >
                    {selectedTopic.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{topicContent}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-strong border-0">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 glass rounded-xl">
              <GraduationCap className="h-6 w-6 text-pink-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-display">Crypto Education</CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Learn about cryptocurrency, blockchain, and DeFi at your own pace
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={!showGlossary ? "default" : "outline"}
          onClick={() => setShowGlossary(false)}
          className={!showGlossary ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-glow-sm" : "glass hover:glass-strong"}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Topics
        </Button>
        <Button
          variant={showGlossary ? "default" : "outline"}
          onClick={() => setShowGlossary(true)}
          className={showGlossary ? "bg-gradient-to-r from-pink-500 to-rose-500 shadow-glow-sm" : "glass hover:glass-strong"}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Glossary
        </Button>
      </div>

      {/* Search - Centered and limited width */}
      <Card className="glass-strong border-0">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={showGlossary ? "Search glossary..." : "Search topics..."}
                className="pl-12 pr-4 h-12 glass-strong border-0 text-base focus:ring-2 focus:ring-pink-500/50 transition-all"
              />
            </div>
          </div>

          {!showGlossary && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-gradient-to-r from-pink-500 to-rose-500" : "glass hover:glass-strong"}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "basics" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("basics")}
                className={selectedCategory === "basics" ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "glass hover:glass-strong"}
              >
                Basics
              </Button>
              <Button
                variant={selectedCategory === "defi" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("defi")}
                className={selectedCategory === "defi" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "glass hover:glass-strong"}
              >
                DeFi
              </Button>
              <Button
                variant={selectedCategory === "nft" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("nft")}
                className={selectedCategory === "nft" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "glass hover:glass-strong"}
              >
                NFT
              </Button>
              <Button
                variant={selectedCategory === "trading" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("trading")}
                className={selectedCategory === "trading" ? "bg-gradient-to-r from-orange-500 to-red-500" : "glass hover:glass-strong"}
              >
                Trading
              </Button>
              <Button
                variant={selectedCategory === "security" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("security")}
                className={selectedCategory === "security" ? "bg-gradient-to-r from-cyan-500 to-blue-500" : "glass hover:glass-strong"}
              >
                Security
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      {!showGlossary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic, index) => (
            <Card
              key={topic.id}
              className="glass-strong border-0 group hover:glass transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-md cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => loadTopicContent(topic)}
            >
              <CardContent className="pt-6 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-bold text-lg group-hover:text-pink-400 transition-colors flex-1">
                    {topic.title}
                  </h3>
                  <BookOpen className="h-5 w-5 text-pink-400/50 group-hover:text-pink-400 transition-colors flex-shrink-0 ml-2" />
                </div>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {topic.description}
                </p>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="capitalize text-xs glass border-0">
                    {topic.category}
                  </Badge>
                  <Badge
                    variant={
                      topic.difficulty === "beginner"
                        ? "success"
                        : topic.difficulty === "intermediate"
                        ? "default"
                        : "danger"
                    }
                    className="capitalize text-xs"
                  >
                    {topic.difficulty}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-strong border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
              Crypto Glossary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredGlossary.map((item, index) => (
                <div
                  key={item.term}
                  className="p-4 glass rounded-xl hover:glass-strong transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <h4 className="font-display font-bold text-base mb-2 text-pink-400">{item.term}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
