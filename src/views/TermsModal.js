import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ReactMarkdown from "react-markdown";

const API_BASE = process.env.REACT_APP_API_BASE || "";

export default function TermsModal({ onAccepted }) {
  const { user, logout } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const termsRef = useRef(null);

  useEffect(() => {
    async function loadTerms() {
      try {
        const res = await fetch(`${API_BASE}/.netlify/functions/getTerms`);
        const data = await res.json();
        setTerms(data.latest);
      } catch (err) {
        console.error("Failed to load terms:", err);
      }
    }
    loadTerms();
  }, []);

  const handleDecline = () => {
    logout({ returnTo: window.location.origin });
  };

  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptTerms(user.sub, terms.id);
      onAccepted();
    } catch (err) {
      console.error("Failed to accept terms:", err);
      alert("Something went wrong while accepting terms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function acceptTerms(userId, touVersion) {
    const res = await fetch(`${API_BASE}/.netlify/functions/acceptTerms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, touVersion }),
    });

    if (!res.ok) {
      throw new Error(`Failed to accept terms: ${res.status}`);
    }

    return res.json();
  }

  // Watch scroll and enable button when bottom is reached
  const handleScroll = () => {
    const el = termsRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setScrolledToBottom(true);
    }
  };

  if (!terms) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
        <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-2 text-sm">
          Please read and scroll through the terms of service before accepting
        </p>

        <div
          ref={termsRef}
          onScroll={handleScroll}
          className="border rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-700 mb-6 prose prose-sm"
        >
          <ReactMarkdown>{terms.text}</ReactMarkdown>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleDecline}
            disabled={loading}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            No, Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={loading || !scrolledToBottom}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Accepting..."
              : scrolledToBottom
              ? "Yes, Accept"
              : "Scroll to Accept"}
          </button>
        </div>
      </div>
    </div>
  );
}
