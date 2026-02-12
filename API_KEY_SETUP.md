# IMPORTANT: Your Gemini API Key Setup

## ⚠️ Current Issue
Your API key is not working with Gemini models. This usually means:
- The key is invalid or expired
- The key was created for a different Google service
- The key doesn't have Gemini API access enabled

## ✅ How to Fix (Step-by-Step)

### Step 1: Get a NEW API Key

1. **Go to Google AI Studio:**
   👉 https://aistudio.google.com/app/apikey

   (NOT makersuite.google.com - that's the old URL)

2. **Sign in** with your Google account

3. **Click "Create API Key"**
   - Choose "Create API key in new project" (recommended)
   - OR select an existing Google Cloud project

4. **Copy the new API key** (it will look like: AIzaSy...)

### Step 2: Update Your .env.local File

1. Open: `D:\01-Professional-Portfolio\gemini-crypto-chatbot\.env.local`

2. Replace the GEMINI_API_KEY line with your NEW key:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```

3. Save the file

### Step 3: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test the Chatbot

Ask a simple question like:
- "Hello"
- "What is Bitcoin?"

## 🆓 Free Tier Limits

The free tier includes:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

This is MORE than enough for development and testing!

## 📝 Alternative: Use a Different Model

If you want to try a different AI service, you can also use:
- OpenAI GPT (requires paid API key)
- Anthropic Claude (requires API key)
- Local models (Ollama, LM Studio)

But Google Gemini is the easiest and completely FREE for your use case.

## ❓ Still Having Issues?

If you still get errors after getting a new key:
1. Make sure you're using the NEW Google AI Studio URL (aistudio.google.com)
2. Check that the key starts with "AIzaSy"
3. Verify there are no extra spaces in the .env.local file
4. Try creating the key in a NEW Google Cloud project

---

**Once you have a new key, update .env.local and restart the server!**
