# Rich Text to PptxGenJS Converter

Convert rich text to PptxGenJS-compatible format using QuillJS editor.

## Features

- ✨ **Rich Text Editor**: Full formatting support with QuillJS 2.0
- 🎨 **Modern UI**: Beautiful dark theme with Nord color scheme
- 📊 **Real-time Conversion**: Instant conversion as you type
- 📋 **Copy to Clipboard**: Easy copying of converted output
- 🚀 **Fast Build System**: Powered by Bun for optimal performance

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Node.js 18+ (for compatibility)

## Installation

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

## Development

### Development with Auto-rebuild

```bash
bun run dev
```

This watches for file changes, automatically rebuilds, and serves at `http://localhost:8000`

### Build for Production

```bash
bun run build
```

Creates optimized production build in the `dist/` directory

### Watch Build

```bash
bun run build:watch
```

Automatically rebuilds when source files change

### Custom Development Server

```bash
bun run start
```

Runs a custom development server with better source map support

## Project Structure

```
rich-to-pptx/
├── src/
│   ├── app.ts          # Main application logic
│   └── converter.ts    # HTML to PptxGenJS converter
├── dist/               # Built files (generated)
├── styles.css          # Application styles
├── index.html          # Main HTML file
├── package.json        # Project configuration
├── bunfig.toml        # Bun configuration
├── tsconfig.json      # TypeScript configuration
└── dev-server.ts      # Custom development server
```

## Build System Features

- **Fast Compilation**: Bun's TypeScript compiler is significantly faster than tsc
- **Bundle Optimization**: Automatic tree-shaking and dead code elimination
- **Source Maps**: Full source map support for debugging
- **Hot Reloading**: Instant updates during development
- **Modern ES Modules**: Native ES module support

## Available Scripts

| Script                | Description                                        |
|-----------------------|----------------------------------------------------|
| `bun run dev`         | Watch mode for builds and start development server |
| `bun run build`       | Build production bundle                            |
| `bun run build:watch` | Watch mode for builds                              |
| `bun run start`       | Start development server                           |

## License

MIT License - see LICENSE file for details 