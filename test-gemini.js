const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBHamQc1eD5OjqtmXqCd2FIrLICVbek6tA");

async function listModels() {
  try {
    console.log("Fetching available models...");
    const models = await genAI.listModels();
    console.log("\nAvailable models:");
    for await (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(
        `  Supported methods: ${model.supportedGenerationMethods.join(", ")}`
      );
      console.log("");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
