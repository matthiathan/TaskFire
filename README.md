# TaskFire

TaskFire is a high-performance, real-time productivity dashboard and task management system built with React, Vite, and Supabase. It features an executive-grade interface designed for rapid situational awareness and precise operational control.

## Tech Stack

- **Frontend**: React 18+, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Framer Motion
- **Backend/Auth**: Supabase (PostgreSQL, Auth, Realtime)
- **Analytics**: Recharts
- **Reporting**: jsPDF, jspdf-autotable

## Key Features

- **Executive Monitor**: Real-time status breakdown and resolution efficiency analytics.
- **Strategic Stream**: User-specific CRUD operations with support for priorities, start dates, and deadlines.
- **Security First**: Row-Level Security (RLS) ensures operators only access their assigned data.
- **Reporting**: On-demand PDF generation of executive briefings for management review.
- **Real-time Sync**: Instant UI updates across all active sessions using Supabase Realtime.

## Local Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Create a `.env` file (or use AI Studio Secrets) with the following:
   ```env
   VITE_SUPABASE_URL=your_supabase_api_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Database Setup**:
   Run the schema provided in `supabase_schema.sql` in your Supabase SQL Editor.
5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

## Database Schema

- **auth.users**: Managed by Supabase Auth.
- **public.users**: Profile data synced via triggers (id, email, full_name, role).
- **public.tasks**: The core data store (id, user_id, title, status, priority, etc.).

## Environment Variables

- `VITE_SUPABASE_URL`: The Project URL from Supabase Project Settings > API.
- `VITE_SUPABASE_ANON_KEY`: The `anon` `public` key from Supabase Project Settings > API.
- `GEMINI_API_KEY`: Required for AI features (if enabled).

---
*TaskFire // Executive Productivity Stream*
