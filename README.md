# Modsy. - E-Commerce Premium Platform

![Modsy Banner](https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

**Modsy.** is a high-end, enterprise-grade e-commerce platform designed for modular custom furniture. Built with an emphasis on modern visual aesthetics, modular performance architectures, and scalable transactional flow management.

---

## ⚙️ Project Architecture & Organization

The workspace follows a clean **monorepo structure**, isolating concern layers ensuring scalable development cycles.

```bash
proyecto-final-dam/
├── 📁 backend/         # Express.js Engine with Hexagonal Architecture
│   ├── 📁 src/         # Core TypeScript logic
│   ├── 📁 dist/        # Transpiled distribution
│   └── 📄 package.json # Node API dependencies
├── 📁 frontend/        # Lightweight high-performance client
│   ├── 📁 pages/       # Structured HTML views (Modular Markup)
│   └── 📁 assets/      # Dynamic asset orchestration
│       ├── 📁 css/     # Clean Vanilla CSS per module (auth.css, orders.css...)
│       └── 📁 js/      # Encapsulated ES Modules (api-services.js, script.js...)
```

### Separation of Concerns
Every interactive view follows a rigid **Decoupled Triad Structure**:
1.  **Markup (`.html`)**: Pure semantics, zero internal CSS or logic.
2.  **Style (`.css`)**: Modular dedicated specifications per component/page.
3.  **Logic (`.js`)**: Encapsulated JS Modules imported dynamically at runtime.

---

## 🚀 Core Technology Stack

### Frontend (Client Interface)
*   **Serving Engine**: Vite (Ultralight ESM HMR Delivery).
*   **Styling Framework**: Advanced Vanilla CSS3 (Custom Variables, Modern Media Queries, Flexbox/Grid optimization).
*   **Logic Layer**: Native ECMAScript Modules (ESM), Fetch API abstraction.
*   **Visual Extensions**: IonIcons (Vector iconography), Google Fonts (Geist/Outfit typography rebranding), SweetAlert2 (Standardized premium dialog system).

### Backend (API Engine)
*   **Runtime**: Node.js + TypeScript (Strict typing safety).
*   **Framework**: Express.js + Helmet security hardening.
*   **Design Pattern**: **Hexagonal Architecture** (Port/Adapter isolation making code database-agnostic).
*   **Persistence Support**: Hybrid compatibility with MongoDB (via Mongoose ODM) and PostgreSQL (`pg` relational driver ready).
*   **Security**: JSON Web Tokens (JWT) authorization state handlers, Bcrypt password hashing algorithms.

---

## 💼 Key Features & Capabilities

1.  **Unified Dynamic Authentication System**: Full sign-up, granular error validation, and state-preservation via continuous API synchronization.
2.  **Modular Shopping Cart Ecosystem**: Centralized dynamic cart handlers with seamless state persistence.
3.  **Intelligent Dynamic Search**: Real-time client-side filtering algorithm with URL deep-linking support.
4.  **Responsive Enterprise Drawer Navigation**: Custom-built high-density mobile routing drawer imitating top-tier retail apps (El Corte Inglés pattern).
5.  **Rich Order Tracking Suite**: Real-time, clean transaction reporting securely isolated behind specialized AuthGuards.
6.  **State-Aware Navbar Mechanics**: Automatic identity hydration replacing standard logic with interactive user dashboards.

---

## 🛠️ Getting Started Locally

### Initializing Backend
```bash
cd backend
npm install
npm run dev # Starts Nodemon watching compilation
```

### Launching Frontend Environment
```bash
cd frontend
npx vite . --host # Boots the rapid visual workbench
```

*Developed with strict architectural engineering standards for maximum performance and scalability.*
