export interface PptxGenJSTextProps {
    text: string;
    options?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean | {
            style?: 'single' | 'double' | 'heavy' | 'dotted' | 'dashed' | 'wavy';
        };
        strike?: boolean;
        color?: string;
        fontSize?: number;
        fontFace?: string;
        breakLine?: boolean;
    };
}
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