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
  Edit3,
  Save,
  X,
} from "lucide-react";

const PENDING_KEY = "pendingProfileUpdate";

export const ProfileComponent = () => {
  const { user, getAccessTokenSilently, getIdTokenClaims, loginWithRedirect } =
    useAuth0();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(user["https://tob/phone"] || "");
  const [address, setAddress] = useState(user["https://tob/address"] || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPhone(user["https://tob/phone"] || "");
    setAddress(user["https://tob/address"] || "");
  }, [user]);

  const updateProfile = async (values) => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "update:current_user_metadata",
      },
    });

    //  Update user_metadata via Auth0 Management API
    const response = await fetch(
      `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${user.sub}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_metadata: values }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(
        `Failed to update: ${errData.message || response.statusText}`
      );
    }

    // Force silent token refresh to get updated claims
    await getAccessTokenSilently({
      authorizationParams: { audience: process.env.REACT_APP_AUTH0_AUDIENCE },
      cacheMode: "off",
    });

    const newClaims = await getIdTokenClaims();

    // Update local state with refreshed claims
    setPhone(newClaims["https://tob/phone"] || "");
    setAddress(newClaims["https://tob/address"] || "");
  };

  // Save handler (handles consent + sessionStorage if needed)
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      try {
        // Try silent token request first
        await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "update:current_user_metadata",
          },
        });
      } catch (silentErr) {
        console.warn(
          "Silent token acquisition failed, trying redirect",
          silentErr
        );

        // Save pending updates before redirect
        sessionStorage.setItem(PENDING_KEY, JSON.stringify({ phone, address }));

        // Trigger consent screen if silent fails
        await loginWithRedirect({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: "update:current_user_metadata",
            redirect_uri: window.location.origin,
          },
          appState: { returnTo: window.location.pathname },
        });
        return;
      }

      await updateProfile({ phone, address });

      // Clear pending data if we saved successfully
      sessionStorage.removeItem(PENDING_KEY);

      setMessage("✅ Saved and refreshed!");
      setIsEditing(false);
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
        const { phone: p, address: a } = JSON.parse(pendingRaw);
        await updateProfile({ phone: p, address: a });
        setMessage("✅ Saved and refreshed!");
        setIsEditing(false);
      } catch (e) {
        console.error(e);
        setMessage(
          "❌ Error applying your saved changes after authorization: " +
            e.message
        );
      } finally {
        sessionStorage.removeItem(PENDING_KEY);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="mb-5">
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

          {isEditing ? (
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
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </li>
            </>
          ) : (
            <>
              {user["https://tob/phone"] && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Phone:</span>
                  <span>{user["https://tob/phone"]}</span>
                </li>
              )}

              {user["https://tob/address"] && (
                <li className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Address:</span>
                  <span>{user["https://tob/address"]}</span>
                </li>
              )}

              {user["https://tob/address"] || user["https://tob/address"] ? (
                <li className="mt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                </li>
              ) : null}
            </>
          )}
        </ul>
      </Row>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
