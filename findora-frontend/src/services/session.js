import API_BASE_URL from "../config/api";

const CSRF_KEY = "findora_csrf_token";

// Secure cookie and CSRF-aware requests.
export const installSecureFetchDefaults = () => {
  if (window.__findoraSecureFetchInstalled) return;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = (input, init = {}) => {
    const method = String(init.method || "GET").toUpperCase();
    const headers = new Headers(init.headers || {});
    const csrfToken = localStorage.getItem(CSRF_KEY);

    if (!["GET", "HEAD", "OPTIONS"].includes(method) && csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }

    return nativeFetch(input, {
      ...init,
      headers,
      credentials: init.credentials || "include",
    });
  };

  window.__findoraSecureFetchInstalled = true;
};

// Store authenticated session details.
export const storeAuthenticatedSession = (data) => {
  localStorage.setItem("findora_user", JSON.stringify(data.user));
  localStorage.setItem(CSRF_KEY, data.csrf_token);
  localStorage.removeItem("auth_token");
};

// Clear browser session details.
export const clearAuthenticatedSession = () => {
  localStorage.removeItem("findora_user");
  localStorage.removeItem(CSRF_KEY);
  localStorage.removeItem("auth_token");
};

// End the authenticated session.
export const logout = async (redirectTo = "/login") => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout.php`, { method: "POST" });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    clearAuthenticatedSession();
    window.location.href = redirectTo;
  }
};

// Restore the PHP session.
export const restoreSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/session.php`);
    if (!response.ok) throw new Error("No active session");

    const data = await response.json();
    if (data.status !== "success" || !data.authenticated) {
      throw new Error("No active session");
    }

    storeAuthenticatedSession(data);
    return data.user;
  } catch {
    clearAuthenticatedSession();
    return null;
  }
};
