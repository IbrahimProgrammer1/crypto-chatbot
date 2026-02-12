# 🔴 URGENT: Your API Key is EXPIRED

## The Problem
```
Error: "API key expired. Please renew the API key."
Status: API_KEY_INVALID
```

Your API key `AIzaSyDcRzYOgxX0K6KPkS9DRKKEb1RDbdlLkBE` is expired or invalid.

## ✅ SOLUTION: Create a Fresh API Key

### Step 1: Delete Old Key (Optional but Recommended)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your old key (ends with ...lLkBE)
3. Click the trash icon to delete it

### Step 2: Create a BRAND NEW Key

**IMPORTANT: Use Google AI Studio (NOT Google Cloud Console)**

1. **Go to:** https://aistudio.google.com/app/apikey

2. **Sign in** with your Google account

3. **Click:** "Create API key"

4. **Choose:** "Create API key in new project" (RECOMMENDED)
   - This ensures a fresh project with all APIs enabled

5. **Copy the ENTIRE key** (it will look like: AIzaSy...)
   - Make sure you copy ALL characters
   - No spaces before or after

### Step 3: Update Your .env.local File

1. Open: `D:\01-Professional-Portfolio\gemini-crypto-chatbot\.env.local`

2. Replace line 2 with your NEW key:
   ```
   GEMINI_API_KEY=your_brand_new_key_here
   ```

3. **SAVE the file** (Ctrl+S)

### Step 4: Test the New Key

```bash
cd D:\01-Professional-Portfolio\gemini-crypto-chatbot
node test-direct-api.js
```

You should see: ✅ SUCCESS! Your API key works!

### Step 5: Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 6: Test Your Chatbot

Open http://localhost:3000 and ask: "Hello, what can you help me with?"

---

## 🎯 Why This Happened

- The key might have been created in an old/test project
- It might have been revoked
- It might have been created with wrong permissions

Creating a NEW key in a NEW project will fix all these issues!

---

## ✅ After You Get the New Key

1. Update .env.local
2. Run: `node test-direct-api.js` (should show SUCCESS)
3. Run: `npm run dev`
4. Test the chatbot

**The chatbot WILL work with a valid, fresh API key!**
