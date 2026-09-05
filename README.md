# 🔍 Findora — Lost & Found Recovery Platform

[![Build & Deploy](https://github.com/malshi1014/Findora/actions/workflows/deploy.yml/badge.svg)](https://github.com/malshi1014/Findora/actions/workflows/deploy.yml)
[![Live Site](https://img.shields.io/badge/Live%20Site-findora.software-blue?style=flat&logo=googlechrome)](https://findora.software)

> **Findora** is a Sri Lanka-based Lost & Found recovery platform that connects people who have lost items, pets, or loved ones with those who have found them — powered by smart matching, real-time notifications, and community trust.

---

## 📁 Project Structure

```
Findora/
├── findora-frontend/     # React + Vite frontend (deployed to findora.software)
└── findora-backend/      # PHP REST API backend (hosted on InfinityFree)
```

---

## 🌐 Live Application

| Service  | URL |
|----------|-----|
| Frontend | [https://findora.software](https://findora.software) |
| API Base | `https://findora.software/findora-backend` |

---

## 🖥️ Frontend — `findora-frontend/`

A modern React Single-Page Application built with Vite and TailwindCSS.

### Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 4
- **Animations**: Framer Motion
- **Routing**: React Router DOM 7
- **Icons**: Lucide React

### Setup & Run Locally

```bash
cd findora-frontend
npm install
cp .env.example .env      # fill in your API base URL
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `https://findora.software/findora-backend`) |

---

## ⚙️ Backend — `findora-backend/`

A RESTful PHP backend with MySQL database, supporting authentication, reports, matching, donations, and notifications.

### Tech Stack
- **Language**: PHP 8+
- **Database**: MySQL
- **Email**: PHPMailer (via Composer)
- **Payments**: PayHere Gateway

### Setup Locally

```bash
cd findora-backend
composer install                  # Install PHP dependencies
cp config/db.example.php config/db.php   # Configure DB credentials
# Import database/findora_db.sql into your MySQL server
```

### Key Modules

| Module | Description |
|--------|-------------|
| `auth/` | Registration, login, session management |
| `reports/` | Lost, found, missing persons & pets |
| `matching/` | AI-assisted report matching engine |
| `donations/` | PayHere payment integration |
| `notifications/` | Real-time alerts for matches |
| `admin/` | Admin dashboard APIs |

---

## 🚀 CI/CD Pipeline

This project uses **GitHub Actions** for continuous deployment.

| Trigger | Action |
|---------|--------|
| Push to `main` (frontend changes) | Build React app → Deploy to InfinityFree via FTP |

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `FTP_SERVER` | `ftpupload.net` |
| `FTP_USERNAME` | Your InfinityFree FTP username |
| `FTP_PASSWORD` | Your InfinityFree FTP password |
| `VITE_API_BASE_URL` | `https://findora.software/findora-backend` |

---

## 🗄️ Database

The full MySQL schema is located at:
```
findora-backend/database/findora_db.sql
```
Import it into your MySQL server via **phpMyAdmin** or CLI:
```bash
mysql -u root -p findora_db < findora-backend/database/findora_db.sql
```

---

## 👥 Team

| Role | Name |
|------|------|
| Developer | Malshi Navodya |

---

## 📄 License

This project is private and not licensed for public use.
