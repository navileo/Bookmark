# Smart Bookmark

[![Live Demo](https://img.shields.io/badge/demo-live-blue?style=for-the-badge)](https://bookmark-ten-beta.vercel.app/)

Smart Bookmark is a modern, real-time web application for organizing and managing your digital links. Built with performance and user experience in mind, it provides a clean, "standard moderate" interface for saving, categorizing, and accessing your bookmarks instantly across devices.

🔗 **Live Link**: [https://bookmark-ten-beta.vercel.app/](https://bookmark-ten-beta.vercel.app/)

## 🚀 Features

- **Optimistic UI Updates**: Instant feedback when adding or deleting bookmarks, providing a lag-free user experience.
- **Advanced Search & Filtering**: Real-time filtering of your bookmark library with a sleek, responsive search interface.
- **Smart Favicon Integration**: Automatic fetching and display of website favicons for better visual recognition.
- **Real-time Synchronization**: Powered by Supabase, your bookmarks update instantly across all open tabs and devices.
- **Robust Authentication**: Secure Google OAuth integration with a resilient session handling system that prevents loading stalls.
- **Modern UI/UX**: A polished, industry-standard interface with a sidebar-ready layout and responsive grid designs.
- **Optimized Performance**: Minimized loading buffers through centralized state management and optimized data fetching.

## 🛠️ Tools & Technologies

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (useState, useEffect, useCallback) with Optimistic Patterns
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### Backend & Database
- **Platform**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (with Real-time enabled)
- **Authentication**: Supabase Auth (Google OAuth)

### Development Tools
- **Environment**: Node.js
- **Package Manager**: npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/)

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/navileo/Bookmark.git
   cd "Smart BookMark"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   Ensure you have a `bookmarks` table in your Supabase project with the following structure:
   - `id`: uuid (Primary Key)
   - `created_at`: timestamp with time zone (default: now())
   - `user_id`: uuid (Foreign Key to auth.users)
   - `title`: text
   - `url`: text

## 🏃 How to Run

To start the development server, run:

```bash
npx next dev -p 3009
```

Once the server is running, you can access the application at [http://localhost:3009](http://localhost:3009).

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---
Built with ❤️ using Next.js and Supabase.
