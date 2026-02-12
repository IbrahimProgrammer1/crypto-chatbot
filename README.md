# CryptoAI - AI-Powered Crypto Chatbot

A production-ready, full-stack cryptocurrency chatbot application built with Next.js 16+ and Cohere AI. CryptoAI provides real-time market data, portfolio tracking, educational content, and personalized insights through an intelligent conversational interface.

![CryptoAI Banner](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🌟 Features

### 💬 AI-Powered Chat
- **Intelligent Conversations**: Powered by Cohere AI with context-aware responses
- **Streaming Responses**: Real-time text streaming for smooth user experience
- **Intent Detection**: Automatically detects user queries and fetches relevant data
- **Markdown Support**: Rich text formatting with syntax highlighting
- **Conversation Export**: Export chat history in JSON, TXT, Markdown, or HTML

### 📊 Real-Time Market Intelligence
- Live cryptocurrency prices and market data
- Top gainers/losers tracking
- Market cap rankings and 24h volume
- Historical price charts with multiple timeframes
- Multi-currency support (USD, EUR, BTC)
- Detailed coin information pages

### 💼 Portfolio Management
- Create and track multiple holdings
- Real-time portfolio value calculation
- Profit/loss analysis with percentage returns
- Diversification visualization with pie charts
- Add, edit, and remove holdings
- Persistent data storage

### 📰 News & Sentiment Analysis
- Aggregated crypto news from multiple sources
- AI-powered news summarization
- Sentiment analysis on articles
- Customizable news feed

### 🔔 Price Alerts
- Set custom price alerts for any cryptocurrency
- Browser notifications when targets are reached
- Above/below condition support
- Visual progress tracking

### 🧮 Investment Tools
- **DCA Calculator**: Calculate dollar-cost averaging returns over time
- **Portfolio Analytics**: Diversification metrics and risk assessment
- **Investment Planning**: Scenario modeling and projections

### 🎓 Educational Content
- Comprehensive crypto education hub
- Topics covering basics, DeFi, NFTs, trading, and security
- Interactive glossary with common crypto terms
- AI-generated explanations at different difficulty levels

### 🔗 Blockchain Explorer
- Ethereum wallet balance checking
- Transaction history viewing
- Gas fee estimation
- Multi-chain support (Ethereum, Bitcoin)

### 🎨 User Experience
- Clean, modern, and intuitive interface
- Dark/light mode toggle
- Fully responsive design (mobile-first)
- Smooth animations and transitions
- Accessibility compliant (WCAG 2.1 AA)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **UI Components**: Custom components with shadcn/ui patterns
- **Markdown**: react-markdown with syntax highlighting

### Backend
- **Runtime**: Next.js API Routes (Edge Runtime)
- **AI**: Cohere AI (command-r model)
- **Market Data**: CoinGecko API
- **News**: CryptoPanic API (optional)
- **Blockchain**: Etherscan API, Blockchain.com API

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Cohere API key (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gemini-crypto-chatbot.git
cd gemini-crypto-chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Required: Cohere API Key
COHERE_API_KEY=your_cohere_api_key_here

# Optional: CoinGecko API Key (for higher rate limits)
COINGECKO_API_KEY=

# Optional: CryptoPanic API Key (for news features)
CRYPTOPANIC_API_KEY=

# Optional: Etherscan API Key (for blockchain features)
ETHERSCAN_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### Cohere AI (Required)

1. Visit [Cohere Dashboard](https://dashboard.cohere.com/api-keys)
2. Sign up with your Google account or email
3. Click "Create API Key" or use the default key shown
4. Copy the key and add it to `.env.local` as `COHERE_API_KEY`

**Free Tier Limits**: 1,000 API calls per month (perfect for development!)

### CoinGecko API (Optional)

1. Visit [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Generate an API key from your dashboard
4. Add it to `.env.local` as `COINGECKO_API_KEY`

**Note**: The app works without this key but with lower rate limits.

### CryptoPanic API (Optional)

1. Visit [CryptoPanic Developers](https://cryptopanic.com/developers/api/)
2. Sign up and request an API key
3. Add it to `.env.local` as `CRYPTOPANIC_API_KEY`

**Note**: Without this key, the app uses mock news data.

### Etherscan API (Optional)

1. Visit [Etherscan API](https://etherscan.io/apis)
2. Create a free account
3. Generate an API key
4. Add it to `.env.local` as `ETHERSCAN_API_KEY`

**Note**: Required for blockchain explorer features.

## 📖 Usage

### Chat Interface

Ask CryptoAI anything about cryptocurrencies:
- "What's the current Bitcoin price?"
- "Show me top gainers today"
- "Explain what DeFi is"
- "Check Ethereum gas fees"
- "Analyze my portfolio"

The AI automatically detects your intent and fetches relevant data.

### Portfolio Management

1. Navigate to the Portfolio tab
2. Click "Add Holding"
3. Search for a cryptocurrency
4. Enter quantity, purchase price, and date
5. View real-time portfolio value and P/L

### Price Alerts

1. Go to Tools → Price Alerts
2. Click "Add Alert"
3. Select a cryptocurrency
4. Set condition (above/below) and target price
5. Enable browser notifications for alerts

### DCA Calculator

1. Go to Tools → DCA Calculator
2. Select a cryptocurrency
3. Enter investment amount and frequency
4. Choose duration in months
5. View projected returns and growth chart

## 🏗️ Project Structure

```
gemini-crypto-chatbot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── chat/          # Chat endpoints
│   │   │   ├── market/        # Market data endpoints
│   │   │   ├── news/          # News endpoints
│   │   │   └── blockchain/    # Blockchain endpoints
│   │   ├── privacy/           # Privacy policy page
│   │   ├── terms/             # Terms of service page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── chat/              # Chat interface
│   │   ├── market/            # Market components
│   │   ├── portfolio/         # Portfolio components
│   │   ├── news/              # News components
│   │   ├── tools/             # Investment tools
│   │   ├── education/         # Educational content
│   │   ├── ui/                # Reusable UI components
│   │   └── error-boundary.tsx # Error handling
│   ├── services/              # API services
│   │   ├── gemini.ts          # Gemini AI service
│   │   ├── coingecko.ts       # CoinGecko service
│   │   ├── news.ts            # News service
│   │   ├── blockchain.ts      # Blockchain service
│   │   └── chat-tools.ts      # Chat intent detection
│   ├── lib/                   # Utilities
│   │   └── store.ts           # Zustand state management
│   ├── types/                 # TypeScript types
│   │   └── index.ts           # Type definitions
│   └── utils/                 # Helper functions
│       ├── helpers.ts         # Utility functions
│       └── conversation-exporter.ts # Export functionality
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── .env.local                # Local environment variables (gitignored)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `COHERE_API_KEY` (required)
- `COINGECKO_API_KEY` (optional)
- `CRYPTOPANIC_API_KEY` (optional)
- `ETHERSCAN_API_KEY` (optional)
- `NEXT_PUBLIC_APP_URL` (your production URL)
- `NODE_ENV=production`

### Build for Production

```bash
npm run build
npm run start
```

## ⚠️ Important Disclaimers

**NOT FINANCIAL ADVICE**: This application provides educational content and information only. Nothing on this platform constitutes financial, investment, legal, or tax advice. Always:
- Do your own research (DYOR)
- Consult with licensed financial advisors
- Understand the risks of cryptocurrency investments
- Never invest more than you can afford to lose

**Age Requirement**: Users must be 18+ to use this application.

**Data Accuracy**: While we strive for accuracy, market data may be delayed or contain errors. Always verify information independently.

## 🔒 Privacy & Security

- Most data is stored locally in your browser (localStorage)
- Chat messages are processed through Google Gemini API
- No sensitive financial credentials are stored
- HTTPS encryption for all data transmission
- See [Privacy Policy](/privacy) and [Terms of Service](/terms) for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Cohere AI](https://cohere.com/) for the powerful conversational AI
- [CoinGecko](https://www.coingecko.com/) for cryptocurrency data
- [Next.js](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting
- [Recharts](https://recharts.org/) for beautiful charts

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact through the application

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced technical indicators
- [ ] Social trading features
- [ ] Mobile app (React Native)
- [ ] Tax reporting tools
- [ ] Advanced portfolio analytics
- [ ] Integration with more exchanges
- [ ] Community features

---

**Built with ❤️ for the crypto community**

⚠️ **Remember**: Cryptocurrency investments are highly speculative and volatile. This tool is for educational purposes only. Always do your own research and invest responsibly.
