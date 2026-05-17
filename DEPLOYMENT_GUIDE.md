# 🚀 Complete Deployment Guide

Follow these steps to deploy your Points Tracker app to production so you can share it with your players.

## Part 1: Setup Supabase (Free)

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with email or GitHub
3. Click "New Project"
4. Choose organization, give it a name (e.g., "points-tracker")
5. Set a strong database password
6. Choose region closest to you
7. Wait for project to initialize (~2 minutes)

### Step 2: Create Database Tables

1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy everything from `supabase/schema.sql` (in your project folder)
4. Paste into the SQL editor
5. Click "Run"
6. You should see "Success" messages for all tables

### Step 3: Get Your Credentials

1. Click "Project Settings" → "API"
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Public Key** (long string starting with `eyJ`)

3. Back in your terminal, create `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ADMIN_PASSWORD=YourSecurePassword123
   ```

4. Save the file

### Step 4: Seed Your Players

```bash
npm run seed
```

You should see a message saying the 10 players were added. ✓

---

## Part 2: Setup GitHub (Free)

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `points-tracker` (or anything)
4. Description: "F1-style points tracker app"
5. Click "Create repository"

### Step 2: Push Your Code

```bash
# In your project folder
git init
git add .
git commit -m "Initial Points Tracker app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/points-tracker.git
git push -u origin main
```

(Replace YOUR_USERNAME with your actual GitHub username)

You should see your code uploaded to GitHub. ✓

---

## Part 3: Deploy to Vercel (Free)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub
5. You're in!

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Paste your GitHub repo URL (looks like `https://github.com/YOUR_USERNAME/points-tracker`)
4. Click "Continue"

### Step 3: Add Environment Variables

On the next screen, under "Environment Variables":

1. Add first variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: (paste your Supabase URL)
   - Click "Add"

2. Add second variable:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (paste your Anon key)
   - Click "Add"

3. Add third variable:
   - Name: `ADMIN_PASSWORD`
   - Value: (your secure password)
   - Click "Add"

### Step 4: Deploy!

1. Click "Deploy"
2. Wait ~3 minutes for deployment to complete
3. You'll see "Congratulations! Your project has been successfully deployed"
4. Click the project URL to visit your live app! 🎉

---

## Part 4: Share Your App

Your app is now live! The URL will look like:
```
https://points-tracker-abc123.vercel.app
```

### Share These Links:

- **Leaderboard**: `https://your-app.vercel.app/`
- **Analytics**: `https://your-app.vercel.app/analytics`
- **Admin Panel**: `https://your-app.vercel.app/admin`

Tell your players:
> Here's the leaderboard! The admin can add results at `/admin`

---

## Part 5: Adding Your Historical Data

If you want to import your 90 rounds from the Google Sheet:

### Option A: Manual Entry (Best for Fresh Start)

1. Go to `/admin` on your live site
2. Enter admin password
3. Start entering rounds one by one
4. Takes ~30 min for 90 rounds but ensures accuracy

### Option B: CSV Import (Faster)

1. Export your Google Sheet as CSV
2. Create `scripts/import-csv.ts` with custom logic
3. Run the import script
4. (This requires more technical setup)

**Recommendation**: Start fresh and add future rounds. Historical data isn't critical for the UI to look great.

---

## Part 6: Making Updates

If you want to update the app later:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Vercel automatically redeploys! ✓

---

## Troubleshooting

### "Supabase URL is required"
- Make sure `.env.local` has the correct URLs (check for typos)
- Restart `npm run dev`

### "Incorrect password" on admin panel
- Check `ADMIN_PASSWORD` in `.env.local` (or Vercel env vars)
- Make sure you're copying it exactly

### Tables not showing in Supabase
- Go to Supabase SQL editor
- Make sure the schema.sql ran successfully
- Check the "Tables" section in the sidebar

### App won't deploy on Vercel
- Check all 3 environment variables are set correctly
- Go to Project Settings → Deployments and check build logs
- Look for red error messages

---

## Success Checklist

- [ ] Supabase database created
- [ ] Schema tables created
- [ ] `.env.local` has Supabase credentials
- [ ] Players seeded (`npm run seed`)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported into Vercel
- [ ] All 3 env vars set in Vercel
- [ ] Deployment successful
- [ ] Can visit live app
- [ ] Admin login works with your password
- [ ] Can add a test round
- [ ] Leaderboard updates

---

## Your Live App is Ready! 🎉

Share the link with your players and they can watch the live standings update!

Need help? Check the [README.md](./README.md) for more details.
