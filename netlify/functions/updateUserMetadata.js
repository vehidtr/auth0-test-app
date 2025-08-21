import {
  handleOptions,
  getManagementToken,
  getCorsHeaders,
} from "./utils/auth0.js";

export async function handler(event) {
  // Handle CORS preflight
  const optionsResp = handleOptions(event);
  if (optionsResp) return optionsResp;

  const corsHeaders = getCorsHeaders(event.headers.origin);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: "Method Not Allowed",
    };
  }

  try {
    const { userId, user_metadata } = JSON.parse(event.body);
    const token = await getManagementToken();

    const res = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(
        userId
      )}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_metadata }),
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
