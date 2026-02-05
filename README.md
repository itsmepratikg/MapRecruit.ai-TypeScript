<div align="center">

<img width="1200" height="400" alt="MapRecruit AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🚀 MapRecruit.ai

[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lines of Code](https://img.shields.io/badge/Lines_of_Code-437k+-blueviolet?style=for-the-badge)](https://github.com/itsmepratikg/MapRecruit.ai-TypeScript-)
[![Total Files](https://img.shields.io/badge/Total_Files-500+-orange?style=for-the-badge)](https://github.com/itsmepratikg/MapRecruit.ai-TypeScript-)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**The Next-Generation Intelligent Hiring & Talent Management Platform**

[Explore Features](#-key-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [File Structure](#-project-structure) • [License](#-license)

</div>

---

## 📂 Project Structure

```text
├── 📁 .github/           # CI/CD Workflows & GitHub Config
├── 📁 backend/           # Node.js/Express Backend API
│   ├── 📁 controllers/   # Business Logic
│   ├── 📁 models/        # MongoDB/Mongoose Schemas
│   ├── 📁 routes/        # API Endpoints
│   └── 📁 middleware/    # Auth & Security Middlewares
├── 📁 components/        # Shared Frontend Components
│   ├── 📁 Icons/         # Custom Lucide/SVG Icons
│   ├── 📁 Menu/          # Sidebar & Navigation Logic
│   ├── 📁 Security/      # Auth Guards & Impersonation UI
│   └── 📁 Schema/        # Dynamic Data Table Components
├── 📁 context/           # React Context Providers
├── 📁 hooks/             # Custom State & Hierarchy Hooks
├── 📁 pages/             # Page-level Views
│   ├── 📁 Login/         # Authentication Pages
│   ├── 📁 Settings/      # Admin & Config Pages
│   ├── 📁 Campaigns/     # Recruitment Campaigns
│   └── 📁 Profiles/      # Candidate Management
├── 📁 services/          # API Clients & Axios Interceptors
├── 📁 src/               # I18n & App Core Initialization
├── 📁 types/             # Global TypeScript Interfaces
├── 📄 App.tsx            # Main Application Entry & Routing
└── 📄 vite.config.ts     # Frontend Build Configuration
```

## 🌟 Overview

**MapRecruit.ai** is a state-of-the-art talent acquisition platform designed to streamline and intelligentize the recruitment lifecycle. Built with a focus on visual excellence and robust security, it empowers HR teams with AI-driven insights, multi-tenant client management, and advanced administrative controls.

## ✨ Key Features

### 👤 Advanced User & Role Management
- **Smart Identity**: Automated first/last name parsing and data consistency.
- **Hierarchical RBAC**: Sophisticated Role-Based Access Control that respects company seniority.
- **Client Context**: Automated active client assignment ensuring zero-config onboarding for new users.

### 🛡️ Secure Admin Impersonation
- **Safe Auditing**: High-fidelity impersonation with 'View-Only' (Safe) and 'Full Access' (Audited) modes.
- **Safety Interceptor**: Built-in request blocking to prevent accidental data modification during restricted sessions.

### 🔐 Multi-Protocol Authentication
- **Modern Security**: Native support for **Passkeys** (SimpleWebAuthn).
- **Enterprise Ready**: Seamless integration with **Microsoft (MSAL)** and **Google OAuth**.
- **MFA Architecture**: Built-in protection for sensitive administrative actions.

### 🌍 Global Localization (i18n)
- **Multi-Language**: Robust internationalization supporting English, Spanish, French, German, Japanese, and more.
- **Context Aware**: Automatic language detection and localized date/currency formatting.

### 📊 Dynamic Intelligent Dashboard
- **Customizable Layout**: Drag-and-drop widget system powered by **Gridstack.js**.
- **Visual Analytics**: Real-time hiring metrics via **Recharts** and **D3.js**.
- **Integration**: Deeply integrated with **Microsoft Clarity** for user experience tracking.

---

## 💻 Tech Stack

| Type | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **State/Routing** | React Router 7, Context API |
| **Icons & UI** | Lucide React, Gridstack, React Hot Toast |
| **I18n** | i18next, react-i18next |
| **Analytics** | Recharts, D3.js, Microsoft Clarity |
| **Build/Ops** | Vite, Vercel Ready |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **NPM**: v9.x or higher

### 1. Installation
Clone the repository and install dependencies for both frontend and backend.

```bash
# Install root (Frontend) dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Configuration
Create a `.env` file in the root and `backend/` directories.

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_key_here
```

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Development
Run both servers simultaneously for a full experience.

```bash
# Start Frontend (Root)
npm run dev

# Start Backend (in /backend)
npm run dev
```

---

## 📑 Project Structure

```text
├── components/          # Reusable UI components
├── context/             # React Context (Auth, Impersonation)
├── hooks/               # Custom React hooks (Hierarchy, Theme)
├── pages/               # Page-level components
├── services/            # API services and Interceptors
├── types/               # TypeScript definitions
└── backend/             # Express server and MongoDB models
```

---

## 🛡️ Security Note

This repository uses a **Safety Interceptor** to protect data during admin impersonation. Attempts to perform unauthorized `POST`, `PUT`, or `DELETE` requests while in View-Only mode will be automatically blocked at the network level.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
    Made with ❤️ by the MapRecruit Team
</div>
