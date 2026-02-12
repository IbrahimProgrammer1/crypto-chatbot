// Complete status check and next steps guide
const https = require('https');
require('dotenv').config({ path: '.env.local' });

console.log("═══════════════════════════════════════════════════════");
console.log("  🔍 CHECKING YOUR SETUP STATUS");
console.log("═══════════════════════════════════════════════════════\n");

async function checkStatus() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("❌ No API key found in .env.local\n");
    return;
  }

  console.log(`✅ API Key found: ${apiKey.substring(0, 20)}...\n`);

  console.log("Testing API access...\n");

  // Test with the most common model
  const result = await testAPI(apiKey, "gemini-1.5-flash");

  if (result.success) {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  🎉 SUCCESS! YOUR API IS WORKING!");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log(`✅ Working model: ${result.model}`);
    console.log(`✅ API version: ${result.version}\n`);
    console.log("📝 Next steps:");
    console.log("   1. Your chatbot is ready!");
    console.log("   2. Run: npm run dev");
    console.log("   3. Open: http://localhost:3000");
    console.log("   4. Test: Ask 'Hello, what can you help me with?'\n");
    return true;
  } else {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  ❌ API NOT ENABLED YET");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log("The Generative Language API is not enabled for your project.\n");
    console.log("📝 TO FIX THIS:\n");
    console.log("Option 1: Enable the API (Recommended)");
    console.log("─────────────────────────────────────────────────────");
    console.log("1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
    console.log("2. Select your project from the dropdown");
    console.log("3. Click 'ENABLE'");
    console.log("4. Wait 1-2 minutes");
    console.log("5. Run this script again\n");

    console.log("Option 2: Create New Key with API Auto-Enabled");
    console.log("─────────────────────────────────────────────────────");
    console.log("1. Go to: https://aistudio.google.com/app/apikey");
    console.log("2. Click 'Create API key'");
    console.log("3. Choose 'Create API key in new project'");
    console.log("4. Copy the new key");
    console.log("5. Update .env.local with the new key");
    console.log("6. Run this script again\n");

    return false;
  }
}

async function testAPI(apiKey, modelName) {
  // Try both v1 and v1beta
  for (const version of ['v1', 'v1beta']) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${apiKey}`;

    const result = await makeRequest(url);

    if (result.success) {
      return { success: true, model: modelName, version };
    }
  }

  return { success: false };
}

function makeRequest(url) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }]
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
          resolve({ success: true });
        } else {
          resolve({ success: false, status: res.statusCode });
        }
      });
    });

    req.on('error', () => resolve({ success: false }));
    req.write(data);
    req.end();
  });
}

checkStatus();
