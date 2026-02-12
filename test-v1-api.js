// Test with v1 API endpoint instead of v1beta
const https = require('https');
require('dotenv').config({ path: '.env.local' });

async function testV1API() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("🔍 Testing with v1 API endpoint (instead of v1beta)...\n");

  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of modelsToTest) {
    console.log(`Testing: ${modelName} with v1 API...`);

    // Try v1 endpoint
    const v1Result = await testWithVersion(apiKey, modelName, "v1");
    if (v1Result) {
      console.log(`  ✅ SUCCESS with v1 API!\n`);
      console.log(`🎉 Your API key works with: v1/${modelName}\n`);
      return { version: "v1", model: modelName };
    }

    // Try v1beta endpoint
    console.log(`  Trying v1beta...`);
    const v1betaResult = await testWithVersion(apiKey, modelName, "v1beta");
    if (v1betaResult) {
      console.log(`  ✅ SUCCESS with v1beta API!\n`);
      console.log(`🎉 Your API key works with: v1beta/${modelName}\n`);
      return { version: "v1beta", model: modelName };
    }

    console.log(`  ❌ Failed with both versions\n`);
  }

  console.log("❌ No working combination found.\n");
  return null;
}

function testWithVersion(apiKey, modelName, version) {
  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${apiKey}`;

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
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    req.on('error', () => resolve(false));
    req.write(data);
    req.end();
  });
}

testV1API();
