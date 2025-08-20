import { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {
  User,
  Signature,
  Mail,
  BadgeCheck,
  Hash,
  Phone,
  Home,
  Save,
} from "lucide-react";

const PENDING_KEY = "pendingProfileUpdate";

export const ProfileComponent = () => {
  const { user, getAccessTokenSilently, getIdTokenClaims, loginWithRedirect } =
    useAuth0();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalAddress, setOriginalAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load initial values from ID token claims
  useEffect(() => {
    const loadClaims = async () => {
      const claims = await getIdTokenClaims();
      const account = claims?.account || {};
      setPhone(account.phone || "");
      setAddress(account.address || "");
      setOriginalPhone(account.phone || "");
      setOriginalAddress(account.address || "");
    };
    loadClaims();
  }, [getIdTokenClaims]);

  const updateProfile = async ({ phone, address }) => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "update:current_user_metadata",
      },
    });

    const response = await fetch(
      `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${user.sub}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_metadata: {
            account: { phone, address },
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || response.statusText);
    }

    // Force silent token refresh to get updated claims
    await getAccessTokenSilently({
      authorizationParams: { audience: process.env.REACT_APP_AUTH0_AUDIENCE },
      cacheMode: "off",
    });

    const newClaims = await getIdTokenClaims();
    const account = newClaims?.account || {};
    setPhone(account.phone || "");
    setAddress(account.address || "");
    setOriginalPhone(account.phone || "");
    setOriginalAddress(account.address || "");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ phone, address, sub: user.sub })
      );

      await loginWithRedirect({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "update:current_user_metadata",
          redirect_uri: window.location.origin,
          prompt: "login",
        },
        appState: { returnTo: window.location.pathname },
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resume any pending update after redirect
  useEffect(() => {
    const pendingRaw = sessionStorage.getItem(PENDING_KEY);
    if (!pendingRaw) return;

    (async () => {
      try {
        setLoading(true);
        const {
          phone: pendingPhone,
          address: pendingAddress,
          sub: originalSub,
        } = JSON.parse(pendingRaw);

        // Prevent cross-account update
        if (user.sub !== originalSub) {
          setMessage("❌ Logged in as a different account. Update cancelled.");
          return;
        }

        await updateProfile({ phone: pendingPhone, address: pendingAddress });
        setMessage("✅ Saved and refreshed!");
      } catch (e) {
        console.error(e);
        setMessage("❌ Error applying saved changes: " + e.message);
      } finally {
        sessionStorage.removeItem(PENDING_KEY);
        setLoading(false);
      }
    })();
  }, [user.sub]);

  // Detect if values changed
  const isChanged = phone !== originalPhone || address !== originalAddress;

  return (
    <Container className="mb-5 max-w-screen-xl">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>

      <hr className="py-4" />

      {loading ? (
        <Loading />
      ) : (
        <Row>
          <ul className="space-y-2 text-gray-800 w-full">
            <li className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Name:</span>
              <span>{user.name}</span>
            </li>

            <li className="flex items-center gap-2">
              <Signature className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Nickname:</span>
              <span>{user.nickname}</span>
            </li>

            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Email:</span>
              <span>{user.email}</span>
            </li>

            <li className="flex items-center gap-2">
              <BadgeCheck
                className={`w-4 h-4 ${
                  user.email_verified ? "text-green-500" : "text-red-500"
                }`}
              />
              <span className="font-medium">Verified:</span>
              <span>{user.email_verified ? "Yes" : "No"}</span>
            </li>

            <li className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Sub:</span>
              <span className="truncate">{user.sub}</span>
            </li>

            <>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Phone:</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 p-1 border rounded"
                />
              </li>

              <li className="flex items-center gap-2">
                <Home className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Address:</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 p-1 border rounded"
                />
              </li>

              <li className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  disabled={loading || !isChanged}
                  className={`flex items-center gap-1 px-3 py-1 rounded ${
                    loading || !isChanged
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save"}
                </button>
              </li>
            </>
          </ul>
        </Row>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
