import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/backendApi";
import { useAuth, homeFor } from "./authState";
import { Card, Field, Notice } from "./ui";
import { useAction } from "./hooks";
export default function Login({
  register = false,
  reset = false,
  forgot = false,
}) {
  const auth = useAuth(),
    nav = useNavigate(),
    location = useLocation(),
    action = useAction();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "customer",
    acceptTerms: false,
  });
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (e) => {
    e.preventDefault();
    if ((register || reset) && form.password !== form.confirm) {
      await action.run(() =>
        Promise.reject(new Error("Passwords do not match")),
      );
      return;
    }
    await action.run(
      async () => {
        if (forgot)
          return apiRequest("/auth/forgot-password", {
            method: "POST",
            body: { email: form.email },
          });
        if (reset)
          return apiRequest("/auth/reset-password", {
            method: "POST",
            body: {
              token: new URLSearchParams(location.search).get("token") || "",
              password: form.password,
            },
          });
        const body = register
          ? {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            role: form.role,
            acceptTerms: form.acceptTerms,
          }
          : { email: form.email, password: form.password };
        const result = await apiRequest(
          register ? "/auth/register" : "/auth/login",
          { method: "POST", body },
        );
        auth.accept(result);
        nav(homeFor(result.user), { replace: true });
        return result;
      },
      forgot
        ? "If this account exists, check your email for a reset link."
        : reset
          ? "Password changed. You can now sign in."
          : "Signed in",
    );
  };
  return (
    <div className="mm-auth">
      <Link to="/" className="mm-brand">
        <img src="/images/app_logo.png" alt="" />
        MoveMate
      </Link>
      <div className={`mm-auth-grid ${!register && !forgot && !reset ? "mm-login-grid" : ""}`}>
        <section
          className={`mm-auth-story ${register ? "mm-register-story" : ""}`}
        >
          <h1>
            Same move.
            <br />A smoother tomorrow.
          </h1>

          <p>Your coordinator, moving plan and updates in one place.</p>

          <img
            src={
              register
                ? "/images/register_vertical.png"
                : "/images/signin_cat_illustration.jpg"
            }
            alt="Moving boxes and a sleeping cat"
          />
        </section>
        <Card
          title={
            forgot
              ? "Forgot password"
              : reset
                ? "Reset password"
                : register
                  ? "Create your account"
                  : "Welcome back"
          }
        >
          <form onSubmit={submit}>
            <Notice action={action} />
            {auth.error && <p className="mm-error">{auth.error}</p>}
            {register && (
              <>
                <Field
                  title="Full name"
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <Field title="Account type">
                  <select
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="coordinator">
                      Coordinator — apply after signup
                    </option>
                  </select>
                </Field>
                <Field
                  title="Mobile number"
                  required
                  pattern="[+]?[0-9]{10,15}"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <p className="mm-muted">
                  We’ll use your mobile number for moving-related contact.
                  Sign in using your email and password.
                </p>
              </>
            )}
            {!reset && (
              <Field
                title="Email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            )}
            {!forgot && (
              <Field
                title="Password"
                type="password"
                autoComplete={
                  register || reset ? "new-password" : "current-password"
                }
                minLength={register || reset ? 10 : 1}
                maxLength={128}
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            )}
            {(register || reset) && (
              <Field
                title="Confirm password"
                type="password"
                required
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
              />
            )}
            {register && (
              <label className="mm-check">
                <input
                  type="checkbox"
                  required
                  checked={form.acceptTerms}
                  onChange={(e) => set("acceptTerms", e.target.checked)}
                />
                I accept the{" "}
                <Link to="/terms">service terms and privacy notice</Link>.
              </label>
            )}
            <button disabled={action.busy}>
              {action.busy
                ? "Please wait…"
                : forgot
                  ? "Send reset link"
                  : reset
                    ? "Change password"
                    : register
                      ? "Create account"
                      : "Sign in"}
            </button>
          </form>
          <div className="mm-links">
            <Link to={register ? "/login" : "/register"}>
              {register ? "Already registered? Sign in" : "Create an account"}
            </Link>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
