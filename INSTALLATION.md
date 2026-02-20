# Installation Guide for Shamsi Date Converter Plugin

## Quick Installation Steps

### Step 1: Locate Your Vault's Plugin Folder

1. Open your Obsidian vault folder
2. Navigate to `.obsidian/plugins/` 
   - If the `.obsidian` folder is hidden:
     - **Windows**: Enable "Show hidden files" in File Explorer
     - **Mac**: Press `Cmd + Shift + .` in Finder
     - **Linux**: Press `Ctrl + H` in your file manager

### Step 2: Create Plugin Folder

1. Inside `.obsidian/plugins/`, create a new folder named: `shamsi-date-converter`
2. Your path should look like: `YourVault/.obsidian/plugins/shamsi-date-converter/`

### Step 3: Add Plugin Files

Copy these files into the `shamsi-date-converter` folder:
- `main.js` (the main plugin code)
- `manifest.json` (plugin metadata)
- `styles.css` (optional, for styling)

Your folder structure should be:
```
YourVault/
└── .obsidian/
    └── plugins/
        └── shamsi-date-converter/
            ├── main.js
            ├── manifest.json
            └── styles.css
```

### Step 4: Enable the Plugin

1. Open Obsidian
2. Go to Settings (gear icon) → Community plugins
3. If you see a notice about restricted mode, click "Turn on community plugins"
4. Scroll down to find "Shamsi Date Converter" in the installed plugins list
5. Toggle it ON

### Step 5: Configure Settings (Optional)

1. Go to Settings → Shamsi Date Converter
2. Adjust settings as needed:
   - Toggle auto-convert on/off
   - Change property names if you use different ones
   - Choose your preferred date format

## Testing the Plugin

### Test 1: Create a New Note

1. Create a new note
2. Add frontmatter:
```yaml
---
Watched on start: 2024-02-12
---
```
3. Save the note (Ctrl/Cmd + S)
4. Check that `Shamsi start: 1402/11/23` was added automatically

### Test 2: Use Manual Command

1. Open a note with a date property
2. Press Ctrl/Cmd + P to open Command Palette
3. Type "shamsi" to find the conversion command
4. Execute it
5. Check that the Shamsi date was added

## Troubleshooting

### Plugin Not Showing Up

**Problem**: Plugin doesn't appear in the installed plugins list

**Solutions**:
- Check that files are in the correct folder: `.obsidian/plugins/shamsi-date-converter/`
- Ensure file names are exactly: `main.js` and `manifest.json` (case-sensitive)
- Restart Obsidian completely (not just reload)
- Check the Developer Console (Ctrl/Cmd + Shift + I) for error messages

### Plugin Won't Enable

**Problem**: Toggle turns off immediately after enabling

**Solutions**:
- Open Developer Console (Ctrl/Cmd + Shift + I)
- Look for red error messages
- Common issues:
  - Syntax error in main.js (if you modified it)
  - Missing manifest.json
  - Incompatible Obsidian version (need 0.15.0+)

### Date Not Converting

**Problem**: Shamsi date not being added automatically

**Solutions**:
- Check that "Auto-convert" is enabled in settings
- Verify your property name matches the setting (default: "Watched on start")
- Make sure date is in a valid format (YYYY-MM-DD works best)
- Try the manual conversion command
- Check that there isn't already a "Shamsi start" property

### Wrong Date Conversion

**Problem**: Shamsi date seems incorrect

**Solutions**:
- Verify the Gregorian date is correct
- Check timezone issues (plugin uses local date parsing)
- Test with a known date:
  - `2024-03-20` should convert to `1403/01/01` (Nowruz)
  - `2024-01-01` should convert to `1402/10/11`

## Uninstalling

If you want to remove the plugin:

1. Go to Settings → Community plugins
2. Toggle OFF "Shamsi Date Converter"
3. Delete the `.obsidian/plugins/shamsi-date-converter/` folder
4. Restart Obsidian

## Advanced Usage

### Using Different Property Names

If you track different types of dates:

**For Books**:
- Settings → Source property: `Reading Date`
- Settings → Target property: `Shamsi Reading Date`

**For Events**:
- Source: `Event Date`
- Target: `تاریخ شمسی` (you can use Persian text!)

### Batch Conversion

To convert multiple existing files:

1. Open each file
2. Use Command Palette → "Convert Watched on start to Shamsi start"
3. Or enable auto-convert and just open and save each file

### Custom Date Formats

You can change the output format in settings:
- `YYYY/MM/DD` → 1402/11/23
- `YYYY-MM-DD` → 1402-11-23
- `YYYY.MM.DD` → 1402.11.23

## Getting Help

If you continue to have issues:

1. Check the Developer Console for specific error messages
2. Verify all file names and folder structure
3. Test with a fresh, simple note
4. Try disabling other plugins to check for conflicts

## Updates

To update the plugin in the future:

1. Download the new `main.js` file
2. Replace the existing file in `.obsidian/plugins/shamsi-date-converter/`
3. Reload Obsidian or toggle the plugin off and on

---

Enjoy automatic Shamsi date conversion in your Obsidian vault! 🎉
