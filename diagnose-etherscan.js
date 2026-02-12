const axios = require("axios");
require('dotenv').config({ path: '.env.local' });

async function diagnoseEtherscan() {
  const apiKey = process.env.ETHERSCAN_API_KEY;

  console.log("═══════════════════════════════════════════════════════");
  console.log("  🔍 ETHERSCAN API DIAGNOSTIC");
  console.log("═══════════════════════════════════════════════════════\n");

  console.log("API Key:", apiKey.substring(0, 10) + "...\n");

  try {
    const response = await axios.get(
      `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${apiKey}`
    );

    console.log("Full Response:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("\n");

    if (response.data.status === "0") {
      console.log("❌ API returned error status");
      console.log("Error Message:", response.data.message);
      console.log("Result:", response.data.result);

      if (response.data.message.includes("Invalid API Key")) {
        console.log("\n🔧 FIX: Your API key is invalid");
        console.log("1. Go to: https://etherscan.io/myapikey");
        console.log("2. Log in to your account");
        console.log("3. Generate a NEW API key");
        console.log("4. Replace the key in .env.local");
      } else if (response.data.message.includes("rate limit")) {
        console.log("\n⏰ FIX: Rate limit exceeded");
        console.log("Wait a few minutes and try again");
      }
    } else {
      console.log("✅ API is working correctly!");
    }

  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }
}

diagnoseEtherscan();
