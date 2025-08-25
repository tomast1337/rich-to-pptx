import type * as PptxGenJS from 'pptxgenjs';
export type PptxGenJSTextProps = PptxGenJS.default.TextProps;
/**
 * Convert PptxGenJS TextProps array to a readable JSON format for display
 */
export declare function formatPptxTextPropsForDisplay(props: PptxGenJSTextProps[]): string;
/**
 * Create a sample rich text for testing (HTML format for CKEditor)
 */
export declare function getSampleRichText(): string;
/**
 * Convert HTML directly to PptxGenJS-compatible format (optimized for CKEditor)
 * @param html - HTML string from CKEditor
 * @returns Array of PptxGenJS TextProps
 */
export declare function convertHtmlToPptxRichText(html: string): PptxGenJSTextProps[];
//# sourceMappingURL=converter.d.ts.map