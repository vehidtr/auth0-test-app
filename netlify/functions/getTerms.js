import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCorsHeaders, handleOptions } from "./utils/auth0.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function handler(event) {
  const optionsResp = handleOptions(event);
  if (optionsResp) return optionsResp;

  const corsHeaders = getCorsHeaders(event.headers.origin);

  try {
    const filePath = path.resolve(__dirname, "../data/terms.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const termsData = JSON.parse(raw);

    const latest = termsData[termsData.length - 1];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        latest,
        all: termsData,
      }),
    };
  } catch (err) {
    console.error("Error loading terms.json:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
}