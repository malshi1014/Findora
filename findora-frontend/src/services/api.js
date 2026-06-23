// API Service Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "auth_token";

// Utility: Get stored auth token
const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

// Utility: Set auth token
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Utility: Make API requests with auth headers
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// ============ AUTHENTICATION ENDPOINTS ============

export const authService = {
  login: async (nic, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ nic, password }),
    });
  },

  register: async (payload) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  logout: () => {
    setAuthToken(null);
    return Promise.resolve();
  },

  getCurrentUser: async () => {
    return apiRequest("/auth/me", {
      method: "GET",
    });
  },
};

// ============ REPORT ENDPOINTS ============

export const reportService = {
  // Report Lost Item
  createLostItemReport: async (payload) => {
    return apiRequest("/reports/lost-item", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Report Found Item
  createFoundItemReport: async (payload) => {
    return apiRequest("/reports/found-item", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Report Missing Person
  createMissingPersonReport: async (payload) => {
    return apiRequest("/reports/missing-person", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Report Missing Pet
  createMissingPetReport: async (payload) => {
    return apiRequest("/reports/missing-pet", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Get all reports for current user
  getUserReports: async () => {
    return apiRequest("/reports/user-reports", {
      method: "GET",
    });
  },

  // Get single report details
  getReportById: async (reportId) => {
    return apiRequest(`/reports/${reportId}`, {
      method: "GET",
    });
  },

  // Update report
  updateReport: async (reportId, payload) => {
    return apiRequest(`/reports/${reportId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Delete report
  deleteReport: async (reportId) => {
    return apiRequest(`/reports/${reportId}`, {
      method: "DELETE",
    });
  },

  // Search reports
  searchReports: async (filters) => {
    const params = new URLSearchParams(filters);
    return apiRequest(`/reports/search?${params.toString()}`, {
      method: "GET",
    });
  },
};

// ============ USER PROFILE ENDPOINTS ============

export const userService = {
  // Get user profile
  getUserProfile: async () => {
    return apiRequest("/users/profile", {
      method: "GET",
    });
  },

  // Update user profile
  updateProfile: async (payload) => {
    return apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Get user settings
  getSettings: async () => {
    return apiRequest("/users/settings", {
      method: "GET",
    });
  },

  // Update user settings
  updateSettings: async (payload) => {
    return apiRequest("/users/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return apiRequest("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetch(`${API_BASE_URL}/users/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) throw new Error("Avatar upload failed");
      return response.json();
    });
  },
};

// ============ NOTIFICATION ENDPOINTS ============

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async () => {
    return apiRequest("/notifications", {
      method: "GET",
    });
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    });
  },

  // Mark all as read
  markAllAsRead: async () => {
    return apiRequest("/notifications/mark-all-read", {
      method: "PATCH",
    });
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    return apiRequest(`/notifications/${notificationId}`, {
      method: "DELETE",
    });
  },
};

// ============ DONATION ENDPOINTS ============

export const donationService = {
  // Create donation
  createDonation: async (payload) => {
    return apiRequest("/donations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Get donation history
  getDonationHistory: async () => {
    return apiRequest("/donations/history", {
      method: "GET",
    });
  },

  // Get donation stats
  getDonationStats: async () => {
    return apiRequest("/donations/stats", {
      method: "GET",
    });
  },

  // Get donation FAQ
  getDonationFAQ: async () => {
    return apiRequest("/donations/faq", {
      method: "GET",
    });
  },
};

// ============ MATCHES & CLAIMS ENDPOINTS ============

export const matchService = {
  // Get matches for a report
  getMatches: async (reportId) => {
    return apiRequest(`/matches/report/${reportId}`, {
      method: "GET",
    });
  },

  // Get all matches for current user
  getUserMatches: async () => {
    return apiRequest("/matches/user", {
      method: "GET",
    });
  },
};

export const claimService = {
  // Submit a claim for a found item
  submitClaim: async (reportId, payload) => {
    return apiRequest(`/claims/report/${reportId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Get claims for current user
  getUserClaims: async () => {
    return apiRequest("/claims/user", {
      method: "GET",
    });
  },

  // Update claim status (approve/reject)
  updateClaimStatus: async (claimId, status, message) => {
    return apiRequest(`/claims/${claimId}`, {
      method: "PUT",
      body: JSON.stringify({ status, message }),
    });
  },

  // Get pending claims for current user
  getPendingClaims: async () => {
    return apiRequest("/claims/pending", {
      method: "GET",
    });
  },
};

// ============ UPLOAD ENDPOINTS ============

export const uploadService = {
  // Upload report images
  uploadReportImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    return fetch(`${API_BASE_URL}/uploads/report-images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) throw new Error("Image upload failed");
      return response.json();
    });
  },
};

// ============ STATISTICS ENDPOINTS ============

export const statsService = {
  // Get platform statistics
  getPlatformStats: async () => {
    return apiRequest("/stats/platform", {
      method: "GET",
    });
  },

  // Get user statistics
  getUserStats: async () => {
    return apiRequest("/stats/user", {
      method: "GET",
    });
  },

  // Get recovery statistics
  getRecoveryStats: async () => {
    return apiRequest("/stats/recovery", {
      method: "GET",
    });
  },
};

// ============ EXPORT AUTH HELPERS ============

export const getToken = getAuthToken;
export const setToken = setAuthToken;

export default {
  authService,
  reportService,
  userService,
  notificationService,
  donationService,
  matchService,
  claimService,
  uploadService,
  statsService,
};
