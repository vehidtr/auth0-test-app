import {
  getManagementToken,
  getCorsHeaders,
  handleOptions,
} from "./utils/auth0.js";

export async function handler(event) {
  // Handle preflight CORS requests
  const optionsResp = handleOptions(event);
  if (optionsResp) return optionsResp;

  // Add CORS headers
  const corsHeaders = getCorsHeaders(event.headers.origin);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { userId, touVersion } = JSON.parse(event.body);
    if (!userId || !touVersion) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing userId or touVersion" }),
      };
    }

    const token = await getManagementToken();

    // Fetch existing user metadata
    const userUrl = `https://${
      process.env.AUTH0_DOMAIN
    }/api/v2/users/${encodeURIComponent(userId)}`;
    const res = await fetch(userUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(user));

    // Merge accepted terms
    const accepted = user.app_metadata?.acceptedTermsOfUse || [];
    if (!accepted.includes(touVersion)) {
      accepted.push(touVersion);
    }

    // Update Auth0 user metadata
    const updateRes = await fetch(userUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_metadata: { acceptedTermsOfUse: accepted },
      }),
    });
    const updated = await updateRes.json();
    if (!updateRes.ok) throw new Error(JSON.stringify(updated));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(updated.app_metadata),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
