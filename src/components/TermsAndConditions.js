import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Loading from "./Loading";

const API_BASE = process.env.REACT_APP_API_BASE || "";

const TermsAndConditions = () => {
  const [latestTerms, setLatestTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestTerms = async () => {
      try {
        const res = await fetch(`${API_BASE}/.netlify/functions/getTerms`);
        if (!res.ok) throw new Error(`Failed to fetch terms: ${res.status}`);
        const data = await res.json();

        setLatestTerms(data.latest);
      } catch (err) {
        console.error("Error fetching terms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTerms();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!latestTerms) return <div>No terms found.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 prose prose-lg">
      <ReactMarkdown>{latestTerms.text}</ReactMarkdown>
    </div>
  );
};

export default TermsAndConditions;
