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

### Start Development Server
```bash
bun run dev
```
This builds the project and starts the development server at `http://localhost:8000`

### Development with Auto-rebuild
```bash
bun run dev:watch
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
bun run dev-server
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

| Script | Description |
|--------|-------------|
| `bun run dev` | Build and start development server |
| `bun run dev:watch` | Watch mode with auto-rebuild and serve |
| `bun run build` | Build production bundle |
| `bun run build:watch` | Watch mode for builds |
| `bun run serve` | Start with Bun's built-in hot reload |
| `bun run start` | Run built application |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- **QuillJS 2.0.3**: Rich text editor
- **PptxGenJS**: PowerPoint generation library
- **PrismJS**: Syntax highlighting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details 