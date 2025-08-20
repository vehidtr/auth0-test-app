const NotFound = () => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center mt-5">
      <h1 className="display-3 fw-bold">404</h1>
      <p className="lead">Oops! The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary mt-3">
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
