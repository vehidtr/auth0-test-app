// netlify/functions/getUserMetadata.js
import {
  corsHeaders,
  handleOptions,
  getManagementToken,
} from "./utils/auth0.js";

export async function handler(event) {
  // Handle CORS preflight
  const optionsResp = handleOptions(event);
  if (optionsResp) return optionsResp;

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: "Method Not Allowed",
    };
  }

  try {
    const { userId } = JSON.parse(event.body);
    const token = await getManagementToken();

    // Call Auth0 Management API
    const res = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(
        userId
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Error:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
