
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const REMEMBER_KEY = "neobank.customerId";

type ActiveField = "customerId" | "password";

const readRememberedId = (): string => {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
  } catch {
    return "";
  }
};

const keyboardRows = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [customerId, setCustomerId] =
    useState<string>(readRememberedId);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(
    () => readRememberedId() !== ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Virtual keyboard state
  const [showVirtualKeyboard, setShowVirtualKeyboard] =
    useState(false);
  const [activeField, setActiveField] =
    useState<ActiveField>("customerId");
  const [shift, setShift] = useState(false);

  const handleVirtualKey = (key: string) => {
    if (key === "Shift") {
      setShift((prev) => !prev);
      return;
    }

    const value =
      shift && key.length === 1 && /[a-z]/i.test(key)
        ? key.toUpperCase()
        : key;

    setShift(false);

    const updateValue = (previous: string) => {
      if (value === "Backspace") {
        return previous.slice(0, -1);
      }

      if (value === "Clear") {
        return "";
      }

      if (value === "Space") {
        return previous + " ";
      }

      return previous + value;
    };

    if (activeField === "customerId") {
      setCustomerId(updateValue);
    } else {
      setPassword(updateValue);
    }

    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const id = customerId.trim();

    if (!id || !password.trim()) {
      setError("Please enter your user ID and password.");
      return;
    }

    setLoading(true);

    // Temporary mock login. Replace with your login API later.
    window.setTimeout(() => {
      const isAdmin = id === "admin" && password === "123456";
      const isCustomer =
        id === "customer" && password === "123456";

      if (!isAdmin && !isCustomer) {
        setError("Invalid customer ID or password.");
        setLoading(false);
        return;
      }

      try {
        sessionStorage.setItem(
          "accessToken",
          "mock-access-token"
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: isAdmin ? "admin-101" : "101",
            name: isAdmin ? "Branch Admin" : "NeoBank Customer",
            role: isAdmin ? "ADMIN" : "CUSTOMER",
          })
        );

        if (remember) {
          localStorage.setItem(REMEMBER_KEY, id);
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      } catch {
        setError("Unable to save your session. Please try again.");
        setLoading(false);
        return;
      }

      navigate(isAdmin ? "/admin" : "/dashboard");
    }, 500);
  };

  const handleForgotPassword = () => {
    setError("Password recovery is not available in the demo.");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT HERO PANEL */}
      <section
        className="
          relative hidden min-h-screen w-[55%] overflow-hidden
          bg-[#092957] px-12 py-8 text-white
          lg:flex lg:flex-col xl:px-16
        "
      >
        {/* Background decorations */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -right-52 top-20
            h-[650px] w-[650px] rounded-full
            bg-blue-400/10 blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -right-[280px] top-[170px]
            h-[650px] w-[650px] rounded-full
            border border-blue-300/10
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -right-[190px] top-[260px]
            h-[500px] w-[500px] rounded-full
            border border-blue-300/10
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute -right-[100px] top-[350px]
            h-[350px] w-[350px] rounded-full
            border border-blue-300/10
          "
        />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl bg-white text-lg font-bold text-[#1456a0]
            "
          >
            N
          </div>

          <span className="text-[21px] font-semibold tracking-tight">
            Neo<span className="text-blue-400">Bank</span>
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 my-auto max-w-[650px]">
          <div
            className="
              mb-8 inline-flex items-center gap-2 rounded-full
              border border-blue-200/30 bg-white px-3 py-1.5
              text-[11px] font-semibold text-[#1555a0]
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#1555a0]" />
            Trusted digital banking
          </div>

          <h1 className="text-[42px] font-light leading-[1.1] tracking-tight xl:text-[58px]">
            Banking that moves
            <br />
            at your pace.
          </h1>

          <p className="mt-7 max-w-[540px] text-base leading-8 text-blue-100 xl:text-[17px]">
            Securely manage your money, make simulated transfers
            and unlock smarter financial insights.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 mb-2 flex flex-wrap gap-8 xl:gap-14">
          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8 shrink-0 text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
              <path d="m9 12 2.2 2.2L15.5 10" />
            </svg>

            <div>
              <p className="text-sm font-bold">Bank-grade security</p>
              <p className="mt-1 text-xs text-blue-200">
                Protected every step
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8 shrink-0 text-blue-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 3.5 11.7 8l4.5 1.7-4.5 1.7L10 16l-1.7-4.6L3.8 9.7 8.3 8 10 3.5Z" />
              <path d="m18 13 .9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9L18 13Z" />
            </svg>

            <div>
              <p className="text-sm font-bold">Smart insights</p>
              <p className="mt-1 text-xs text-blue-200">
                Clear, useful guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT LOGIN PANEL */}
      <main
        className="
          flex min-h-screen w-full items-center justify-center
          bg-white px-5 py-8 sm:px-8
          lg:w-[45%] lg:px-10 xl:px-16
        "
      >
        <div className="w-full max-w-[430px]">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-[#1257b8] text-lg font-bold text-white
              "
            >
              N
            </div>
            <span className="text-xl font-bold text-[#111827]">
              NeoBank
            </span>
          </div>
          {/* Header */}
          <div className="mb-8">
            <p
              className="
                mb-4 text-[11px] font-bold uppercase
                tracking-[1.8px] text-[#075bd3]
              "
            >
              Welcome back
            </p>

            <h2 className="text-3xl font-normal tracking-tight text-[#071b3a]">
              Sign in to NeoBank
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#58708f]">
              Enter your demo credentials to explore your account.
            </p>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5"
          >
            {/* User ID */}
            <div>
              <label
                htmlFor="customerId"
                className="mb-2 block text-[13px] font-semibold text-[#071b3a]"
              >
                User ID
              </label>

              <input
                id="customerId"
                type="text"
                placeholder="Enter your user ID"
                value={customerId}
                onFocus={() => setActiveField("customerId")}
                onChange={(event) => {
                  setCustomerId(event.target.value);
                  setError("");
                }}
                autoComplete="username"
                aria-invalid={Boolean(error)}
                className="
                  h-12 w-full rounded-lg border border-[#d4dce7]
                  bg-white px-4 text-sm text-[#071b3a] outline-none
                  transition placeholder:text-[#8b9bb0]
                  focus:border-[#2367d1] focus:ring-4 focus:ring-blue-500/10
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[13px] font-semibold text-[#071b3a]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onFocus={() => setActiveField("password")}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  className="
                    h-12 w-full rounded-lg border border-[#d4dce7]
                    bg-white px-4 pr-12 text-sm text-[#071b3a]
                    outline-none transition placeholder:text-[#8b9bb0]
                    focus:border-[#2367d1] focus:ring-4 focus:ring-blue-500/10
                  "
                />

                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    p-1 text-[#71839b] hover:text-[#123e73]
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
                      aria-hidden="true"
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
                      aria-hidden="true"
                    >
                      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot password */}
            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[#667991]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-3.5 w-3.5 accent-[#1761d1]"
                />
                Remember user ID
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-[#075bd3] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="
                  rounded-lg border border-red-200 bg-red-50
                  px-4 py-3 text-xs leading-5 text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex h-12 w-full items-center justify-center gap-2
                rounded-lg bg-[#2164d5] text-sm font-semibold text-white
                shadow-lg shadow-blue-500/20 transition hover:bg-[#1857c2]
                disabled:cursor-not-allowed disabled:opacity-60
                focus:outline-none focus:ring-4 focus:ring-blue-200
              "
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity=".25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in...
                </>
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
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>

            {/* Signup link */}
            <div className="flex items-center justify-center gap-1 pt-1 text-xs text-[#667991]">
              <span>Don't have an account?</span>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-[#075bd3] hover:underline"
              >
                Sign up
              </button>
            </div>

            {/* VIRTUAL KEYBOARD TOGGLE */}
            <button
              type="button"
              onClick={() => setShowVirtualKeyboard((prev) => !prev)}
              aria-expanded={showVirtualKeyboard}
              aria-controls="virtual-keyboard"
              className="
                mx-auto flex items-center gap-2
                text-xs font-medium text-[#075bd3] hover:underline
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
                aria-hidden="true"
              >
                <rect x="2.5" y="6" width="19" height="12" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
              </svg>

              {showVirtualKeyboard
                ? "Hide virtual keyboard"
                : "Use virtual keyboard"}
            </button>

            {/* VIRTUAL KEYBOARD */}
            {showVirtualKeyboard && (
              <div
                id="virtual-keyboard"
                className="rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-gray-700">
                    Virtual keyboard
                  </p>

                  <span className="text-[10px] text-gray-500">
                    Typing in:{" "}
                    {activeField === "customerId" ? "User ID" : "Password"}
                  </span>
                </div>

                {keyboardRows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="mb-2 flex justify-center gap-1"
                  >
                    {row.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleVirtualKey(key)}
                        aria-label={shift ? key.toUpperCase() : key}
                        className="
                          h-9 min-w-0 flex-1 rounded-md
                          border border-gray-200 bg-white
                          text-sm font-medium text-gray-800 shadow-sm
                          transition hover:border-blue-300 hover:bg-blue-50
                          active:bg-blue-100
                        "
                      >
                        {shift ? key.toUpperCase() : key}
                      </button>
                    ))}
                  </div>
                ))}

                <div className="mb-2 flex gap-1.5">
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleVirtualKey("Backspace")}
                    className="
                      h-9 flex-[2] rounded-md border border-gray-200
                      bg-white text-xs font-medium text-gray-700
                      hover:bg-red-50
                    "
                  >
                    ← Backspace
                  </button>

                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleVirtualKey("Clear")}
                    className="
                      h-9 flex-1 rounded-md border border-gray-200
                      bg-white text-xs font-medium text-gray-700
                      hover:bg-gray-100
                    "
                  >
                    Clear
                  </button>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleVirtualKey("Space")}
                    className="
                      h-9 flex-[2] rounded-md border border-gray-200
                      bg-white text-xs font-medium text-gray-700
                      hover:bg-blue-50
                    "
                  >
                    Space
                  </button>

                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleVirtualKey("Shift")}
                    aria-pressed={shift}
                    className={`
                      h-9 flex-1 rounded-md border text-xs font-medium
                      transition
                      ${
                        shift
                          ? "border-blue-500 bg-blue-100 text-blue-800"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-blue-50"
                      }
                    `}
                  >
                    Shift {shift ? "ON" : ""}
                  </button>
                </div>

                <p className="mt-3 text-center text-[10px] text-gray-500">
                  Select a field above before typing.
                </p>
              </div>
            )}
          </form>

          {/* Security footer */}
          <div className="mt-8 flex items-start gap-3 border-t border-[#e5eaf0] pt-5 text-[#8a99aa]">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-[#15936d]"
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

            <p className="text-[11px] leading-5">
              This demo uses a mock login flow. Never share your
              password or enter real banking credentials.
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
            <p className="mb-1 font-semibold text-gray-800">
              Demo credentials
            </p>
            <p>Customer: customer / 123456</p>
            <p>Admin: admin / 123456</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
