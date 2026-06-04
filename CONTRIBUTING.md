# 🚀 Release Guide for Shamsi Date Converter

**Last Updated:** June 4, 2026  
**Current Version:** 1.1.0  
**Plugin ID:** shamsi-date-converter

---

## 📋 Pre-Release Checklist

Before releasing a new version, complete ALL items in this checklist:

- [ ] All tests pass: `npm test`
- [ ] No lint errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Local testing in Obsidian passes
- [ ] Changelog.md is updated
- [ ] Version numbers are updated
- [ ] Git commits are ready

---

## 🔢 Version Update

### Step 1: Update Version Numbers

**File 1: `manifest.json`**
```json
{
  "id": "shamsi-date-converter",
  "name": "Shamsi Date Converter",
  "version": "1.1.0",  // ← UPDATE THIS
  ...
}
```

**File 2: `package.json`**
```json
{
  "name": "obsidian-shamsi-date-converter",
  "version": "1.1.0",  // ← UPDATE THIS
  ...
}
```

**Versioning Scheme:**
- `1.0.0` → `1.0.1` = Bug fix (patch)
- `1.0.0` → `1.1.0` = New feature (minor)
- `1.0.0` → `2.0.0` = Breaking changes (major)

---

## 📝 Update Changelog

Create or update `CHANGELOG.md` at project root:

```markdown
# Changelog

## [1.1.0] - 2026-06-04

### ✨ Features
- Complete TypeScript refactoring with full type safety
- Modular architecture with 5 specialized modules
- Comprehensive test suite (28 tests)
- GitHub Actions CI/CD pipeline

### 🚀 Performance
- Optimized bundle: 13.9 KB (down from ~20 KB)
- Better memory usage with pure functions
- Improved maintainability

### 🔧 Improvements
- Full type safety with strict TypeScript mode
- Clean separation of concerns
- Better error handling
- JSDoc documentation on all functions

### 📚 Developer Experience
- Full CI/CD with GitHub Actions
- Automated testing on every commit
- Source maps for debugging
- Jest testing framework

### 🐛 Bug Fixes
(if any)

### ⚠️ Breaking Changes
(if any)

### 📦 Files Changed
- Complete src/ refactoring
- New build system (esbuild)
- Added comprehensive tests
- Added GitHub Actions workflows

---

## [1.0.0] - 2026-05-15

### ✨ Initial Release
- Basic Gregorian to Shamsi date conversion
- Multiple date pair support
- Automatic date conversion on file modification
- Customizable date format
- Settings UI for date pair management

See full history below...
```

---

## ✅ Testing & Validation

### Step 2: Run Complete Test Suite

```bash
# Run all tests
npm test

# Expected output:
# ✅ 28 tests passed

# Lint code
npm run lint

# Build project
npm run build

# Expected output:
# dist\main.js  13.7kb
# Done in 29ms
```

### Step 3: Local Testing in Obsidian

```bash
# Create test directory (if not exists)
mkdir -p ~/.obsidian/plugins/shamsi-date-converter-test

# Copy built files
cp dist/main.js manifest.json styles.css ~/.obsidian/plugins/shamsi-date-converter-test/

# OR on Linux/Mac
cp dist/main.js manifest.json styles.css ~/Library/Application\ Support/obsidian/plugins/shamsi-date-converter-test/
```

**Manual Testing Checklist:**
- [ ] Restart Obsidian
- [ ] Plugin appears in settings
- [ ] Enable plugin
- [ ] Create test note with Gregorian dates
- [ ] Verify Shamsi dates auto-convert
- [ ] Test manual conversion command
- [ ] Test settings UI - add/edit/delete date pairs
- [ ] Test date format options
- [ ] Toggle auto-convert setting
- [ ] Verify no console errors (DevTools: Cmd/Ctrl + Shift + I)

---

## 🔄 Git Commit & Release

### Step 4: Stage and Commit Changes

```bash
# Add files to staging
git add manifest.json package.json CHANGELOG.md

# Commit with meaningful message
git commit -m "chore: release v1.1.0 - TypeScript refactoring"

# OR if there are other changes
git add -A
git commit -m "chore: release v1.1.0

- Complete TypeScript refactoring
- Added comprehensive test suite (28 tests)
- GitHub Actions CI/CD pipeline
- Improved code maintainability
- See CHANGELOG.md for full details"

# Push to main branch
git push origin main
```

### Step 5: Create Release Tag (AUTO-TRIGGERS CI/CD)

```bash
# Create annotated tag with release notes
git tag -a v1.1.0 -m "Release v1.1.0 - TypeScript refactoring & full CI/CD"

# Push tag to GitHub (THIS TRIGGERS GITHUB ACTIONS)
git push origin v1.1.0
```

⚠️ **IMPORTANT:** Pushing the tag (`git push origin v1.1.0`) automatically triggers the GitHub Actions release workflow!

---

## 🤖 GitHub Actions Automation

When you push the tag, GitHub Actions automatically:

1. ✅ Checks out the code
2. ✅ Verifies tag version matches manifest.json
3. ✅ Installs dependencies
4. ✅ Runs all 28 tests
5. ✅ Builds the project
6. ✅ Creates GitHub Release with:
   - dist/main.js
   - manifest.json
   - styles.css
   - Auto-generated release notes

**What you'll see:**
- GitHub Release page: https://github.com/milad-s5/obsidian-shamsi-date-converter/releases
- Release tagged as: v1.1.0
- Assets attached for download
- Release notes auto-generated from commit history

---

## 📱 Obsidian Community Update

### Automatic Community Update
If your plugin is already published in Obsidian Community Plugins:
1. Users see new version in Community Plugins tab
2. "Update" button becomes available
3. Users click to update to latest version

### If Not Auto-Listed
1. Go to: https://github.com/obsidianmd/obsidian-releases
2. Create a PR adding your plugin info
3. Link to your v1.1.0 release
4. Wait for PR approval

---

## 📊 Quick Reference Commands

### Development
```bash
npm run dev           # Watch mode - auto-rebuild
npm run build         # Production build
npm run lint          # Check code style
npm test              # Run 28 tests
npm test:watch        # Watch mode for tests
```

### Release Process
```bash
# 1. Update files (manifest.json, package.json, CHANGELOG.md)

# 2. Verify everything works
npm test && npm run lint && npm run build

# 3. Test locally (optional)
cp dist/main.js manifest.json styles.css ~/.obsidian/plugins/shamsi-date-converter/

# 4. Commit changes
git add manifest.json package.json CHANGELOG.md
git commit -m "chore: release v1.1.0"
git push origin main

# 5. Tag and release (TRIGGERS CI/CD)
git tag v1.1.0
git push origin v1.1.0

# Done! GitHub Actions handles the rest automatically
```

---

## 🔍 Verify Release Success

After pushing the tag:

1. **Check GitHub Actions:**
   - Go to: https://github.com/milad-s5/obsidian-shamsi-date-converter/actions
   - Should see "Release" workflow running
   - Wait for completion (usually 2-5 minutes)
   - Look for green checkmark ✅

2. **Check Release Page:**
   - Go to: https://github.com/milad-s5/obsidian-shamsi-date-converter/releases
   - Should see v1.1.0 at top
   - Should have 3 files attached:
     - dist/main.js ✅
     - manifest.json ✅
     - styles.css ✅

3. **Check Obsidian Community** (next day):
   - Open Obsidian
   - Community Plugins → Shamsi Date Converter
   - Should show version 1.1.0

---

## 🐛 Troubleshooting

### Release Failed
1. Check GitHub Actions logs: https://github.com/milad-s5/obsidian-shamsi-date-converter/actions
2. Common issues:
   - Tests failed: Run `npm test` locally, fix issues, re-commit
   - Version mismatch: Ensure manifest.json version matches tag (v1.1.0)
   - Build failed: Run `npm run build` locally, fix TypeScript errors

### Delete Failed Tag
```bash
# Delete local tag
git tag -d v1.1.0

# Delete remote tag
git push origin --delete v1.1.0

# Create new tag when ready
git tag v1.1.0
git push origin v1.1.0
```

### Re-Release Same Version (Not Recommended)
```bash
# Only if absolutely necessary
git tag -d v1.1.0
git push origin --delete v1.1.0
# Fix issues
git tag v1.1.0
git push origin v1.1.0
```

---

## 📋 Pre-Release Workflow Summary

```
┌─────────────────────────────────────────────────────────┐
│ 1. UPDATE VERSIONS                                      │
│    • manifest.json: "version": "1.1.0"                 │
│    • package.json: "version": "1.1.0"                  │
│    • CHANGELOG.md: Add new section                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. TEST & BUILD                                         │
│    • npm test      ✅ All 28 tests pass                 │
│    • npm run lint  ✅ No errors                         │
│    • npm run build ✅ 13.9 KB bundle                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. LOCAL TESTING (Optional but Recommended)             │
│    • Copy files to test plugin folder                   │
│    • Restart Obsidian                                   │
│    • Test plugin functionality                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. COMMIT & PUSH                                        │
│    • git add manifest.json package.json CHANGELOG.md    │
│    • git commit -m "chore: release v1.1.0"              │
│    • git push origin main                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. TAG & RELEASE (AUTOMATIC CI/CD)                      │
│    • git tag v1.1.0                                     │
│    • git push origin v1.1.0                             │
│    ➜ GitHub Actions automatically:                      │
│      ✅ Tests run                                       │
│      ✅ Build created                                   │
│      ✅ Release published                               │
│      ✅ Assets attached                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 6. VERIFY & CELEBRATE 🎉                                │
│    • Check: https://github.com/.../releases             │
│    • v1.1.0 published with assets                       │
│    • Next day: Users see update in Obsidian             │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Best Practices

✅ **DO:**
- Test everything locally before releasing
- Write meaningful commit messages
- Update CHANGELOG.md for every release
- Use semantic versioning (major.minor.patch)
- Tag every production release
- Wait for GitHub Actions to complete

❌ **DON'T:**
- Release without running tests
- Mix feature commits with version bumps
- Forget to update version numbers
- Delete or re-create tags unnecessarily
- Release without updating CHANGELOG

---

## 📞 Support

If you forget these steps:
1. Check this file: `RELEASE_GUIDE.md`
2. Look at recent commits: `git log --oneline -10`
3. Check recent tags: `git tag -l | tail -5`
4. Review GitHub Actions: https://github.com/milad-s5/obsidian-shamsi-date-converter/actions

---

**Happy Releasing! 🚀**
