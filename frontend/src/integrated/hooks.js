import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest } from "../services/backendApi";
export const label = (value) => String(value ?? "").replaceAll("_", " ");
export const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value || 0,
  );
export const displayId = (value) =>
  String(value || "")
    .slice(-8)
    .toUpperCase();
export const objectId = (value) =>
  typeof value === "object" ? value?._id : value;
export function useLoad(path, { poll = 0 } = {}) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const epoch = useRef(0);
  const load = useCallback(async () => {
    const current = ++epoch.current;
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest(path);
      if (current === epoch.current) setData({ path, value: result });
    } catch (e) {
      if (current === epoch.current) setError(e.message);
    } finally {
      if (current === epoch.current) setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) {
        setData(null);
        load();
      }
    });
    return () => {
      active = false;
    };
  }, [load]);
  useEffect(() => {
    if (!poll) return;
    const timer = setInterval(() => {
      if (document.visibilityState !== "hidden") load();
    }, poll);
    return () => clearInterval(timer);
  }, [load, poll]);
  return {
    data: data?.path === path ? data.value : null,
    error,
    loading: loading || (!error && data?.path !== path),
    load,
  };
}
export function useAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const locked = useRef(false);
  const run = useCallback(async (fn, message = "Saved") => {
    if (locked.current) return null;
    locked.current = true;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const result = await fn();
      setSuccess(message);
      return result ?? true;
    } catch (e) {
      setError(
        e.details?.length
          ? e.details.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")
          : e.message,
      );
      return null;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }, []);
  return { busy, error, success, run };
}
