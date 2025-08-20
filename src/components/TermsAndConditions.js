const TermsAndConditions = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
      <h2 className="text-lg font-bold mb-2">Terms and Conditions</h2>
      <div className="h-40 overflow-y-scroll border p-2 mb-1 text-sm space-y-3">
        <p>
          Welcome to <strong>auth0</strong>. By using our services, you agree to
          the following terms and conditions. Please read them carefully before
          accepting.
        </p>

        <p>
          <strong>1. Use of Service:</strong> You agree to use this service only
          for lawful purposes and in compliance with all applicable laws and
          regulations.
        </p>

        <p>
          <strong>2. Account Information:</strong> You are responsible for
          keeping your profile information accurate and up to date. Do not share
          your account credentials with others.
        </p>

        <p>
          <strong>3. Privacy:</strong> We respect your privacy. Your data will
          only be used in accordance with our Privacy Policy and will never be
          shared with third parties without your consent, except where required
          by law.
        </p>

        <p>
          <strong>4. Limitation of Liability:</strong> We make reasonable
          efforts to provide a reliable service, but we are not liable for any
          damages or data loss caused by the use of this service.
        </p>

        <p>
          <strong>5. Changes:</strong> We may update these terms from time to
          time. Continued use of the service means you agree to the updated
          terms.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
