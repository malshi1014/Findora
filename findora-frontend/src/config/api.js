// Vite replaces import.meta.env.VITE_API_BASE_URL at build time.
// For local dev: set VITE_API_BASE_URL=http://localhost/findora-backend in .env
// For production: set VITE_API_BASE_URL=https://findora.software/findora-backend in .env.production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/findora-backend';

export default API_BASE_URL;
