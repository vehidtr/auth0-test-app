import fs from "fs";
import path from "path";
import { getCorsHeaders, handleOptions } from "./utils/auth0.js";

export async function handler(event) {
  const optionsResp = handleOptions(event);
  if (optionsResp) return optionsResp;

  const corsHeaders = getCorsHeaders(event.headers.origin);

  try {
    const filePath = path.resolve("netlify/functions/data/terms.json");

    console.log("🔎 Looking for terms.json at:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("❌ terms.json not found!");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "terms.json not found at " + filePath }),
      };
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const termsData = JSON.parse(raw);

    const latest = termsData[termsData.length - 1];

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ latest, all: termsData }),
    };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
