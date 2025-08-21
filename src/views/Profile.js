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

export const ProfileComponent = () => {
  const { user } = useAuth0();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [originalAddress, setOriginalAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE || "";

  const fetchProfile = async (userId) => {
    const res = await fetch(`${API_BASE}/.netlify/functions/getUserMetadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || "Failed to fetch profile");
    }
    const data = await res.json();
    return data;
  };

  const updateProfile = async (userId, nextPhone, nextAddress) => {
    const res = await fetch(
      `${API_BASE}/.netlify/functions/updateUserMetadata`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          user_metadata: {
            account: { phone: nextPhone, address: nextAddress },
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      throw new Error(err || "Failed to update profile");
    }
    return res.json();
  };

  useEffect(() => {
    if (!user?.sub) return;

    const localAccount = user?.user_metadata?.account || {};
    setPhone(localAccount.phone || "");
    setAddress(localAccount.address || "");
    setOriginalPhone(localAccount.phone || "");
    setOriginalAddress(localAccount.address || "");

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const freshUser = await fetchProfile(user.sub);
        if (cancelled) return;
        const acct = freshUser?.user_metadata?.account || {};
        setPhone(acct.phone || "");
        setAddress(acct.address || "");
        setOriginalPhone(acct.phone || "");
        setOriginalAddress(acct.address || "");
      } catch (e) {
        console.error("fetchProfile failed:", e);
        setMessage("⚠️ Could not load latest profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.sub]);

  const handleSave = async () => {
    if (!user?.sub) return;
    setLoading(true);
    setMessage("");
    try {
      await updateProfile(user.sub, phone, address);

      const updatedUser = await fetchProfile(user.sub);
      const acct = updatedUser?.user_metadata?.account || {};
      setPhone(acct.phone || "");
      setAddress(acct.address || "");
      setOriginalPhone(acct.phone || "");
      setOriginalAddress(acct.address || "");

      setMessage("✅ Profile updated!"); // update message
    } catch (err) {
      console.error(err);
      setMessage("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
