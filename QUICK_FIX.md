# ⚡ QUICK FIX GUIDE - Follow These Steps EXACTLY

## Your Current Problem
```
Error: "API key expired. Please renew the API key."
```

Your API key `AIzaSyDcRzYOgxX0K6KPkS9DRKKEb1RDbdlLkBE` is EXPIRED.

---

## ✅ 3-STEP FIX (Takes 2 Minutes)

### STEP 1: Get New API Key (1 minute)

1. Open this link: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project"
4. Copy the ENTIRE key (starts with AIzaSy...)

### STEP 2: Update .env.local (30 seconds)

1. Open: `D:\01-Professional-Portfolio\gemini-crypto-chatbot\.env.local`
2. Replace line 2:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
3. Save (Ctrl+S)

### STEP 3: Verify & Start (30 seconds)

Run these commands:
```bash
cd D:\01-Professional-Portfolio\gemini-crypto-chatbot
node verify-setup.js
```

If you see "🎉 ALL TESTS PASSED!", then run:
```bash
npm run dev
```

---

## ✅ What I've Already Fixed For You

1. ✅ Updated model to "gemini-pro" (most stable)
2. ✅ Fixed all error handling
3. ✅ Created verification script
4. ✅ Fixed CoinGecko API
5. ✅ Fixed news service

**Everything is ready. You just need a valid API key!**

---

## 🎯 After Getting New Key

Your chatbot will work IMMEDIATELY. Just:
1. Update .env.local with new key
2. Run: `node verify-setup.js`
3. Run: `npm run dev`
4. Test: "Hello, what can you help me with?"

---

## ❓ Still Having Issues?

If verify-setup.js shows errors, share the output and I'll help immediately.
