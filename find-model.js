// Find the correct model for your new API key
const https = require('https');
require('dotenv').config({ path: '.env.local' });

async function findWorkingModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("🔍 Testing different models with your API key...\n");

  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-pro",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-1.0-pro"
  ];

  for (const modelName of modelsToTest) {
    const result = await testModel(apiKey, modelName);
    if (result) {
      console.log(`\n✅ FOUND WORKING MODEL: "${modelName}"\n`);
      console.log("📝 I will update your code to use this model.\n");
      return modelName;
    }
  }

  console.log("\n❌ No working model found. This is unusual.\n");
  return null;
}

function testModel(apiKey, modelName) {
  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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

    console.log(`Testing: ${modelName}...`);

    const req = https.request(url, options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`  ✅ SUCCESS!`);
          resolve(true);
        } else {
          console.log(`  ❌ Failed (${res.statusCode})`);
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log(`  ❌ Request error`);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

findWorkingModel();
