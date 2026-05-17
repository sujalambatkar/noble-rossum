# ✅ Getting Started with Points Tracker

Your F1-Style Points Tracking app is ready to go! Here's the quickest path to launch.

## 🚀 Deploy in 15 Minutes

### Step 1: Setup Supabase (3 min)
1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. In SQL Editor, paste code from `supabase/schema.sql` and run it
4. Copy your Project URL and Anon Key from Settings → API
5. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ADMIN_PASSWORD=admin123
   ```
6. Run: `npm run seed` ✓

### Step 2: Push to GitHub (3 min)
```bash
git init
git add .
git commit -m "Points tracker app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/points-tracker.git
git push -u origin main
```

### Step 3: Deploy to Vercel (5 min)
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project" and select your GitHub repo
3. Add the same 3 env variables from Step 1
4. Click "Deploy"
5. Wait for deployment ✓
6. Click the URL to see your live app!

## 🎉 You're Live!

Your app is now accessible at: `https://your-app.vercel.app`

Share these links with your players:
- **Main**: `https://your-app.vercel.app/`
- **Analytics**: `https://your-app.vercel.app/analytics`
- **Admin**: `https://your-app.vercel.app/admin` (password protected)

## 🛠️ Test Locally First (Optional)

Before deploying, test locally:

```bash
npm install
npm run seed
npm run dev
```

Visit `http://localhost:3000` and test:
1. Homepage loads with 10 players
2. Analytics page shows charts
3. Admin login works with your password
4. Can add a test round

---

## 📚 Full Documentation

- **[README.md](./README.md)** - Overview & features
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Detailed setup instructions
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - How to use the app

---

## ⚡ Quick Commands

```bash
npm run dev          # Run locally
npm run build        # Build for production
npm run seed         # Initialize players
npm run start        # Run production build
```

---

## 🎯 Next Steps

1. Follow the 3 steps above
2. Add your first round of results
3. Share the URL with your players
4. Watch the leaderboard updates live!

---

## 💡 Pro Tips

- Admin panel is at `/admin` - only you should know the password
- Players can view both home leaderboard and analytics freely
- Analytics refresh every time you add a round
- Share a screenshot of the podium on social media! 📸

---

## 🆘 Need Help?

- Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed steps
- Review [USAGE_GUIDE.md](./USAGE_GUIDE.md) for how to use features
- Verify `.env.local` has correct Supabase credentials
- Check Vercel deployment logs if something fails

---

**You're all set! 🏁 Start tracking your points and let the competition begin!**
