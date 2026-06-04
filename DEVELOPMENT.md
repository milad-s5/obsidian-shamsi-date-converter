# TypeScript Project Structure

This plugin has been refactored into a clean, modular TypeScript architecture.

## Project Structure

```
src/
├── main.ts                 # Plugin entry point - orchestrates everything
├── DateConverter.ts        # Shamsi/Gregorian date conversion logic
├── PluginSettings.ts       # Settings types and defaults
├── FileProcessor.ts        # Frontmatter parsing and processing
└── SettingsUI.ts           # Settings tab UI components

dist/                        # Built output (generated)
├── main.js                 # Bundled JavaScript output
└── main.d.ts               # TypeScript declarations
```

## Module Responsibilities

### `main.ts`
- Plugin lifecycle (onload, onunload)
- Event registration (file modifications)
- Command registration (manual conversion)
- Delegating to other modules

### `DateConverter.ts`
- Pure date conversion logic (no side effects)
- Gregorian to Shamsi conversion algorithm
- Date parsing and formatting
- Static methods for reusability

### `PluginSettings.ts`
- TypeScript interfaces for type safety
- Default settings configuration
- No logic, only types and constants

### `FileProcessor.ts`
- Reads and parses frontmatter
- Processes date pair mappings
- Generates update instructions
- Returns processed content

### `SettingsUI.ts`
- Obsidian PluginSettingTab implementation
- Form handling for adding/editing date pairs
- User interaction logic

## Building the Project

### Install Dependencies
```bash
npm install
```

### Development Mode (with watch)
```bash
npm run dev
```
Watches for changes and rebuilds automatically.

### Production Build
```bash
npm run build
```
Runs TypeScript type checking and creates optimized bundle.

### Lint Code
```bash
npm run lint
```
Checks code style and issues.

## Key Improvements Over Original

✅ **Type Safety**: Full TypeScript with proper interfaces  
✅ **Modular**: Clear separation of concerns  
✅ **Testable**: Pure functions (DateConverter, FileProcessor)  
✅ **Maintainable**: Well-organized code with JSDoc comments  
✅ **Build Process**: Proper esbuild configuration  
✅ **Clean**: No monolithic single file  

## How to Develop

1. Edit files in `src/`
2. Run `npm run dev` to watch for changes
3. Bundle is automatically generated to `dist/main.js`
4. Restart Obsidian to reload plugin

## Deploying

The compiled `dist/main.js` is what Obsidian loads. The manifest.json must point to this file.
