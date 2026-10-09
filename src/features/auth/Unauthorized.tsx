
import React from "react";
import { useNavigate } from "react-router-dom";

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Access Denied</h1>

      <p>
        You do not have permission to access this page.
      </p>

      <button
        onClick={() => navigate("/accounts")}
      >
        Go to Accounts
      </button>
    </div>
  );
};

