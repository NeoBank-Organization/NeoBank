import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const REMEMBER_KEY = "neobank.customerId";

const readRememberedId = (): string => {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
};

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] =
    useState(readRememberedId);

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [remember, setRemember] = useState(
    () => readRememberedId() !== ""
  );

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!customerId.trim() || !password.trim()) {
      setError(
        "Please enter your customer ID and password."
      );
      return;
    }

    setLoading(true);

    // Temporary mock login
    setTimeout(() => {
      if (
        customerId.trim() === "customer" &&
        password === "123456"
      ) {
        sessionStorage.setItem(
          "accessToken",
          "mock-access-token"
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: "101",
            name: "NeoBank Customer",
            role: "CUSTOMER",
          })
        );

        try {
          if (remember) {
            localStorage.setItem(
              REMEMBER_KEY,
              customerId.trim()
            );
          } else {
            localStorage.removeItem(REMEMBER_KEY);
          }
        } catch {
          // Ignore storage errors
        }

        navigate("/accounts");
      } else {
        setError(
          "Invalid customer ID or password."
        );
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* =====================================================
          LEFT HERO SECTION
      ===================================================== */}

      <section
        className="
          relative
          hidden
          min-h-screen
          w-[55%]
          overflow-hidden
          bg-[#092957]
          px-16
          py-8
          text-white
          lg:flex
          lg:flex-col
        "
      >

        {/* =================================================
            BACKGROUND GLOW
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            right-[-220px]
            top-[80px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-blue-400/10
            blur-3xl
          "
        />

        {/* =================================================
            OUTER CIRCLE
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -right-[280px]
            top-[170px]
            h-[650px]
            w-[650px]
            rounded-full
            border
            border-blue-300/10
          "
        />

        {/* =================================================
            MIDDLE CIRCLE
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -right-[190px]
            top-[260px]
            h-[500px]
            w-[500px]
            rounded-full
            border
            border-blue-300/10
          "
        />

        {/* =================================================
            INNER CIRCLE
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            -right-[100px]
            top-[350px]
            h-[350px]
            w-[350px]
            rounded-full
            border
            border-blue-300/10
          "
        />

        {/* =================================================
            BRAND
        ================================================= */}

        <div
          className="
            relative
            z-10
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white
              text-lg
              font-bold
              text-[#1456a0]
            "
          >
            N
          </div>

          <span
            className="
              text-[21px]
              font-semibold
              tracking-tight
            "
          >
            Neo
            <span className="text-blue-400">
              Bank
            </span>
          </span>

        </div>

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div
          className="
            relative
            z-10
            my-auto
            max-w-[650px]
          "
        >

          {/* Badge */}

          <div
            className="
              mb-8
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-200/30
              bg-white
              px-3
              py-1.5
              text-[11px]
              font-semibold
              text-[#1555a0]
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#1555a0]
              "
            />

            Trusted digital banking
          </div>

          {/* Heading */}

          <h1
            className="
              max-w-[650px]
              text-[58px]
              font-light
              leading-[1.04]
              tracking-[-2.5px]
            "
          >
            Banking that moves
            <br />
            at your pace.
          </h1>

          {/* Description */}

          <p
            className="
              mt-7
              max-w-[620px]
              text-[17px]
              leading-8
              text-blue-100
            "
          >
            Securely manage your money, make simulated
            transfers and unlock smarter financial insights.
          </p>

        </div>

        {/* =================================================
            FEATURES
        ================================================= */}

        <div
          className="
            relative
            z-10
            mb-2
            flex
            gap-20
          "
        >

          {/* Security */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                text-blue-300
              "
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
                <path d="m9 12 2.2 2.2L15.5 10" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold">
                Bank-grade security
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-blue-200
                "
              >
                Protected every step
              </p>
            </div>

          </div>

          {/* Smart Insights */}

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                text-blue-300
              "
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 3.5 11.7 8l4.5 1.7-4.5 1.7L10 16l-1.7-4.6L3.8 9.7 8.3 8 10 3.5Z" />
                <path d="m18 13 .9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9L18 13Z" />
                <path d="m17 3 .6 1.4L19 5l-1.4.6L17 7l-.6-1.4L15 5l1.4-.6L17 3Z" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold">
                Smart insights
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-blue-200
                "
              >
                Clear, useful guidance
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          RIGHT LOGIN PANEL
      ===================================================== */}

      <main
        className="
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          bg-white
          px-6
          py-10
          lg:w-[45%]
          lg:px-16
        "
      >

        <div className="w-full max-w-[430px]">

          {/* =================================================
              MOBILE BRAND
          ================================================= */}

          <div
            className="
              mb-8
              flex
              items-center
              gap-3
              lg:hidden
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#1257b8]
                text-lg
                font-bold
                text-white
              "
            >
              N
            </div>

            <span
              className="
                text-xl
                font-bold
                text-[#111827]
              "
            >
              NeoBank
            </span>

          </div>

          {/* =================================================
              SIGNUP BUTTONS
          ================================================= */}

          <div
            className="
              mb-10
              flex
              justify-end
              gap-3
            "
          >

            {/* Email Signup */}

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="
                rounded-lg
                bg-[#5146e5]
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#4338ca]
              "
            >
              Sign up with email
            </button>

            {/* Google Signup */}

            <button
              type="button"
              onClick={() => {
                alert(
                  "Google signup will be integrated later."
                );
              }}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-xs
                font-semibold
                text-gray-700
                shadow-sm
                transition
                hover:bg-gray-50
              "
            >

              <span
                className="
                  text-sm
                  font-bold
                  text-[#4285F4]
                "
              >
                G
              </span>

              Continue with Google

            </button>

          </div>

          {/* =================================================
              FORM HEADER
          ================================================= */}

          <div className="mb-9">

            <p
              className="
                mb-4
                text-[11px]
                font-bold
                uppercase
                tracking-[1.8px]
                text-[#075bd3]
              "
            >
              Welcome back
            </p>

            <h2
              className="
                text-[31px]
                font-normal
                tracking-[-1.2px]
                text-[#071b3a]
              "
            >
              Sign in to NeoBank
            </h2>

            <p
              className="
                mt-3
                text-sm
                text-[#58708f]
              "
            >
              Enter any demo credentials to explore
              your account.
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >

            {/* Customer ID */}

            <div>

              <label
                htmlFor="customerId"
                className="
                  mb-2
                  block
                  text-[13px]
                  font-semibold
                  text-[#071b3a]
                "
              >
                Customer ID
              </label>

              <input
                id="customerId"
                type="text"
                placeholder="Enter your customer ID"
                value={customerId}
                onChange={(event) =>
                  setCustomerId(event.target.value)
                }
                autoComplete="username"
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-[#d4dce7]
                  bg-white
                  px-4
                  text-sm
                  text-[#071b3a]
                  outline-none
                  transition
                  placeholder:text-[#8b9bb0]
                  focus:border-[#2367d1]
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>

            {/* Password */}

            <div>

              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-[13px]
                  font-semibold
                  text-[#071b3a]
                "
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                  className="
                    h-12
                    w-full
                    rounded-lg
                    border
                    border-[#d4dce7]
                    bg-white
                    px-4
                    pr-12
                    text-sm
                    text-[#071b3a]
                    outline-none
                    transition
                    placeholder:text-[#8b9bb0]
                    focus:border-[#2367d1]
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    p-1
                    text-[#71839b]
                    transition
                    hover:text-[#123e73]
                  "
                >

                  {showPassword ? (

                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 6.2A9.6 9.6 0 0 1 12 6c5 0 8.5 4.2 9.5 6-.4.7-1.2 1.9-2.4 3M6.7 7.7C4.6 9.1 3.3 11 2.5 12c1 1.8 4.5 6 9.5 6 1.5 0 2.8-.4 4-1" />
                      <path d="M9.9 10a3 3 0 0 0 4.1 4.1" />
                    </svg>

                  ) : (

                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>

                  )}

                </button>

              </div>

            </div>

            {/* Remember / Forgot */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <label
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-2
                  text-xs
                  text-[#667991]
                "
              >

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(
                      event.target.checked
                    )
                  }
                  className="
                    h-3.5
                    w-3.5
                    accent-[#1761d1]
                  "
                />

                Remember customer ID

              </label>

              <button
                type="button"
                className="
                  text-xs
                  font-semibold
                  text-[#075bd3]
                  hover:underline
                "
              >
                Forgot password?
              </button>

            </div>

            {/* Error */}

            {error && (
              <div
                role="alert"
                className="
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-xs
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* =================================================
                SECURE LOGIN
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#2164d5]
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition
                hover:bg-[#1857c2]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Secure login

                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </>
              )}

            </button>

            {/* =================================================
                SIGNUP
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-1
                pt-1
                text-xs
                text-[#667991]
              "
            >

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="
                  font-semibold
                  text-[#075bd3]
                  hover:underline
                "
              >
                Sign up
              </button>

            </div>

            {/* =================================================
                VIRTUAL KEYBOARD
            ================================================= */}

            <button
              type="button"
              onClick={() =>
                alert(
                  "Virtual keyboard will be added later."
                )
              }
              className="
                mx-auto
                flex
                items-center
                gap-2
                text-xs
                font-medium
                text-[#075bd3]
                hover:underline
              "
            >

              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="2.5"
                  y="6"
                  width="19"
                  height="12"
                  rx="2"
                />

                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
              </svg>

              Use virtual keyboard

            </button>

          </form>

          {/* =================================================
              SECURITY FOOTER
          ================================================= */}

          <div
            className="
              mt-8
              flex
              items-start
              gap-3
              border-t
              border-[#e5eaf0]
              pt-5
              text-[#8a99aa]
            "
          >

            <svg
              className="
                mt-0.5
                h-5
                w-5
                flex-shrink-0
                text-[#15936d]
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
              <path d="m9 12 2.2 2.2L15.5 10" />
            </svg>

            <p
              className="
                text-[11px]
                leading-5
              "
            >
              Your session is protected with 256-bit
              encryption. Never share your password.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Login;