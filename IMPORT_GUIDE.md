# 📊 How to Import Your Data from Google Sheets

Your app now has a built-in CSV import feature! Here's how to get your 90 rounds of data into the app.

## Quick Guide (3 Steps)

### Step 1: Export Your Google Sheet as CSV

1. Open your Google Sheet: [points.xlsx](https://docs.google.com/spreadsheets/d/1SsDCZ5C0fsIz4e4WiD6H_P2GccCCtKqCPdiuR-6wElM/)
2. Click **File** → **Download** → **Comma Separated Values (.csv)**
3. Save the file to your computer (e.g., `points.csv`)

### Step 2: Prepare the CSV

Your exported CSV will have columns for each round (D, E, F... = Round 1, 2, 3...). You need to **transform it** into this format:

```
roundNumber,playerName,points,dnf
1,Varun,25,false
1,Prikshit,18,false
1,Rayyan,15,false
...
2,Varun,18,false
2,Prikshit,25,false
...
```

**To do this automatically**, run this Node.js script:

```bash
# Save this as convert-sheet.js in your project root
node convert-sheet.js points.csv
```

[See the conversion script below](#conversion-script)

### Step 3: Upload to Your App

1. Go to **Admin Dashboard** → look for "Import Round Data" section
2. Click the upload button and select your converted CSV file
3. Click Import
4. Done! Your 90 rounds are now in the database ✓

---

## Conversion Script

Save this as `convert-google-sheet.js` in your project root:

```javascript
const fs = require('fs');
const csv = require('csv-parser');

// Update these with your actual data
const PLAYERS = [
  'Varun',
  'Prikshit',
  'Rayyan',
  'Niraj',
  'Rahul',
  'Ashish Academy',
  'Sujal',
  'Sahil',
  'Jaydeep',
  'Tushar',
];

// This will be your column headers from the Google Sheet
// Typically starting from column D (Round 1) to column CV (Round 90)
const ROUND_START_COLUMN = 3; // Column D (0-indexed)
const TOTAL_ROUNDS = 90;

function convertGoogleSheetToCSV(inputFile, outputFile) {
  const results = [];
  let roundNumber = 1;

  fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
      const playerName = row['Standing'] || row['Player']; // Adjust based on your column name
      if (!playerName || !PLAYERS.includes(playerName)) return;

      // For each round (columns 3 to 3+90)
      for (let i = 0; i < TOTAL_ROUNDS; i++) {
        const columnName = String.fromCharCode(68 + i); // D, E, F... (ASCII 68 = 'D')
        const points = parseInt(row[columnName]) || 0;
        const dnf = points === 0 || row[columnName]?.toLowerCase() === 'dnf';

        results.push({
          roundNumber: i + 1,
          playerName,
          points,
          dnf,
        });
      }
    })
    .on('end', () => {
      // Write output CSV
      const output = [
        'roundNumber,playerName,points,dnf',
        ...results.map((r) =>
          `${r.roundNumber},${r.playerName},${r.points},${r.dnf}`
        ),
      ].join('\n');

      fs.writeFileSync(outputFile, output);
      console.log(
        `✓ Converted! Output saved to ${outputFile} (${results.length} records)`
      );
    })
    .on('error', (error) => {
      console.error('Error reading CSV:', error);
    });
}

// Usage
const inputFile = process.argv[2] || 'points.csv';
const outputFile = 'points-formatted.csv';
convertGoogleSheetToCSV(inputFile, outputFile);
```

Run it:
```bash
node convert-google-sheet.js points.csv
# Output: points-formatted.csv
```

---

## Alternative: Manual Conversion

If the script doesn't work, you can manually create the CSV:

1. Open your Google Sheet export in Excel
2. Copy all round scores for one player
3. Paste into a text editor
4. Format as: `roundNumber,playerName,points,dnf`
5. Repeat for each player

Or use this Python script instead:

```python
import csv

players = ['Varun', 'Prikshit', 'Rayyan', 'Niraj', 'Rahul', 
           'Ashish Academy', 'Sujal', 'Sahil', 'Jaydeep', 'Tushar']

with open('points.csv', 'r') as infile, open('points-formatted.csv', 'w') as outfile:
    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames=['roundNumber', 'playerName', 'points', 'dnf'])
    writer.writeheader()
    
    for row in reader:
        player = row.get('Standing') or row.get('Player')
        if player not in players:
            continue
        
        # Round columns are D through CV (columns 4-95)
        for round_num in range(1, 91):
            col_letter = chr(67 + round_num)  # D=68, so 67+1=68...
            points = int(row.get(col_letter, 0) or 0)
            dnf = points == 0
            
            writer.writerow({
                'roundNumber': round_num,
                'playerName': player,
                'points': points,
                'dnf': dnf
            })

print("✓ Conversion complete!")
```

---

## Troubleshooting

**Error: "No valid data found in CSV"**
- Check that your CSV has the right headers: `roundNumber,playerName,points,dnf`
- Make sure player names match exactly (case-sensitive)

**Error: "Import failed"**
- Verify the CSV file isn't corrupted
- Check that all required columns are present
- Try importing again

**Only some rounds imported**
- Some player names might not match - check for typos
- The script skips players not in the database

---

## Need Help?

If your export format is different, let me know and I can help adjust the conversion script!
