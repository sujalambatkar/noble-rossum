# 📖 How to Use Points Tracker

## For Players (Public)

### View Leaderboard
Visit the main page to see:
- **Current Standings** - Full table of all players ranked by total points
- **Podium** - Top 3 displayed as 🥇🥈🥉 cards
- **Stats Per Player** - Total points, wins, average points per round

### View Analytics
Go to `/analytics` to see:
- **Points Gap** - How many points each player needs to catch the leader
- **Win Probability %** - Chance of winning based on current performance
- **Performance Trend** - Line chart showing cumulative points over rounds
- **Detailed Table** - All analytics metrics for every player

---

## For Admin (Password Protected)

### Login
1. Go to `/admin`
2. Enter your admin password
3. You'll be redirected to the dashboard

### Add a New Round

1. **Enter Round Number** - If this is your 91st round, enter 91
2. **For Each Player**:
   - Either select their finish position (1-10)
   - OR check "DNF" if they didn't finish (0 points)
3. **Click "Submit Round Results"**
4. The system automatically:
   - Assigns F1-style points (25 for 1st, 18 for 2nd, etc.)
   - Updates total points
   - Recalculates leaderboard
   - Updates analytics

### Manage Players

**Add a New Player**:
1. Type player name in the input field
2. Click "Add Player"
3. They'll appear in the list and on the leaderboard

**Remove a Player**:
1. Click "Remove" on any player
2. Confirm deletion (removes them and all their results)

---

## Points System

| Finish | Points |
|--------|--------|
| 1st    | 25     |
| 2nd    | 18     |
| 3rd    | 15     |
| 4th    | 12     |
| 5th    | 10     |
| 6th    | 8      |
| 7th    | 6      |
| 8th    | 4      |
| 9th    | 2      |
| 10th   | 1      |
| DNF    | 0      |

---

## Features Explained

### F1 Scoring
The app uses actual Formula 1 points: high points for 1st (25), dropping to 1 for 10th. This rewards consistency and wins.

### Win Probability
Calculated based on each player's average points per round:
- If a player averages 15 pts/round and has 100 pts while leader has 120, they need 1-2 more strong rounds
- The % shows their statistical chance to win the championship
- Takes into account current standings and historical performance

### Points Gap Analysis
Shows exactly how many points behind the leader each player is, plus estimated rounds needed to catch up at their current pace.

### Performance Trend Chart
Visualizes the journey of each player from round 1 onwards:
- Steep lines = gaining points fast
- Flat lines = struggling or not participating
- Helps identify who's hot and who's not

---

## Tips for the Best Experience

1. **Update results regularly** - Add new rounds right after events
2. **Check Analytics weekly** - See who's gaining momentum
3. **Share the link** - Non-technical players can view without logging in
4. **Keep admin password safe** - Only you need it
5. **Monitor your stats** - Watch your average PPR improve!

---

## Common Questions

**Q: Can players add results themselves?**  
A: No, it's admin-only to ensure accuracy. Players can view standings anytime.

**Q: What if someone doesn't finish a round?**  
A: Check the "DNF" box and they get 0 points for that round.

**Q: Can I edit past results?**  
A: Currently no, but you can reach out to the developer to add this feature.

**Q: How is win probability calculated?**  
A: `(player_avg_ppr / sum_of_all_avg_ppr) * 100`. It's simple but effective!

**Q: Can I change the points system?**  
A: Yes! Edit `lib/points.ts` in the code and redeploy.

---

## Your Leaderboard is Ready!

Start adding rounds and watch the competition unfold. 🏁

Questions? Check [README.md](./README.md) for technical details.
