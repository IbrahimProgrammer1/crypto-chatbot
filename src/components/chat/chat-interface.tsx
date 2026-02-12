"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Send, Sparkles, Download, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ConversationExporter } from "@/utils/conversation-exporter";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isLoading, setLoading, clearMessages } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");
    setLoading(true);
    setIsStreaming(true);
    setStreamingMessage("");

    let accumulatedContent = "";

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            messages: messages.slice(-5),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                accumulatedContent += parsed.chunk;
                setStreamingMessage(accumulatedContent);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add final complete message to store
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: accumulatedContent,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
      setStreamingMessage("");

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please make sure your Gemini API key is configured in the .env.local file and try again.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
      setStreamingMessage("");
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const quickActions = [
    "Show Bitcoin price",
    "Top gainers today",
    "Explain DeFi",
    "Check Ethereum gas fees",
  ];

  const handleExport = (format: "json" | "text" | "markdown" | "html") => {
    if (messages.length === 0) {
      alert("No messages to export");
      return;
    }

    switch (format) {
      case "json":
        ConversationExporter.exportAsJSON(messages);
        break;
      case "text":
        ConversationExporter.exportAsText(messages);
        break;
      case "markdown":
        ConversationExporter.exportAsMarkdown(messages);
        break;
      case "html":
        ConversationExporter.exportAsHTML(messages);
        break;
    }

    setShowExportMenu(false);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear all messages?")) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with actions */}
      {messages.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {messages.length} messages
          </p>
          <div className="flex space-x-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport("text")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    Export as Text
                  </button>
                  <button
                    onClick={() => handleExport("markdown")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    Export as Markdown
                  </button>
                  <button
                    onClick={() => handleExport("html")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                  >
                    Export as HTML
                  </button>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center relative">
            {/* Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-glow" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10">
              <div className="relative inline-block mb-6">
                <Sparkles className="h-16 w-16 text-blue-500 animate-pulse" />
                <div className="absolute inset-0 blur-xl bg-blue-500 opacity-30 animate-pulse" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-3 gradient-text">Welcome to CryptoAI</h2>
              <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
                Your intelligent crypto assistant. Ask me about market data,
                portfolio management, blockchain queries, or crypto education.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {quickActions.map((action, index) => (
                  <button
                    key={action}
                    onClick={() => setInput(action)}
                    className="group relative px-4 py-3 rounded-full glass hover:glass-strong transition-all duration-300 hover:scale-105 hover:shadow-glow-md text-sm font-medium text-left animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10">{action}</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isStreaming && streamingMessage && (
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                  <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1"></span>
                </div>
              </div>
            )}
            {isLoading && !streamingMessage && (
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative glass-strong rounded-2xl p-1 shadow-glow-md hover:shadow-glow-lg transition-all duration-300">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-sm" />

            <div className="relative flex items-center bg-slate-900/50 rounded-xl px-4 py-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about crypto..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder:text-gray-500 pr-12"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
                className="absolute right-2 h-9 w-9 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
        <p className="text-[10px] text-gray-500 mt-3 text-center opacity-60">
          CryptoAI provides educational content, not financial advice. Always DYOR.
        </p>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-start space-x-3 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      } animate-slide-up`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isUser
            ? "bg-gradient-to-br from-gray-700 to-gray-800 ring-2 ring-gray-600/50"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-400/50 shadow-glow-md"
        }`}
      >
        {isUser ? (
          <span className="text-sm font-bold text-gray-200">U</span>
        ) : (
          <Sparkles className="h-5 w-5 text-white animate-pulse" />
        )}
      </div>
      <div
        className={`flex-1 rounded-2xl p-4 shadow-lg ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-glow-sm"
            : "glass-strong"
        }`}
      >
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
          {isUser ? (
            <p className="whitespace-pre-wrap text-white leading-relaxed">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code
                      className="px-1.5 py-0.5 rounded bg-gray-700/50 text-sm font-mono text-blue-300"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a: ({ node, children, ...props }: any) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <p
          className={`text-[10px] mt-2 ${
            isUser
              ? "text-blue-200/70"
              : "text-gray-500"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
