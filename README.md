    # YBAI Solution - Enterprise AI Chatbot Platform

    ![React](https://img.shields.io/badge/React-v19.0.0-blue) ![Vite](https://img.shields.io/badge/Vite-v7.2.4-646CFF) ![Status](https://img.shields.io/badge/Status-Production%20Ready%20Frontend-success)

    ## 🚀 Project Overview

    **YBAI Solution** is a scalable, centralized AI platform frontend designed to host multiple specialized AI assistants (Story Writer, Code Helper, Mental Health Bot, etc.).

    This repository contains the **production-grade frontend architecture**, featuring a modular component system, service-based API layer, robust state management, and a fully responsive design. It is engineered to seamlessly integrate with a backend API.

    ---

    ## 🛠 Tech Stack

    - **Core:** [React 19](https://react.dev/)
    - **Build Tool:** [Vite](https://vitejs.dev/)
    - **Routing:** [React Router DOM v7](https://reactrouter.com/)
    - **State & Hooks:** Custom React Hooks (`useDashboard`, `useAuth`)
    - **Styling:** Modular CSS with CSS Variables (Theming support)
    - **HTTP Client:** Axios (Service-layer abstraction)
    - **UI Feedback:** React Hot Toast
    - **Icons:** React Icons (FontAwesome)

    ---

    ## ✨ Key Features

    ### 1. 🔐 Robust Authentication & Security

    - **Secure Flows:** Login, Registration, and Forgot Password wizards.
    - **Protected Routes:** Higher-Order Components (HOC) prevent unauthorized access to internal pages.
    - **Input Validation:** Strict validation for emails, passwords, and OTPs with real-time feedback.

    ### 2. 🤖 Interactive Chat Interface (`/chat`)

    - **ChatGPT-Style UI:** Clean, message-bubble interface for user vs. AI interaction.
    - **Sidebar History:** Dedicated chat history sidebar for easy navigation between sessions.
    - **Dynamic Input:** Auto-expanding text areas with support for sending messages via API services.

    ### 3. ⚙️ Comprehensive Settings Module (`/settings`)

    A fully fleshed-out settings management center featuring:

    - **Profile Management:** Update avatars, names, and personal details.
    - **Security:** Password reset flows and 2FA configuration UI.
    - **API Management:** UI for users to manage their own API Keys.
    - **Notification Preferences:** Granular control over email and push alerts.
    - **Data Privacy:** Options for data export and account deletion.

    ### 4. 💳 Subscription & Billing (`/subscriptions`)

    - **Tiered Plans:** Visually distinct cards for Free, Pro, and Enterprise tiers.
    - **Upgrade Logic:** dedicated `UpgradePlanModal` for handling payment flows.
    - **Usage Tracking:** UI components to display token usage and limits.

    ### 5. 📱 Responsive Dashboard Architecture

    - **Layout Engine:** A persistent `DashboardLayout` wrapping the application.
    - **Smart Navigation:**
    - **Desktop:** Collapsible Sidebar with state persistence.
    - **Mobile:** Bottom Navigation Bar and Hamburger menus.
    - **Global Loader:** `PageLoader` component to handle async state transitions smoothly.

    ---

    ## 📂 Application Architecture

    The project follows a **Feature-First** directory structure for scalability:

    ```text
    src/
    ├── components/           # UI Building Blocks
    │    ├── Auth/            # Login, Signup, ProtectedRoute
    │    ├── Chat/            # ChatInput, MessageList, ChatSidebar
    │    ├── Layout/          # Sidebar, Header, MobileNav, Layout Wrapper
    │    ├── Modals/          # Upgrade Modal, Delete Confirmation
    │    └── Settings/        # Modular sections (Profile, API, Security)
    ├── hooks/                # Custom Hooks (useDashboard, etc.)
    ├── pages/                # Route Views (Dashboard, ChatPage, Settings...)
    ├── services/             # API Layer (Decoupled from UI)
    │    ├── api.js           # Axios Interceptor & Config
    │    ├── authService.js   # Auth endpoints
    │    ├── chatService.js   # LLM interaction endpoints
    │    └── dashboardService.js
    ├── styles/               # CSS Modules & Global Variables
    └── main.jsx              # Entry Point
    ```

    ## 🔧 Service Layer Configuration

    The application uses a **Service Layer Pattern** in `src/services/`. API calls are abstracted away from React components.

    - **`api.js`**: Handles the Axios instance, base URLs, and token interception.
    - **`authService.js`**: Manages login/signup payloads.
    - **`chatService.js`**: Handles sending messages and retrieving history.

    > **Note:** The frontend is configured to consume RESTful APIs. Ensure your `.env` file is configured with the correct backend endpoints.

    ---

    ## 🚀 Setup & Installation

    **1. Clone the repository:**

    ```bash
    git clone https://github.com/ybinfotech2521/MultipleAIChatbot_React_UI.git
    ```

    **2. Install dependencies:**

    ```bash
    npm install
    ```

    **3. Configure Environment: Create a `.env` file in the root directory:**

    ```bash
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    ```

    **4. Run the development server:**

    ```bash
    npm run dev
    ```
