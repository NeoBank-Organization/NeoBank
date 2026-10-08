import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SESSION_TIMEOUT = 5 * 60 * 1000;

export const useSessionTimeout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const logoutUser = () => {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");

      navigate("/login", {
        replace: true,
        state: {
          sessionExpired: true,
        },
      });
    };

    const resetTimer = () => {
      clearTimeout(timer);

      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        return;
      }

      timer = setTimeout(logoutUser, SESSION_TIMEOUT);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timer);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);
};