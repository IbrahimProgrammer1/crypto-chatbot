import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Message,
  Portfolio,
  PortfolioHolding,
  UserPreferences,
  PriceAlert,
  CoinData,
} from "@/types";

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
}

interface PortfolioStore {
  portfolio: Portfolio | null;
  addHolding: (holding: PortfolioHolding) => void;
  removeHolding: (holdingId: string) => void;
  updateHolding: (holdingId: string, updates: Partial<PortfolioHolding>) => void;
  updatePortfolioValues: (prices: Record<string, number>) => void;
  clearPortfolio: () => void;
}

interface WatchlistStore {
  watchlist: string[];
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  clearWatchlist: () => void;
}

interface AlertStore {
  alerts: PriceAlert[];
  addAlert: (alert: PriceAlert) => void;
  removeAlert: (alertId: string) => void;
  updateAlert: (alertId: string, updates: Partial<PriceAlert>) => void;
}

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

interface MarketStore {
  cachedCoins: Record<string, CoinData>;
  cacheTimestamp: number;
  updateCache: (coins: CoinData[]) => void;
  getCachedCoin: (coinId: string) => CoinData | undefined;
  isCacheValid: () => boolean;
}

// Chat Store
export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "chat-storage",
    }
  )
);

// Portfolio Store
export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      portfolio: null,
      addHolding: (holding) =>
        set((state) => {
          if (!state.portfolio) {
            return {
              portfolio: {
                id: "default",
                name: "My Portfolio",
                holdings: [holding],
                totalValue: 0,
                totalCost: holding.purchasePrice * holding.quantity,
                totalProfitLoss: 0,
                totalProfitLossPercentage: 0,
                lastUpdated: new Date(),
              },
            };
          }

          return {
            portfolio: {
              ...state.portfolio,
              holdings: [...state.portfolio.holdings, holding],
              totalCost:
                state.portfolio.totalCost +
                holding.purchasePrice * holding.quantity,
              lastUpdated: new Date(),
            },
          };
        }),
      removeHolding: (holdingId) =>
        set((state) => {
          if (!state.portfolio) return state;

          const holding = state.portfolio.holdings.find(
            (h) => h.id === holdingId
          );
          if (!holding) return state;

          return {
            portfolio: {
              ...state.portfolio,
              holdings: state.portfolio.holdings.filter(
                (h) => h.id !== holdingId
              ),
              totalCost:
                state.portfolio.totalCost -
                holding.purchasePrice * holding.quantity,
              lastUpdated: new Date(),
            },
          };
        }),
      updateHolding: (holdingId, updates) =>
        set((state) => {
          if (!state.portfolio) return state;

          return {
            portfolio: {
              ...state.portfolio,
              holdings: state.portfolio.holdings.map((h) =>
                h.id === holdingId ? { ...h, ...updates } : h
              ),
              lastUpdated: new Date(),
            },
          };
        }),
      updatePortfolioValues: (prices) =>
        set((state) => {
          if (!state.portfolio) return state;

          const updatedHoldings = state.portfolio.holdings.map((holding) => ({
            ...holding,
            currentPrice: prices[holding.coinId] || holding.currentPrice,
          }));

          const totalValue = updatedHoldings.reduce(
            (sum, h) => sum + (h.currentPrice || 0) * h.quantity,
            0
          );

          const totalCost = updatedHoldings.reduce(
            (sum, h) => sum + h.purchasePrice * h.quantity,
            0
          );

          const totalProfitLoss = totalValue - totalCost;
          const totalProfitLossPercentage =
            totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

          return {
            portfolio: {
              ...state.portfolio,
              holdings: updatedHoldings,
              totalValue,
              totalCost,
              totalProfitLoss,
              totalProfitLossPercentage,
              lastUpdated: new Date(),
            },
          };
        }),
      clearPortfolio: () => set({ portfolio: null }),
    }),
    {
      name: "portfolio-storage",
    }
  )
);

// Watchlist Store
export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      watchlist: [],
      addToWatchlist: (coinId) =>
        set((state) => ({
          watchlist: state.watchlist.includes(coinId)
            ? state.watchlist
            : [...state.watchlist, coinId],
        })),
      removeFromWatchlist: (coinId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((id) => id !== coinId),
        })),
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    {
      name: "watchlist-storage",
    }
  )
);

// Alert Store
export const useAlertStore = create<AlertStore>()(
  persist(
    (set) => ({
      alerts: [],
      addAlert: (alert) =>
        set((state) => ({
          alerts: [...state.alerts, alert],
        })),
      removeAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.filter((a) => a.id !== alertId),
        })),
      updateAlert: (alertId, updates) =>
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === alertId ? { ...a, ...updates } : a
          ),
        })),
    }),
    {
      name: "alerts-storage",
    }
  )
);

// Preferences Store
export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        theme: "dark",
        currency: "USD",
        notifications: true,
        riskProfile: "moderate",
        favoriteCoins: [],
      },
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
    }),
    {
      name: "preferences-storage",
    }
  )
);

// Market Data Cache Store
export const useMarketStore = create<MarketStore>()((set, get) => ({
  cachedCoins: {},
  cacheTimestamp: 0,
  updateCache: (coins) =>
    set({
      cachedCoins: coins.reduce(
        (acc, coin) => {
          acc[coin.id] = coin;
          return acc;
        },
        {} as Record<string, CoinData>
      ),
      cacheTimestamp: Date.now(),
    }),
  getCachedCoin: (coinId) => get().cachedCoins[coinId],
  isCacheValid: () => {
    const CACHE_DURATION = 60000; // 1 minute
    return Date.now() - get().cacheTimestamp < CACHE_DURATION;
  },
}));
