# TaskFire Strategic Stream

TaskFire is a high-performance productivity application designed for strategic task management and real-time operational monitoring. It features a tactical dark-themed interface, secure Supabase authentication, and real-time data synchronization.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (v4)
- **Animations:** Motion (Framer Motion)
- **Database/Auth:** Supabase (PostgreSQL + GoTrue)
- **Realtime:** Supabase Realtime (Postgres Changes)
- **Icons:** Lucide React
- **Reporting:** jsPDF + autoTable

## 🛠️ Local Setup

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Launch the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Database Schema

### `public.users` (Profile Metadata)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | References auth.users.id |
| email | text | User email address |
| full_name | text | Display name |
| role | text | 'operator' or 'director' (Default: 'operator') |
| created_at | timestamp | Auto-generated timestamp |

### `public.tasks` (Operational Entities)
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Primary Key |
| user_id | uuid | FK to auth.users.id |
| title | text | Task headline |
| description | text | Detailed briefing |
| status | text | 'Pending', 'In Progress', 'Completed' |
| priority | text | 'Low', 'Medium', 'High' |
| start_date | timestamp | Mission start time |
| due_date | timestamp | Mission deadline |
| started_at | timestamp | Actual start timestamp |
| completed_at | timestamp | Actual completion timestamp |
| created_at | timestamp | Auto-generated |

## 📦 Deployment

This application is ready for deployment to any static site hosting provider (Vercel, Netlify, Cloudflare Pages). Ensure that you set the environment variables in your deployment dashboard.

The Vite build is optimized for production:
```bash
npm run build
```

## 🛡️ RLS (Row Level Security)

Strict Row Level Security is enforced on all tables. 
- **Users Table:** Users can only read/update their own profile.
- **Tasks Table:** Users have full CRUD access to their own tasks (`user_id = auth.uid()`).
