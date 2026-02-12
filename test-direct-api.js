// Direct HTTP test to check API access
const https = require('https');
require('dotenv').config({ path: '.env.local' });

function testDirectAPI() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("🔑 Testing API Key:", apiKey.substring(0, 15) + "...\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const data = JSON.stringify({
    contents: [{
      parts: [{
        text: "Say hello"
      }]
    }]
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log("📡 Making direct API request...\n");

  const req = https.request(url, options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}\n`);

      if (res.statusCode === 200) {
        console.log("✅ SUCCESS! Your API key works!\n");
        console.log("Response:", responseData.substring(0, 200) + "...\n");
        console.log("🎉 The chatbot should work now!\n");
      } else if (res.statusCode === 403) {
        console.log("❌ ERROR 403: API not enabled\n");
        console.log("📝 You need to enable the Generative Language API:");
        console.log("   1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
        console.log("   2. Click 'ENABLE'");
        console.log("   3. Wait 1-2 minutes");
        console.log("   4. Run this test again\n");
      } else if (res.statusCode === 404) {
        console.log("❌ ERROR 404: Model not found\n");
        console.log("Response:", responseData.substring(0, 500));
        console.log("\n📝 This usually means:");
        console.log("   1. The API is not enabled in your project");
        console.log("   2. OR you need to create a new API key from Google AI Studio\n");
      } else {
        console.log("❌ Error:", responseData);
      }
    });
  });

  req.on('error', (error) => {
    console.error("❌ Request failed:", error.message);
  });

  req.write(data);
  req.end();
}

testDirectAPI();
