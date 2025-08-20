const TermsAndConditions = ({ acceptedTerms, setShowModal }) => {
  return (
    <label className="flex items-center gap-2 select-none">
      <input
        type="checkbox"
        checked={acceptedTerms}
        disabled={acceptedTerms}
        onChange={() => {
          if (!acceptedTerms) setShowModal(true);
        }}
        className={"peer hidden"}
      />
      <span
        className={`w-4 h-4 flex items-center justify-center rounded border transition 
      ${
        acceptedTerms
          ? "bg-green-500 border-green-600 cursor-none"
          : "bg-white border-gray-300 cursor-pointer"
      } 
      peer-disabled:opacity-100
    `}
      >
        {acceptedTerms && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </span>
      <p>
        I accept the <span className="underline">terms</span> and conditions
      </p>
    </label>
  );
};

export default TermsAndConditions;
