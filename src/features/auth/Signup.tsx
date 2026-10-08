import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupForm {
  fullName: string;
  customerId: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    customerId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      !form.fullName.trim() ||
      !form.customerId.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "Please accept the terms and conditions."
      );
      return;
    }

    setLoading(true);

    // Temporary signup
    setTimeout(() => {
      setLoading(false);

      alert("NeoBank account created successfully.");

      navigate("/login");
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* =====================================================
          LEFT HERO
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

        {/* Background glow */}

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

        {/* Outer circle */}

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

        {/* Middle circle */}

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

        {/* Inner circle */}

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

        {/* Brand */}

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
            "
          >
            Neo
            <span className="text-blue-400">
              Bank
            </span>
          </span>
        </div>

        {/* Hero content */}

        <div
          className="
            relative
            z-10
            my-auto
            max-w-[650px]
          "
        >

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

          <h1
            className="
              text-[58px]
              font-light
              leading-[1.04]
              tracking-[-2.5px]
            "
          >
            Start your banking
            <br />
            journey with us.
          </h1>

          <p
            className="
              mt-7
              max-w-[620px]
              text-[17px]
              leading-8
              text-blue-100
            "
          >
            Create your NeoBank account and manage
            your money securely from one simple place.
          </p>
        </div>

        {/* Features */}

        <div
          className="
            relative
            z-10
            mb-2
            flex
            gap-20
          "
        >

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
              >
                <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
                <path d="m9 12 2.2 2.2L15.5 10" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold">
                Bank-grade security
              </p>

              <p className="mt-1 text-xs text-blue-200">
                Protected every step
              </p>
            </div>

          </div>

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
              >
                <path d="M10 3.5 11.7 8l4.5 1.7-4.5 1.7L10 16l-1.7-4.6L3.8 9.7 8.3 8 10 3.5Z" />
                <path d="m18 13 .9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9L18 13Z" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold">
                Smart insights
              </p>

              <p className="mt-1 text-xs text-blue-200">
                Clear, useful guidance
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          RIGHT SIGNUP PANEL
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
          py-8
          lg:w-[45%]
          lg:px-16
        "
      >

        <div className="w-full max-w-[450px]">

          {/* Mobile brand */}

          <div
            className="
              mb-6
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
                font-bold
                text-white
              "
            >
              N
            </div>

            <span className="text-xl font-bold">
              NeoBank
            </span>
          </div>

          {/* Header */}

          <div className="mb-7">

            <p
              className="
                mb-3
                text-[11px]
                font-bold
                uppercase
                tracking-[1.8px]
                text-[#075bd3]
              "
            >
              Welcome to NeoBank
            </p>

            <h2
              className="
                text-[31px]
                font-normal
                tracking-[-1.2px]
                text-[#071b3a]
              "
            >
              Create your account
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#58708f]
              "
            >
              Get started with secure digital banking.
            </p>

          </div>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >

            {/* Full name */}

            <div>

              <label
                htmlFor="fullName"
                className="
                  mb-1.5
                  block
                  text-[13px]
                  font-semibold
                  text-[#071b3a]
                "
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-[#d4dce7]
                  px-4
                  text-sm
                  outline-none
                  placeholder:text-[#8b9bb0]
                  focus:border-[#2367d1]
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>

            {/* Customer ID */}

            <div>

              <label
                htmlFor="customerId"
                className="
                  mb-1.5
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
                name="customerId"
                type="text"
                placeholder="Choose your customer ID"
                value={form.customerId}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-[#d4dce7]
                  px-4
                  text-sm
                  outline-none
                  placeholder:text-[#8b9bb0]
                  focus:border-[#2367d1]
                  focus:ring-4
                  focus:ring-blue-500/10
                "
              />

            </div>

            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="
                  mb-1.5
                  block
                  text-[13px]
                  font-semibold
                  text-[#071b3a]
                "
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-[#d4dce7]
                  px-4
                  text-sm
                  outline-none
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
                  mb-1.5
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
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-[#d4dce7]
                    px-4
                    pr-12
                    text-sm
                    outline-none
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
                      (previous) => !previous
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#71839b]
                  "
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Confirm password */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="
                  mb-1.5
                  block
                  text-[13px]
                  font-semibold
                  text-[#071b3a]
                "
              >
                Confirm password
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-[#d4dce7]
                    px-4
                    pr-12
                    text-sm
                    outline-none
                    placeholder:text-[#8b9bb0]
                    focus:border-[#2367d1]
                    focus:ring-4
                    focus:ring-blue-500/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#71839b]
                  "
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* Terms */}

            <label
              className="
                flex
                cursor-pointer
                items-start
                gap-2
                pt-1
                text-xs
                leading-5
                text-[#667991]
              "
            >

              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) =>
                  setAgreeTerms(
                    event.target.checked
                  )
                }
                className="
                  mt-1
                  h-3.5
                  w-3.5
                  accent-[#1761d1]
                "
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="
                    font-semibold
                    text-[#075bd3]
                    hover:underline
                  "
                >
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="
                    font-semibold
                    text-[#075bd3]
                    hover:underline
                  "
                >
                  Privacy Policy
                </button>
                .
              </span>

            </label>

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
                  py-2.5
                  text-xs
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {/* Create account */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
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
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* Sign in */}

          <div
            className="
              mt-5
              flex
              justify-center
              gap-1
              text-xs
              text-[#667991]
            "
          >

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
                font-semibold
                text-[#075bd3]
                hover:underline
              "
            >
              Sign in
            </button>

          </div>

          {/* Security */}

          <div
            className="
              mt-6
              flex
              items-start
              gap-3
              border-t
              border-[#e5eaf0]
              pt-4
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

            <p className="text-[11px] leading-5">
              Your information is protected with
              bank-grade security and encryption.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Signup;