# 🏁 Points Tracker - F1 Style Leaderboard

A full-stack web application for tracking points and standings with F1-style scoring. Perfect for competitive gaming leagues, races, or any points-based competition.

## Features

✅ **F1-Style Scoring System** - Automatic points assignment based on rank (25-18-15-12-10-8-6-4-2-1)  
✅ **Live Leaderboard** - Real-time standings with podium display  
✅ **Advanced Analytics** - Win probability, points gap analysis, performance trends  
✅ **Admin Panel** - Password-protected interface to add rounds and manage players  
✅ **Beautiful Dark UI** - Racing-themed interface with animations  
✅ **Mobile Responsive** - Works on all devices  

## Quick Start (3 Steps)

### 1. Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) - create free account
2. Create a new project
3. In SQL editor, paste the schema from `supabase/schema.sql`
4. Copy credentials and update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ADMIN_PASSWORD=your_password
   ```

### 2. Initialize Players

```bash
npm install
npm run seed
```

### 3. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

## Usage

**Public**: `/` (Leaderboard) and `/analytics` (Charts)  
**Admin**: `/admin` (Login) → `/admin/dashboard` (Manage rounds & players)

## Deployment (Vercel - 5 minutes)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import repo
3. Add the 3 environment variables
4. Click Deploy → Share the URL!

## Tech Stack

Next.js 14 • Supabase • Vercel • Tailwind CSS • Recharts

## Points System

1st=25pts, 2nd=18, 3rd=15, 4th=12, 5th=10, 6th=8, 7th=6, 8th=4, 9th=2, 10th=1, DNF=0
