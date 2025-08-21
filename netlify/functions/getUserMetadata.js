import {
  getManagementToken,
  getCorsHeaders,
  handleOptions,
} from "./utils/auth0.js";

export async function handler(event) {
  const optionsResp = handleOptions(event);
  if (optionsResp) return optionsResp;

  const corsHeaders = getCorsHeaders(event.headers.origin);

  try {
    const { userId } = JSON.parse(event.body);
    const token = await getManagementToken();

    const res = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(
        userId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
