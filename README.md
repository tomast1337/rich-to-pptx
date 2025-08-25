# Rich Text to PptxGenJS Converter

A simple web application that converts rich text (Markdown, HTML) into the format required by [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) for rich text arrays.

## Features

- ✅ **Markdown Support**: `**bold**`, `*italic*`, `~~strikethrough~~`
- ✅ **HTML Support**: `<u>underline</u>` tags
- ✅ **Word Document Paste**: Automatically converts HTML formatting when pasting from Word
- ✅ **Line Breaks**: Automatic handling of newlines and empty lines
- ✅ **Real-time Conversion**: Auto-converts as you type
- ✅ **Copy to Clipboard**: One-click copying of output
- ✅ **Sample Text**: Load example text to test features
- ✅ **Keyboard Shortcuts**: `Ctrl+Enter` to convert, `Ctrl+K` to clear
- ✅ **Responsive Design**: Works on desktop and mobile

## Supported Rich Text Formats

| Format | Input | Output |
|--------|-------|--------|
| Bold | `**text**` or `__text__` | `{ text: "text", options: { bold: true } }` |
| Italic | `*text*` or `_text_` | `{ text: "text", options: { italic: true } }` |
| Underline | `<u>text</u>` | `{ text: "text", options: { underline: { style: 'single' } } }` |
| Strikethrough | `~~text~~` | `{ text: "text", options: { strike: true } }` |
| Line Break | Empty line | `{ text: "", options: { breakLine: true } }` |

### Word Document Support

When pasting from Word documents, the following HTML tags and styles are automatically converted:

| HTML Format | Converted To | Notes |
|-------------|--------------|-------|
| `<strong>`, `<b>` | `**text**` | Bold formatting |
| `<em>`, `<i>` | `*text*` | Italic formatting |
| `<u>` | `<u>text</u>` | Underline formatting |
| `<s>`, `<strike>`, `<del>` | `~~text~~` | Strikethrough formatting |
| `<span style="font-weight: bold">` | `**text**` | Inline bold styles |
| `<span style="font-style: italic">` | `*text*` | Inline italic styles |
| `<span style="text-decoration: underline">` | `<u>text</u>` | Inline underline styles |
| `<span style="text-decoration: line-through">` | `~~text~~` | Inline strikethrough styles |
| `<p>`, `<div>` | Line breaks | Paragraph formatting |
| `<h1>` to `<h6>` | `**text**` | Headers converted to bold |

## Quick Start

### Option 1: Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the TypeScript**:
   ```bash
   npm run build
   ```

3. **Serve the application**:
   ```bash
   npm run serve
   ```

4. **Open your browser** to `http://localhost:8000`

### Option 2: Direct Usage (No Build Required)

If you just want to use the converter without building:

1. Open `index.html` directly in your browser
2. The TypeScript files will need to be compiled first using `npm run build`

## Usage

### Web Interface

1. **Input**: Enter your rich text in the left textarea or paste from Word documents
2. **Paste from Word**: Copy formatted text from Word and paste directly - formatting will be preserved!
3. **Output**: The converted PptxGenJS format appears on the right
4. **Copy**: Click "Copy to Clipboard" to copy the output
5. **Sample**: Click "Load Sample" to see example usage

### Using with PptxGenJS

```javascript
// Copy the output from the converter and use it like this:
const richTextArray = [
  { text: "Bold", options: { bold: true } },
  { text: ", " },
  { text: "underline", options: { underline: { style: 'single' } } },
  { text: "", options: { breakLine: true } },
  { text: "broken line." }
];

// Add to your PptxGenJS slide
slide.addText(richTextArray, {
    x: 1, y: 1, w: 8, h: 4
});
```

### Programmatic Usage

You can also use the converter function directly in your TypeScript/JavaScript code:

```typescript
import { convertToPptxRichText } from './src/converter.js';

const richText = "This is **bold** and *italic* text.";
const pptxFormat = convertToPptxRichText(richText);
console.log(pptxFormat);
```

## API Reference

### `convertToPptxRichText(input: string): PptxGenJSTextProps[]`

Converts rich text to PptxGenJS format.

**Parameters:**
- `input` (string): Rich text string with Markdown or HTML formatting

**Returns:**
- Array of `PptxGenJSTextProps` objects ready for use with PptxGenJS

**Example:**
```typescript
const input = "**Bold** and *italic* text";
const output = convertToPptxRichText(input);
// Returns: [
//   { text: "Bold", options: { bold: true } },
//   { text: " and " },
//   { text: "italic", options: { italic: true } },
//   { text: " text" }
// ]
```

## Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode compilation
- `npm run serve` - Serve the application on localhost:8000

## Browser Support

- Modern browsers with ES2020 support
- Chrome 80+
- Firefox 72+
- Safari 13.1+
- Edge 80+

## Project Structure

```
rich-to-pptx/
├── src/
│   ├── converter.ts    # Core conversion logic
│   └── app.ts         # Web interface logic
├── dist/              # Compiled JavaScript (generated)
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) - The PowerPoint generation library this converter supports
- Built with TypeScript for type safety and modern JavaScript features 