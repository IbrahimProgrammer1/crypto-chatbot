#!/usr/bin/env node
// Complete verification script - Run this after getting your new API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
const https = require('https');
require('dotenv').config({ path: '.env.local' });

console.log("═══════════════════════════════════════════════════════");
console.log("  🔍 COMPLETE API KEY VERIFICATION");
console.log("═══════════════════════════════════════════════════════\n");

async function verifyEverything() {
  const apiKey = process.env.GEMINI_API_KEY;

  // Step 1: Check if key exists
  console.log("Step 1: Checking if API key exists...");
  if (!apiKey) {
    console.log("❌ FAILED: No GEMINI_API_KEY found in .env.local\n");
    console.log("📝 Action: Add your API key to .env.local file\n");
    return false;
  }
  console.log(`✅ PASSED: API key found (${apiKey.substring(0, 15)}...)\n`);

  // Step 2: Check key format
  console.log("Step 2: Checking API key format...");
  if (!apiKey.startsWith('AIzaSy')) {
    console.log("⚠️  WARNING: Key doesn't start with 'AIzaSy' (might be invalid)\n");
  } else {
    console.log("✅ PASSED: Key format looks correct\n");
  }

  // Step 3: Test with direct HTTP request
  console.log("Step 3: Testing API key with direct HTTP request...");
  const httpResult = await testHTTP(apiKey);
  if (!httpResult) {
    return false;
  }
  console.log("✅ PASSED: Direct HTTP request successful\n");

  // Step 4: Test with SDK
  console.log("Step 4: Testing with Google Generative AI SDK...");
  const sdkResult = await testSDK(apiKey);
  if (!sdkResult) {
    return false;
  }
  console.log("✅ PASSED: SDK test successful\n");

  // Step 5: Test streaming
  console.log("Step 5: Testing streaming response...");
  const streamResult = await testStreaming(apiKey);
  if (!streamResult) {
    return false;
  }
  console.log("✅ PASSED: Streaming test successful\n");

  // All tests passed!
  console.log("═══════════════════════════════════════════════════════");
  console.log("  🎉 ALL TESTS PASSED!");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log("✅ Your API key is valid and working!");
  console.log("✅ Your chatbot is ready to use!");
  console.log("\n📝 Next steps:");
  console.log("   1. Stop your dev server (Ctrl+C)");
  console.log("   2. Run: npm run dev");
  console.log("   3. Open: http://localhost:3000");
  console.log("   4. Test: Ask 'Hello, what can you help me with?'\n");

  return true;
}

function testHTTP(apiKey) {
  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const data = JSON.stringify({
      contents: [{ parts: [{ text: "Say hello" }] }]
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          console.log(`❌ FAILED: HTTP Status ${res.statusCode}`);
          const error = JSON.parse(responseData);
          console.log(`   Error: ${error.error.message}\n`);

          if (res.statusCode === 400 && error.error.message.includes('expired')) {
            console.log("📝 Action: Your API key is EXPIRED. Create a new one at:");
            console.log("   https://aistudio.google.com/app/apikey\n");
          } else if (res.statusCode === 403) {
            console.log("📝 Action: Enable the API at:");
            console.log("   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com\n");
          }
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ FAILED: ${error.message}\n`);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function testSDK(apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    const text = response.text();
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    return false;
  }
}

async function testStreaming(apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContentStream("Say hello");

    let hasContent = false;
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) hasContent = true;
    }

    return hasContent;
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}\n`);
    return false;
  }
}

// Run verification
verifyEverything().catch(error => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
});
