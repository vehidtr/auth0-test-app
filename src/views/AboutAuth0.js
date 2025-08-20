import { Container, Row, Col } from "reactstrap";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/Loading";

export const AboutAuth0 = () => {
  return (
    <Container className="mt-5 mb-5">
      {/* Hero Section */}
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 fw-bold">About Auth0</h1>
          <p className="lead text-muted">
            Secure authentication and authorization for modern applications.
          </p>
        </Col>
      </Row>

      {/* Intro */}
      <Row className="mb-5">
        <Col md={{ size: 8, offset: 2 }}>
          <p className="fs-5 text-center">
            Auth0 provides a complete identity solution, making it easy for
            developers to integrate secure login, Single Sign-On (SSO), and
            access control into their apps. Instead of building and maintaining
            your own identity system, Auth0 helps you save time and reduce
            security risks.
          </p>
        </Col>
      </Row>

      {/* Features */}
      <Row className="align-items-center mb-5">
        <Col md={6}>
          <h4 className="fw-semibold mb-3">Key Features</h4>
          <ul className="fs-5">
            <li>🌐 Universal Login for all your apps</li>
            <li>🔑 Single Sign-On (SSO)</li>
            <li>📱 Multi-Factor Authentication (MFA)</li>
            <li>⚙️ Customizable Actions & Rules</li>
            <li>🔗 Social & Enterprise Identity Providers</li>
          </ul>
        </Col>
        <Col md={6}>
          <img
            src="https://images.ctfassets.net/cdy7uua7fh8z/2SkfIOm4fFOJ8N0GNJwam8/77230cdb4411b2383751b037fb56fe29/2024-09-30_10-01-42.png"
            alt="Auth0 Features"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>

      {/* How It Works */}
      <Row className="mb-5">
        <Col>
          <h1 className="font-semibold text-xl mb-3 text-center">How It Works</h1>
          <p className="fs-5 text-center mb-4">
            Auth0 uses open standards like <strong>OAuth 2.0</strong> and{" "}
            <strong>OpenID Connect</strong> to securely authenticate users and
            authorize access to APIs.
          </p>
          <ol
            className="fs-5 text-center"
            style={{ listStyle: "decimal inside" }}
          >
            <li>User logs in via the Universal Login page.</li>
            <li>Auth0 validates identity and issues tokens.</li>
            <li>
              The application uses these tokens to access APIs and resources
              securely.
            </li>
          </ol>
        </Col>
      </Row>

      {/* Who Uses It */}
      <Row className="mb-5">
        <Col md={{ size: 8, offset: 2 }}>
          <h2 className="font-semibold text-xl mb-3 text-center">Who Uses Auth0?</h2>
          <p className="fs-5 text-center">
            Auth0 is trusted by startups, enterprises, and Fortune 500 companies
            to handle identity and security. It’s especially useful for:
          </p>
          <ul className="fs-5 text-center list-unstyled">
            <li>
              ✅ Apps that need secure login without reinventing the wheel
            </li>
            <li>✅ SaaS platforms with multi-tenant access</li>
            <li>✅ APIs requiring robust access control</li>
          </ul>
        </Col>
      </Row>

      {/* Learn More */}
      <Row className="text-center">
        <Col>
          <h2 className="font-semibold text-xl mb-3">Learn More</h2>
          <p className="fs-5">
            Visit the{" "}
            <a
              href="https://auth0.com/docs"
              target="_blank"
              rel="noreferrer"
              className="fw-bold"
            >
              Auth0 Documentation
            </a>{" "}
            for tutorials, best practices, and deep dives into authentication
            and authorization.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(AboutAuth0, {
  onRedirecting: () => <Loading />,
});
