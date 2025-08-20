import { Fragment } from "react";

const Home = () => (
  <Fragment>
    {/* Top Intro / Welcome Section */}
    <section className="bg-primary text-white text-center py-5">
      <div className="container">
        <h1 className="display-4 fw-bold">Welcome to Our Auth0 Demo App</h1>
        <p className="lead mt-3">
          Explore how easy it is to integrate secure authentication and
          authorization into your applications with <strong>Auth0</strong>.
        </p>
        <a href="/about" className="btn btn-light btn-lg mt-4">
          Learn About Auth0
        </a>
      </div>
    </section>

    {/* Features Grid */}
    <section className="container my-5">
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">🔐 Secure Authentication</h5>
              <p className="card-text text-muted">
                Auth0 makes it easy to add authentication and authorization to
                your app with robust security standards like OAuth2, OIDC, and
                JWT.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">⚡ Fast Integration</h5>
              <p className="card-text text-muted">
                Get started quickly with prebuilt login pages, SDKs, and APIs
                designed for modern SPAs and mobile apps.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title fw-bold">🌍 Multi-Tenant Support</h5>
              <p className="card-text text-muted">
                Support multiple organizations and manage users easily with
                Auth0’s organization and tenant features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why Choose Auth0 CTA */}
    <section className="bg-light py-5 my-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-3">Why Choose Auth0?</h2>
        <p className="lead text-muted mb-4">
          Auth0 gives you the flexibility to implement authentication the way
          you want — without reinventing the wheel.
        </p>
        <a href="/about" className="btn btn-primary btn-lg">
          Learn More
        </a>
      </div>
    </section>
  </Fragment>
);

export default Home;
