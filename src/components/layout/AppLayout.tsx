import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { logout } from "../../services/authService";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";
import type { User } from "../../features/auth/auth.types";

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  useSessionTimeout();

  // ================= USER DATA =================

  const userData = sessionStorage.getItem("user");

  let user: User | null = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch {
    user = null;
  }

  // ================= LOGOUT =================

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    }
  };

  // ================= MENU =================

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      label: "Accounts",
      path: "/accounts",
      icon: "▣",
    },
    {
      label: "Beneficiaries",
      path: "/beneficiaries",
      icon: "♙",
    },
    {
      label: "Fund Transfer",
      path: "/transfers",
      icon: "➤",
    },
    {
      label: "Scheduled Transfers",
      path: "/transfers/scheduled",
      icon: "□",
    },
    {
      label: "Statements",
      path: "/statements",
      icon: "▤",
    },
    {
      label: "Loans",
      path: "/loans",
      icon: "♜",
    },
    {
      label: "Spend Insights",
      path: "/accounts/spend-insights",
      icon: "◔",
    },
    {
      label: "Admin Dashboard",
      path: "/admin",
      icon: "◔",
    },
  ];

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-50
          hidden
          w-[250px]
          flex-col
          bg-[#092957]
          text-white
          lg:flex
        "
      >

        {/* ================= LOGO ================= */}

        <div
          className="
            flex
            h-[72px]
            flex-shrink-0
            items-center
            gap-3
            border-b
            border-white/[0.08]
            px-5
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-[#1464d2]
              text-base
              font-bold
              shadow-md
            "
          >
            N
          </div>

          <div>

            <div
              className="
                text-[18px]
                font-bold
                tracking-tight
              "
            >
              Neo<span className="text-blue-400">Bank</span>
            </div>

            <div
              className="
                text-[7px]
                font-medium
                uppercase
                tracking-[1.4px]
                text-blue-200/50
              "
            >
              Personal Banking
            </div>

          </div>

        </div>

        {/* ================= NAVIGATION ================= */}

        <nav
          className="
            flex-1
            px-3
            py-5
          "
        >

          <p
            className="
              mb-2
              px-3
              text-[8px]
              font-bold
              uppercase
              tracking-[1.4px]
              text-blue-300/50
            "
          >
            Banking
          </p>

          <div className="space-y-0.5">

            {menuItems
              .filter((item) =>
                user?.role === "ADMIN"
                  ? item.path === "/admin"
                  : item.path !== "/admin"
              )
              .map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    group
                    relative
                    flex
                    h-10
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    text-[11px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-[#1d4f8d] text-white"
                        : "text-blue-100/70 hover:bg-white/[0.06] hover:text-white"
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>

                    {/* Active indicator */}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          h-5
                          w-[3px]
                          rounded-r-full
                          bg-blue-400
                        "
                      />
                    )}

                    {/* Icon */}

                    <span
                      className={`
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-md
                        text-xs

                        ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-blue-200/70 group-hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    {/* Text */}

                    <span>
                      {item.label}
                    </span>

                    </>
                  )}
                </NavLink>
              ))}

          </div>

          {/* ================= BANKING ASSISTANT ================= */}

          <div className="mt-3">

            <div
              className="
                flex
                h-10
                cursor-pointer
                items-center
                gap-3
                rounded-lg
                px-3
                text-[11px]
                font-medium
                text-blue-100/70
                transition
                hover:bg-white/[0.06]
                hover:text-white
              "
            >

              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-md
                  text-xs
                  text-blue-200/80
                "
              >
                ✦
              </span>

              <span>
                Banking Assistant
              </span>

              <span
                className="
                  ml-auto
                  rounded-full
                  bg-[#2164d5]
                  px-1.5
                  py-0.5
                  text-[7px]
                  font-bold
                  text-white
                "
              >
                AI
              </span>

            </div>

          </div>

        </nav>

        {/* =====================================================
            BOTTOM SECTION
        ====================================================== */}

        <div
          className="
            flex-shrink-0
          "
        >

          {/* ================= USER ================= */}

          <div
            className="
              border-t
              border-white/[0.08]
              px-4
              py-3
            "
          >

            <div className="flex items-center gap-2.5">

              {/* Avatar */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#3478d5]
                  text-[11px]
                  font-bold
                  text-white
                "
              >
                {userInitial}
              </div>

              {/* User */}

              <div className="min-w-0 flex-1">

                <p
                  className="
                    truncate
                    text-[10px]
                    font-semibold
                    text-white
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[7px]
                    uppercase
                    tracking-wide
                    text-blue-200/50
                  "
                >
                  {user?.role || "Customer"}
                </p>

              </div>

            </div>

            {/* ================= LOGOUT ================= */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                mt-2
                flex
                h-8
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-white/[0.08]
                bg-white/[0.03]
                text-[10px]
                font-medium
                text-blue-100/70
                transition-all
                duration-200
                hover:border-red-400/20
                hover:bg-red-500/10
                hover:text-red-300
              "
            >

              <span className="text-xs">
                ↪
              </span>

              <span>
                Logout
              </span>

            </button>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          min-h-screen
          lg:ml-[250px]
        "
      >

        {/* ================= HEADER ================= */}

        <header
          className="
            sticky
            top-0
            z-40
            flex
            h-[72px]
            items-center
            justify-between
            border-b
            border-[#e3e9f1]
            bg-white
            px-5
            lg:px-8
          "
        >

          {/* SEARCH */}

          <div
            className="
              hidden
              h-10
              w-[380px]
              items-center
              gap-3
              rounded-lg
              border
              border-[#dbe3ed]
              bg-[#fafbfd]
              px-4
              md:flex
            "
          >

            <span className="text-sm text-[#8190a5]">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search transactions, features..."
              className="
                w-full
                border-none
                bg-transparent
                text-xs
                text-[#18365d]
                outline-none
                placeholder:text-[#94a3b8]
              "
            />

            <span
              className="
                rounded
                border
                border-gray-200
                bg-white
                px-1.5
                py-0.5
                text-[9px]
                text-gray-400
              "
            >
              ⌘ K
            </span>

          </div>

          {/* USER */}

          <div
            className="
              ml-auto
              flex
              items-center
              gap-5
            "
          >

            <button
              type="button"
              className="
                text-lg
                text-[#536780]
                transition
                hover:text-[#17365f]
              "
            >
              ♧
            </button>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#3478d5]
                  text-xs
                  font-bold
                  text-white
                "
              >
                {userInitial}
              </div>

              <div className="hidden sm:block">

                <p
                  className="
                    text-xs
                    font-semibold
                    text-[#17365f]
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[9px]
                    text-gray-400
                  "
                >
                  {user?.role === "ADMIN" ? "Admin" : "Customer"}
                </p>

              </div>

              <span className="text-xs text-gray-400">
                ⌄
              </span>

            </div>

          </div>

        </header>

        {/* ================= PAGE ================= */}

        <main
          className="
            p-5
            md:p-7
            lg:p-8
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
};