import { useEffect, useState } from "react";
import { Context } from "./authState";
import { Navigate, useLocation } from "react-router-dom";
import { apiRequest, setAccessToken } from "../services/backendApi";
import { useAuth, homeFor } from "./authState";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const clear = () => {
      sessionStorage.removeItem("movemate-token");
      setAccessToken(null);
      setUser(null);
    };
    window.addEventListener("movemate-session-expired", clear);
    const stored = sessionStorage.getItem("movemate-token");
    setAccessToken(stored);
    if (stored)
      apiRequest("/auth/me")
        .then((r) => {
          if (active) setUser(r.user);
        })
        .catch((e) => {
          if (active) {
            setError(e.message);
            if (e.status === 401) clear();
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    else
      queueMicrotask(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      window.removeEventListener("movemate-session-expired", clear);
    };
  }, []);
  const accept = (result) => {
    setAccessToken(result.token);
    sessionStorage.setItem("movemate-token", result.token);
    setUser(result.user);
    setError("");
  };
  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST", body: {} });
    } finally {
      sessionStorage.removeItem("movemate-token");
      setAccessToken(null);
      setUser(null);
    }
  };
  return (
    <Context.Provider value={{ user, loading, error, accept, logout, setUser }}>
      {children}
    </Context.Provider>
  );
}
export function Guard({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="mm-state">Checking your session…</div>;
  if (!user)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!roles.includes(user.role))
    return (
      <div className="mm-state">
        <h1>Access denied</h1>
        <p>Your account cannot access this portal.</p>
        <a href={homeFor(user)}>Go to your dashboard</a>
      </div>
    );
  return children;
}
