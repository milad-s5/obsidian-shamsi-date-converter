# Quick Start Guide

## 5-Minute Setup

### 1. Install (2 minutes)
1. Extract zip to `.obsidian/plugins/shamsi-date-converter/`
2. Restart Obsidian
3. Enable in Settings → Community plugins

### 2. Test It (1 minute)
Create a new note and add:
```yaml
---
Watched on start: 2025-09-30
Watched on end: 2026-02-17
---
```

Save the file. You should see:
```yaml
---
Watched on start: 2025-09-30
Watched on end: 2026-02-17
Shamsi start: 1404/07/08
Shamsi end: 1404/11/28
---
```

### 3. Customize (2 minutes)
Go to Settings → Shamsi Date Converter:

**Want different property names?**
- Click "Edit" on any pair
- Change names (e.g., "Started" → "Shamsi started")
- Save

**Need more pairs?**
- Click "Add Date Pair"
- Enter your property names
- Save

**Want different format?**
- Change "Date format" from `YYYY/MM/DD` to `YYYY-MM-DD`
- All future dates will use new format

## Common Use Cases

### Movie/TV Tracker
**Properties:** `Watched on start`, `Watched on end`  
**Perfect for:** Tracking when you started and finished watching

### Reading Log
**Add pair:** `Started reading` → `Shamsi reading start`  
**Add pair:** `Finished reading` → `Shamsi reading end`  
**Perfect for:** Book tracking

### Project Management
**Add pair:** `Project start` → `Shamsi project start`  
**Add pair:** `Deadline` → `Shamsi deadline`  
**Perfect for:** Project tracking with Persian dates

### Event Planning
**Add pair:** `Event date` → `تاریخ رویداد`  
**Perfect for:** Persian calendar events

## Tips

✅ **Property names are case-sensitive**  
✅ **Can use Persian text** in target property names  
✅ **Empty dates are ignored** (no error)  
✅ **Changes update automatically** when you edit dates  

## Troubleshooting

**Nothing happening?**
→ Check auto-convert is ON in settings

**Wrong date?**
→ Verify Gregorian date is correct

**Want to convert many files?**
→ Open each file or use Command Palette

---

**That's it! You're ready to go.** 🚀
