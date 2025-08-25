/**
 * Convert rich text (Markdown, HTML, etc.) to PptxGenJS-compatible format
 * @param input - Rich text string (supports Markdown and basic HTML)
 * @returns Array of PptxGenJS TextProps
 */
export function convertToPptxRichText(input) {
    if (!input)
        return [];
    // First, handle line breaks
    const lines = input.split(/\r?\n/);
    const result = [];
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
function parseLine(line) {
    const tokens = [];
    let pos = 0;
    // Regular expressions for different formatting
    const patterns = [
        // Bold: **text** or __text__
        { type: 'bold', regex: /(\*\*|__)(.+?)\1/g },
        // Italic: *text* or _text_ (but not when part of bold)
        { type: 'italic', regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g },
        // Strikethrough: ~~text~~
        { type: 'strike', regex: /~~(.+?)~~/g },
        // Underline: <u>text</u>
        { type: 'underline', regex: /<u>(.+?)<\/u>/gi },
    ];
    // Find all formatting tokens
    const allMatches = [];
    for (const pattern of patterns) {
        let match;
        pattern.regex.lastIndex = 0; // Reset regex
        while ((match = pattern.regex.exec(line)) !== null) {
            allMatches.push({ type: pattern.type, match });
        }
    }
    // Sort matches by position
    allMatches.sort((a, b) => a.match.index - b.match.index);
    // Process matches and create tokens
    const processedRanges = [];
    for (const { type, match } of allMatches) {
        const start = match.index;
        const end = start + match[0].length;
        // Check if this range overlaps with already processed ranges
        const overlaps = processedRanges.some(range => (start >= range.start && start < range.end) ||
            (end > range.start && end <= range.end) ||
            (start <= range.start && end >= range.end));
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
    const result = [];
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
        const options = {};
        switch (token.type) {
            case 'bold':
                options.bold = true;
                break;
            case 'italic':
                options.italic = true;
                break;
            case 'underline':
                options.underline = { style: 'single' };
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
export function formatPptxTextPropsForDisplay(props) {
    return JSON.stringify(props, null, 2);
}
/**
 * Create a sample rich text for testing
 */
export function getSampleRichText() {
    return `This is **bold text** and this is *italic text*.

Here's some ~~strikethrough~~ text and <u>underlined</u> text.

You can combine **bold and *italic* together**.

Multiple lines
with breaks
work too!`;
}
//# sourceMappingURL=converter.js.map