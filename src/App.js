import { useEffect, useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import AboutAuth0 from "./views/AboutAuth0";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import NotFound from "./views/NotFound";
import TermsAndConditions from "./components/TermsAndConditions";
import TermsModal from "./views/TermsModal";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const API_BASE = process.env.REACT_APP_API_BASE || "";

const App = () => {
  const { isLoading, error, user, isAuthenticated } = useAuth0();
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [latestVersion, setLatestVersion] = useState(null);

  useEffect(() => {
    const fetchLatestTerms = async () => {
      try {
        const res = await fetch(`${API_BASE}/.netlify/functions/getTerms`);
        const data = await res.json();

        const latest =
          data.latest ||
          data.all.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];

        setLatestVersion(latest.id);
      } catch (err) {
        console.error("Error fetching terms:", err);
      }
    };
    fetchLatestTerms();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && latestVersion) {
      const accepted =
        user["https://tob.ba/app_metadata"]?.acceptedTermsOfUse || [];
      setTermsAccepted(accepted.includes(latestVersion));
      setTermsChecked(true);
    } else if (!isAuthenticated) {
      setTermsChecked(true);
    }
  }, [isAuthenticated, user, latestVersion]);

  if (error) return <div>Oops... {error.message}</div>;
  if (isLoading || !termsChecked || !latestVersion) return <Loading />;

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />

        <Container className="flex-grow-1 mt-5 max-w-screen-xl">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/about" component={AboutAuth0} />
            <Route path="/terms" component={TermsAndConditions} />
            <Route component={NotFound} />
          </Switch>
        </Container>

        <Footer />

        {!termsAccepted && (
          <TermsModal
            onAccepted={() => setTermsAccepted(true)}
            latestVersion={latestVersion}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
