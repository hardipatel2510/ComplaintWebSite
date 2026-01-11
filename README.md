# 🛡️ Secure Anonymous Complaint Platform

A privacy-first, secure web application designed for Sexual Harassment Committees to manage complaints with absolute anonymity. Built with Next.js 14 and Firebase.

## 🌟 Key Features

### For Complainants (Public)

- **Total Anonymity**: No login required to file complaints. No IP logging.
- **Secure Submission**: Encryption-ready data handling for sensitive descriptions.
- **Status Tracking**: Track case progress using a unique **Complaint ID** and **access code** (no email tracking).
- **Live Updates**: View public status updates from the committee without exposing identity.

### For Administrators & Committee (Restricted)

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full system management, user creation/deletion.
  - **Committee Member**: Read-only access to all complaints for oversight.
  - **Action Taker**: Update status, add internal notes, and manage assigned cases.
- **Dashboard**: Rich data visualization and case management tables.
- **Secure Export**: Generate PDF/CSV reports for official records (Server-side generated).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Admin SDK)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase Project with Firestore and Auth enabled.

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/complaint-system.git
    cd complaint-system
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Firebase credentials:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # For Server-Side Admin Operations
    FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...}
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Security & Roles

The system is guarded by strict **Firestore Security Rules**:

| Role             | Permissions                                              |
| :--------------- | :------------------------------------------------------- |
| **Public**       | `create` (Complaints), `read` (Single Complaint with ID) |
| **Committee**    | `read` (All Complaints, Logs)                            |
| **Action Taker** | `read` (All), `update` (Assigned Complaints)             |
| **Admin**        | `read`, `write`, `delete` (Everything + User Management) |

## 📂 Project Structure

- `/src/app`: App Router pages.
  - `/file-complaint`: Public submission form.
  - `/track`: Public tracking dashboard.
  - `/admin` & `/developer`: Restricted dashboards.
- `/src/components`: Reusable UI components.
- `/src/lib`: Firebase initialization and utilities.
- `/firestore.rules`: Security logic.

## 📝 License

This project is proprietary software designed for internal committee use.
