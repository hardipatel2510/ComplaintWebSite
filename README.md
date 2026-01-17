# 🛡️ Secure Anonymous Complaint Platform

A privacy-first, secure web application designed for Sexual Harassment Committees to manage complaints with absolute anonymity. Built with Next.js 14 and Firebase.

## 🌟 Key Features

### For Complainants (Public)

- **Total Anonymity**: No login required. No IP logging. **Right-click disabled** globally to prevent content copying.
- **Secure Submission**:
  - Dynamic form with smart **Location Selection** (Campus Dropdown + Specific Area).
  - **Multi-File Evidence Upload**: Securely attach Images, Videos, and Audio (max 10MB total) via **Supabase Storage**.
  - Encryption-ready description handling.
- **Status Tracking**: Track case progress using a unique **Complaint ID** and **access code**.
- **Live Updates**: View public status updates from the committee securely.

### For Administrators & Committee (Restricted)

- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full system management, user creation/deletion.
  - **Committee Member**: Read-only oversight access.
  - **Action Taker**: Update status, add internal notes, and manage assigned cases.
- **Dashboard**: Rich data visualization and case management tables.
- **Media Viewer**: Securely view attached evidence directly in the dashboard.
- **Secure Export**: Generate PDF/CSV reports for official records.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Auth, Admin SDK)
- **Storage**: [Supabase](https://supabase.com/) (Object Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase Project (Firestore, Auth).
- A Supabase Project (Storage bucket: 'Proof' or 'complaint-evidence').

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
    Create a `.env.local` file in the root directory:

    ```env
    # Firebase Client
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Supabase Storage
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Firebase Admin (Server-Side)
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
