# YBAI Solution - AI Chatbot Platform (Frontend)

## 🚀 Project Overview
This is the frontend repository for the centralized AI Chatbot platform. The application allows users to sign up, verify their identity via OTP, log in, and access a dashboard of AI assistants (Story Writer, Code Helper, etc.).

**Current Progress:** Week 1 Complete (Authentication & Dashboard UI)

---

## 🛠 Tech Stack
* **Framework:** React (Vite)
* **Styling:** Pure CSS (Custom "YBAI Solution" Theme)
* **Routing:** React Router DOM v6
* **HTTP Client:** Axios
* **Notifications:** React Hot Toast

---

## ✨ Features Implemented (Week 1)

### 1. Unified Authentication (`/`)
* **Tabbed Interface:** Smooth toggle between "Sign In" and "Sign Up" without page reloads.
* **Animations:** Smooth sliding pill tabs and fade-in form transitions.
* **Validation:** Custom form validation with toast notifications (replacing browser defaults).
* **Auto-Username:** Automatically derives a username from the email input (e.g., `john@gmail.com` -> `john`).
* **Input Safeguards:**
    * Phone number input restricts non-numeric characters.
    * Passwords must match before submission.

### 2. OTP Verification (`/verify-otp`)
* **Security:** Route is protected; users cannot access this page without a valid email in state.
* **Input:** Numeric-only input restriction.
* **Mock Logic:** Simulates a verification delay and redirects to Login on success.

### 3. Forgot Password Flow (`/forgot-password`)
* **3-Step Wizard:**
    1.  Enter Email -> Send OTP.
    2.  Verify OTP.
    3.  Set New Password.

### 4. Dashboard (`/dashboard`)
* **Protected Route:** Accessible only after successful login (Token check).
* **Grid Layout:** Responsive grid displaying available AI bots.
* **Search/Filter:** Real-time filtering of bots by name or description.
* **Mock Data:** Simulates an API fetch with a loading state.

---

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ybinfotech2521/MultipleAIChatbot_React_UI.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

Currently, the application is running in **MOCK MODE** for demonstration purposes.

---

## 📂 Folder Structure

```text
src/
 ├── components/       # Reusable UI components (ProtectedRoute, etc.)
 ├── pages/            # Full page views
 │    ├── AuthPage.jsx       # Combined Login/Signup
 │    ├── Dashboard.jsx      # Main Bot Grid
 │    ├── OtpVerify.jsx      # OTP Input Page
 │    └── ForgotPassword.jsx # Recovery Flow
 ├── styles/           # Global Stylesheets
 │    ├── Auth.css           # Styling for Login/Signup/OTP
 │    └── Dashboard.css      # Styling for the Main App
 ├── App.jsx           # Routing & Navigation Setup
 └── main.jsx          # Entry Point & Toaster Setup
