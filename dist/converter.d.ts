import type * as PptxGenJS from 'pptxgenjs';
export type PptxGenJSTextProps = PptxGenJS.default.TextProps;
/**
 * Convert HTML from Word documents to markdown-like format
 */
export declare function convertHtmlToMarkdown(html: string): string;
/**
 * Convert rich text (Markdown, HTML, etc.) to PptxGenJS-compatible format
 * @param input - Rich text string (supports Markdown and basic HTML)
 * @returns Array of PptxGenJS TextProps
 */
export declare function convertToPptxRichText(input: string): PptxGenJSTextProps[];
/**
 * Convert PptxGenJS TextProps array back to a readable format for display
 */
export declare function formatPptxTextPropsForDisplay(props: PptxGenJSTextProps[]): string;
/**
 * Create a sample rich text for testing
 */
export declare function getSampleRichText(): string;
//# sourceMappingURL=converter.d.ts.map