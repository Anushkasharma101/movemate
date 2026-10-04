const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
let accessToken = null;
export const setAccessToken = (value) => {
  accessToken = value;
};
export async function apiRequest(
  endpoint,
  { method = "GET", body, binary = false } = {},
) {
  const form = body instanceof FormData;
  let response;
  try {
    response = await fetch(API + endpoint, {
      method,
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(!form && body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      body: body === undefined ? undefined : form ? body : JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });
  } catch {
    throw new Error(
      "Cannot reach the server. Check your connection and retry.",
    );
  }
  if (binary && response.ok) return response.blob();
  const data = await response
    .json()
    .catch(() => ({ error: { message: "Unexpected server response" } }));
  if (!response.ok) {
    const error = new Error(data.error?.message || "Request failed");
    error.status = response.status;
    error.details = data.error?.details;
    if (response.status === 401 && accessToken)
      window.dispatchEvent(new Event("movemate-session-expired"));
    throw error;
  }
  return data;
}
export async function uploadFile(file, purpose, moveId) {
  const body = new FormData();
  body.append("file", file);
  body.append("purpose", purpose);
  if (moveId) body.append("moveId", moveId);
  return (await apiRequest("/uploads", { method: "POST", body })).upload;
}
export async function downloadFile(id, name = "attachment") {
  const blob = await apiRequest(`/uploads/${id}`, { binary: true });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
