import type * as PptxGenJS  from 'pptxgenjs';
// Types for PptxGenJS TextProps
export type PptxGenJSTextProps =  PptxGenJS.default.TextProps



// Token interface for parsing
interface Token {
  type: 'text' | 'bold' | 'italic' | 'underline' | 'strike' | 'break';
  content: string;
  start: number;
  end: number;
}

/**
 * Convert HTML from Word documents to markdown-like format
 */
export function convertHtmlToMarkdown(html: string): string {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Convert HTML to markdown
  const result = processNode(tempDiv);
  
  // Clean up extra whitespace and normalize line breaks
  return result
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Recursively process HTML nodes and convert to markdown
 */
function processNode(node: Node): string {
  let result = '';
  
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      // Text node - add as is
      const text = child.textContent || '';
      result += text;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element;
      const childContent = processNode(child);
      
      if (!childContent.trim()) continue; // Skip empty elements
      
      switch (element.tagName.toLowerCase()) {
        case 'strong':
        case 'b':
          result += `**${childContent}**`;
          break;
        case 'em':
        case 'i':
          result += `*${childContent}*`;
          break;
        case 'u':
          result += `<u>${childContent}</u>`;
          break;
        case 's':
        case 'strike':
        case 'del':
          result += `~~${childContent}~~`;
          break;
        case 'span':
          // Handle styled spans (common in Word)
          const style = element.getAttribute('style') || '';
          if (style.includes('font-weight: bold') || style.includes('font-weight:bold')) {
            result += `**${childContent}**`;
          } else if (style.includes('font-style: italic') || style.includes('font-style:italic')) {
            result += `*${childContent}*`;
          } else if (style.includes('text-decoration: underline') || style.includes('text-decoration:underline')) {
            result += `<u>${childContent}</u>`;
          } else if (style.includes('text-decoration: line-through') || style.includes('text-decoration:line-through')) {
            result += `~~${childContent}~~`;
          } else {
            result += childContent;
          }
          break;
        case 'p':
        case 'div':
          result += childContent + '\n\n';
          break;
        case 'br':
          result += '\n';
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          result += `**${childContent}**\n\n`;
          break;
        default:
          // For unknown elements, just include the content
          result += childContent;
          break;
      }
    }
  }
  
  return result;
}

/**
 * Convert rich text (Markdown, HTML, etc.) to PptxGenJS-compatible format
 * @param input - Rich text string (supports Markdown and basic HTML)
 * @returns Array of PptxGenJS TextProps
 */
export function convertToPptxRichText(input: string): PptxGenJSTextProps[] {
  if (!input) return [];
  
  // First, handle line breaks
  const lines = input.split(/\r?\n/);
  const result: PptxGenJSTextProps[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '') {
      // Empty line - add break
      result.push({ text: "", options: { breakLine: true } });
      continue;
    }
    
    // Parse the line for formatting
    const lineTokens = parseLine(line);
    result.push(...lineTokens);
    
    // Add line break if not the last line
    if (i < lines.length - 1) {
      result.push({ text: "", options: { breakLine: true } });
    }
  }
  
  return result;
}

/**
 * Parse a single line for rich text formatting
 */
function parseLine(line: string): PptxGenJSTextProps[] {
  const tokens: Token[] = [];
  let pos = 0;
  
  // Regular expressions for different formatting
  const patterns = [
    // Bold: **text** or __text__
    { type: 'bold' as const, regex: /(\*\*|__)(.+?)\1/g },
    // Italic: *text* or _text_ (but not when part of bold)
    { type: 'italic' as const, regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g },
    // Strikethrough: ~~text~~
    { type: 'strike' as const, regex: /~~(.+?)~~/g },
    // Underline: <u>text</u>
    { type: 'underline' as const, regex: /<u>(.+?)<\/u>/gi },
  ];
  
  // Find all formatting tokens
  const allMatches: Array<{ type: Token['type'], match: RegExpMatchArray }> = [];
  
  for (const pattern of patterns) {
    let match;
    pattern.regex.lastIndex = 0; // Reset regex
    while ((match = pattern.regex.exec(line)) !== null) {
      allMatches.push({ type: pattern.type, match });
    }
  }
  
  // Sort matches by position
  allMatches.sort((a, b) => a.match.index! - b.match.index!);
  
  // Process matches and create tokens
  const processedRanges: Array<{ start: number, end: number }> = [];
  
  for (const { type, match } of allMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    
    // Check if this range overlaps with already processed ranges
    const overlaps = processedRanges.some(range => 
      (start >= range.start && start < range.end) || 
      (end > range.start && end <= range.end) ||
      (start <= range.start && end >= range.end)
    );
    
    if (!overlaps) {
      // Extract content based on the pattern type
      let content = '';
      switch (type) {
        case 'bold':
          content = match[2] || ''; // For (**|__)(.+?)\1, content is in group 2
          break;
        case 'italic':
          content = match[1] || match[2] || ''; // For both italic patterns
          break;
        case 'strike':
          content = match[1] || ''; // For ~~(.+?)~~, content is in group 1
          break;
        case 'underline':
          content = match[1] || ''; // For <u>(.+?)</u>, content is in group 1
          break;
      }
      
      if (content) {
        tokens.push({
          type,
          content,
          start,
          end
        });
        processedRanges.push({ start, end });
      }
    }
  }
  
  // Sort tokens by position
  tokens.sort((a, b) => a.start - b.start);
  
  // Convert tokens to PptxGenJS format
  const result: PptxGenJSTextProps[] = [];
  let lastEnd = 0;
  
  for (const token of tokens) {
    // Add any plain text before this token
    if (token.start > lastEnd) {
      const plainText = line.substring(lastEnd, token.start);
      if (plainText) {
        result.push({ text: plainText });
      }
    }
    
    // Add the formatted token
    const options: PptxGenJSTextProps['options'] = {};
    
    switch (token.type) {
      case 'bold':
        options.bold = true;
        break;
      case 'italic':
        options.italic = true;
        break;
      case 'underline':
        options.underline = { style: 'heavy' };
        break;
      case 'strike':
        options.strike = true;
        break;
    }
    
    result.push({
      text: token.content,
      options: Object.keys(options).length > 0 ? options : undefined
    });
    
    lastEnd = token.end;
  }
  
  // Add any remaining plain text
  if (lastEnd < line.length) {
    const remainingText = line.substring(lastEnd);
    if (remainingText) {
      result.push({ text: remainingText });
    }
  }
  
  // If no tokens were found, return the whole line as plain text
  if (result.length === 0 && line) {
    result.push({ text: line });
  }
  
  return result;
}

/**
 * Convert PptxGenJS TextProps array back to a readable format for display
 */
export function formatPptxTextPropsForDisplay(props: PptxGenJSTextProps[]): string {
  return JSON.stringify(props, null, 2);
}

/**
 * Create a sample rich text for testing
 */
export function getSampleRichText(): string {
  return `This is **bold text**, and this is *italic text*.

Here's some ~~strikethrough~~ text and <u>underlined</u> text.

You can combine **bold and *italic* together**.

Multiple lines
with breaks
work too!`;
} 