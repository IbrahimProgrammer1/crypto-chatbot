# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: For connecting your repository
3. **API Keys**: Obtain the required API keys (see below)

---

## 📋 Required API Keys

### 1. Cohere API Key (Required)
- **Get it from**: https://dashboard.cohere.com/api-keys
- **Purpose**: Powers the AI chatbot functionality
- **Free tier**: Available

### 2. CoinGecko API Key (Optional)
- **Get it from**: https://www.coingecko.com/en/api
- **Purpose**: Cryptocurrency market data
- **Note**: Free tier works without API key, but has rate limits

### 3. CryptoPanic API Key (Optional)
- **Get it from**: https://cryptopanic.com/developers/api/
- **Purpose**: Crypto news feed
- **Free tier**: Available

### 4. Etherscan API Key (Optional)
- **Get it from**: https://etherscan.io/apis
- **Purpose**: Blockchain transaction data
- **Free tier**: Available

---

## 🔧 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Production ready crypto chatbot"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `COHERE_API_KEY` | Your Cohere API key | ✅ Yes |
| `COINGECKO_API_KEY` | Your CoinGecko API key | ❌ Optional |
| `CRYPTOPANIC_API_KEY` | Your CryptoPanic API key | ❌ Optional |
| `ETHERSCAN_API_KEY` | Your Etherscan API key | ❌ Optional |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g., https://your-app.vercel.app) | ✅ Yes |

**Important**:
- Add these to **Production**, **Preview**, and **Development** environments
- After adding, redeploy your application

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

---

## 🔄 Automatic Deployments

Once connected, Vercel will automatically:
- Deploy on every push to `main` branch (Production)
- Create preview deployments for pull requests
- Run builds and tests before deploying

---

## 🎯 Post-Deployment Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Chat interface works (test with a message)
- [ ] Market data displays (check Market tab)
- [ ] News feed loads (check News tab)
- [ ] Portfolio functionality works
- [ ] Tools and Learn pages load
- [ ] Mobile responsiveness
- [ ] All API integrations work

---

## 🐛 Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

### API Errors
- Verify environment variables are set correctly
- Check API key validity
- Review API rate limits

### Images Not Loading
- Ensure image domains are configured in `next.config.ts`
- Check browser console for CORS errors

### Chat Not Working
- Verify `COHERE_API_KEY` is set
- Check Cohere API dashboard for usage/errors
- Review browser console for errors

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use Vercel Environment Variables** - Don't hardcode API keys
3. **Rotate API keys** if accidentally exposed
4. **Enable Vercel Authentication** for staging environments
5. **Set up rate limiting** for production APIs

---

## 📊 Performance Optimization

Your app is already optimized with:
- ✅ Image optimization (AVIF/WebP)
- ✅ Automatic code splitting
- ✅ Server-side rendering
- ✅ Compression enabled
- ✅ React Compiler enabled
- ✅ Glassmorphism with GPU acceleration

### Additional Optimizations

1. **Custom Domain**: Add your domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics
3. **Edge Functions**: Consider edge runtime for API routes
4. **Caching**: Configure cache headers for static assets

---

## 🌐 Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `cryptoai.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable

---

## 📈 Monitoring

### Vercel Analytics
- Enable in Project Settings → Analytics
- Track page views, performance, and user behavior

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Speed Insights

---

## 🔄 Updating Your Deployment

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push

# Vercel will automatically deploy the changes
```

---

## 💰 Pricing

### Vercel
- **Hobby Plan**: Free
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Perfect for personal projects

- **Pro Plan**: $20/month
  - More bandwidth
  - Team collaboration
  - Advanced analytics

### API Costs
- **Cohere**: Free tier available (limited requests)
- **CoinGecko**: Free tier sufficient for most use cases
- **CryptoPanic**: Free tier available
- **Etherscan**: Free tier available

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions

---

## 🎉 Success!

Your crypto chatbot is now live and production-ready!

**Next Steps:**
1. Share your deployment URL
2. Monitor performance and errors
3. Gather user feedback
4. Iterate and improve

---

## 📝 Environment Variables Template

Copy this to your Vercel Environment Variables:

```env
# Required
COHERE_API_KEY=your_cohere_api_key_here
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional
COINGECKO_API_KEY=
CRYPTOPANIC_API_KEY=
ETHERSCAN_API_KEY=
```

---

**Happy Deploying! 🚀**
