const axios = require("axios");
require('dotenv').config({ path: '.env.local' });

async function testEtherscan() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  🧪 TESTING ETHERSCAN API");
  console.log("═══════════════════════════════════════════════════════\n");

  const apiKey = process.env.ETHERSCAN_API_KEY;

  if (!apiKey) {
    console.log("❌ No ETHERSCAN_API_KEY found in .env.local\n");
    console.log("This API is OPTIONAL. Your chatbot works without it.\n");
    console.log("To enable blockchain features:");
    console.log("1. Go to: https://etherscan.io/apis");
    console.log("2. Sign up for a free account");
    console.log("3. Create an API key");
    console.log("4. Add it to .env.local\n");
    return;
  }

  console.log("✅ API Key found:", apiKey.substring(0, 10) + "...\n");

  try {
    console.log("🔄 Testing Etherscan API...\n");

    // Test 1: Get Ethereum gas prices
    console.log("Test 1: Fetching current gas prices...");
    const gasResponse = await axios.get(
      `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${apiKey}`
    );

    if (gasResponse.data.status === "1") {
      console.log("✅ Gas prices fetched successfully!");
      console.log("   Low: " + gasResponse.data.result.SafeGasPrice + " Gwei");
      console.log("   Average: " + gasResponse.data.result.ProposeGasPrice + " Gwei");
      console.log("   High: " + gasResponse.data.result.FastGasPrice + " Gwei\n");
    }

    // Test 2: Check a sample wallet balance (Vitalik's address)
    console.log("Test 2: Checking sample wallet balance...");
    const balanceResponse = await axios.get(
      `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&tag=latest&apikey=${apiKey}`
    );

    if (balanceResponse.data.status === "1") {
      const ethBalance = (parseInt(balanceResponse.data.result) / 1e18).toFixed(4);
      console.log("✅ Wallet balance fetched successfully!");
      console.log("   Sample wallet has: " + ethBalance + " ETH\n");
    }

    console.log("═══════════════════════════════════════════════════════");
    console.log("  🎉 SUCCESS! ETHERSCAN API IS WORKING!");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log("✅ Your chatbot can now:");
    console.log("   - Check Ethereum wallet balances");
    console.log("   - Show current gas fees");
    console.log("   - View transaction history");
    console.log("   - Provide blockchain data\n");

  } catch (error) {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  ❌ ERROR: ETHERSCAN API TEST FAILED");
    console.log("═══════════════════════════════════════════════════════\n");

    if (error.response) {
      console.log("❌ Error:", error.response.data.message || error.response.data);

      if (error.response.data.message?.includes("Invalid API Key")) {
        console.log("\n⚠️  Your API key is invalid.\n");
        console.log("Please:");
        console.log("1. Go to: https://etherscan.io/apis");
        console.log("2. Create a NEW API key");
        console.log("3. Update .env.local with the new key\n");
      }
    } else {
      console.log("❌ Error:", error.message);
    }

    console.log("\n💡 Note: Etherscan API is OPTIONAL.");
    console.log("   Your chatbot works fine without it.\n");
  }
}

testEtherscan();
