import React from "react";

interface ErrorMessageProps {
  error: Error;
  retry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, retry }) => {
  return (
    <div className="error-message">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      {retry && (
        <button onClick={retry} className="retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
