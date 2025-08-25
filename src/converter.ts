import type * as PptxGenJS from 'pptxgenjs';
// Types for PptxGenJS TextProps
export type PptxGenJSTextProps = PptxGenJS.default.TextProps

// Removed markdown support - now only supports rich text (HTML from CKEditor)

/**
 * Convert PptxGenJS TextProps array to a readable JSON format for display
 */
export function formatPptxTextPropsForDisplay(props: PptxGenJSTextProps[]): string {
    return JSON.stringify(props, null, 2);
}

/**
 * Create a sample rich text for testing (HTML format for CKEditor)
 */
export function getSampleRichText(): string {
    return `<p>This is a sample text that demonstrates rich text formatting.</p>

<p>You can use <strong>bold text</strong>, <em>italic text</em>, <u>underlined text</u>, and <s>strikethrough text</s>.</p>

<p>Bullet lists work great with CKEditor:</p>
<ul>
    <li>First bullet point</li>
    <li>Second bullet point with <strong>formatting</strong>
        <ul>
            <li>Nested bullet (indented)</li>
            <li>Another nested item with <em>italic text</em>
                <ul>
                    <li>Deeply nested bullet</li>
                </ul>
            </li>
        </ul>
    </li>
    <li>Back to main level</li>
</ul>

<p>Numbered lists:</p>
<ol>
    <li>First numbered item</li>
    <li>Second numbered item with <strong>formatting</strong>
        <ol>
            <li>Nested numbered item</li>
            <li>Another nested item with <u>underline</u></li>
        </ol>
    </li>
    <li>Back to main numbering</li>
</ol>

<p>Regular paragraphs work with proper spacing and formatting.</p>`;
} 

/**
 * Convert HTML directly to PptxGenJS-compatible format (optimized for CKEditor)
 * @param html - HTML string from CKEditor
 * @returns Array of PptxGenJS TextProps
 */
export function convertHtmlToPptxRichText(html: string): PptxGenJSTextProps[] {
    if (!html) return [];

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const result: PptxGenJSTextProps[] = [];
    processHtmlNode(tempDiv, result, 0);

    return result;
}

/**
 * Process HTML nodes and convert directly to PptxGenJS format
 */
function processHtmlNode(
    node: Node, 
    result: PptxGenJSTextProps[], 
    indentLevel: number = 0,
    inheritedOptions: Partial<PptxGenJSTextProps['options']> = {}
): void {
    for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent || '';
            if (text.trim()) {
                const options = { ...inheritedOptions };
                if (indentLevel > 0 && !options.bullet) {
                    options.indentLevel = indentLevel;
                }
                
                result.push({
                    text: text,
                    options: Object.keys(options).length > 0 ? options : undefined
                });
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as Element;
            const tagName = element.tagName.toLowerCase();
            
            // Create new options based on current element
            const newOptions = { ...inheritedOptions };
            let addLineBreak = false;
            let isList = false;
            
            switch (tagName) {
                case 'strong':
                case 'b':
                    newOptions.bold = true;
                    break;
                    
                case 'em':
                case 'i':
                    newOptions.italic = true;
                    break;
                    
                case 'u':
                    newOptions.underline = { style: 'heavy' };
                    break;
                    
                case 's':
                case 'strike':
                case 'del':
                    newOptions.strike = true;
                    break;
                    
                case 'span':
                    // Handle CKEditor styled spans
                    const style = element.getAttribute('style') || '';
                    if (style.includes('font-weight: bold') || style.includes('font-weight:bold')) {
                        newOptions.bold = true;
                    }
                    if (style.includes('font-style: italic') || style.includes('font-style:italic')) {
                        newOptions.italic = true;
                    }
                    if (style.includes('text-decoration: underline') || style.includes('text-decoration:underline')) {
                        newOptions.underline = { style: 'heavy' };
                    }
                    if (style.includes('text-decoration: line-through') || style.includes('text-decoration:line-through')) {
                        newOptions.strike = true;
                    }
                    break;
                    
                case 'p':
                    // Paragraph - add content and line break
                    processHtmlNode(child, result, indentLevel, newOptions);
                    if (result.length > 0) {
                        // Add newline to the last text element or create new one
                        const lastItem = result[result.length - 1];
                        if (lastItem && !lastItem.options?.bullet) {
                            lastItem.text += '\n';
                        } else {
                            result.push({ text: '\n' });
                        }
                    }
                    continue;
                    
                case 'br':
                    // Add newline to the last text element or create new one
                    if (result.length > 0) {
                        const lastItem = result[result.length - 1];
                        if (lastItem && !lastItem.options?.bullet) {
                            lastItem.text += '\n';
                        } else {
                            result.push({ text: '\n' });
                        }
                    } else {
                        result.push({ text: '\n' });
                    }
                    continue;
                    
                case 'ul':
                    // Unordered list
                    processListElement(element, result, indentLevel, false);
                    continue;
                    
                case 'ol':
                    // Ordered list
                    processListElement(element, result, indentLevel, true);
                    continue;
                    
                case 'li':
                    // List item - this should be handled by processListElement
                    // But if encountered directly, treat as indented content
                    newOptions.indentLevel = indentLevel;
                    break;
                    
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    newOptions.bold = true;
                    // Add paragraph spacing after headings
                    newOptions.paraSpaceAfter = 12;
                    break;
            }
            
            // Process child nodes with inherited options
            if (!isList) {
                processHtmlNode(child, result, indentLevel, newOptions);
            }
        }
    }
}

/**
 * Process HTML list elements (ul/ol) and their list items
 */
function processListElement(
    listElement: Element, 
    result: PptxGenJSTextProps[], 
    indentLevel: number, 
    isNumbered: boolean
): void {
    let itemNumber = 1;
    
    for (const child of Array.from(listElement.children)) {
        if (child.tagName.toLowerCase() === 'li') {
            // Create bullet options
            const bulletOptions: PptxGenJSTextProps['options'] = {
                bullet: {
                    type: isNumbered ? 'number' : 'bullet'
                },
                indentLevel: indentLevel,
                paraSpaceAfter: 6
            };
            
            if (isNumbered && itemNumber > 1) {
                // For numbered lists, we don't need to set numberStartAt for each item
                // PptxGenJS handles the numbering automatically
            }
            
            // Process the list item content
            const itemResult: PptxGenJSTextProps[] = [];
            processHtmlNode(child, itemResult, indentLevel + 1, {});
            
            // Apply bullet options to the first text element of each list item
            if (itemResult.length > 0) {
                if (!itemResult[0].options) {
                    itemResult[0].options = {};
                }
                Object.assign(itemResult[0].options, bulletOptions);
                
                // Add all processed item content to result
                result.push(...itemResult);
                
                // Add line break after each list item except the last one
                const isLastItem = child === listElement.children[listElement.children.length - 1];
                if (!isLastItem) {
                    // Add newline to the last text element or create new one
                    const lastItem = result[result.length - 1];
                    if (lastItem && !lastItem.options?.bullet) {
                        lastItem.text += '\n';
                    } else {
                        result.push({ text: '\n' });
                    }
                }
            }
            
            itemNumber++;
        }
    }
    
    // Add extra line break after the entire list
    if (result.length > 0) {
        const lastItem = result[result.length - 1];
        if (lastItem && !lastItem.options?.bullet) {
            lastItem.text += '\n';
        } else {
            result.push({ text: '\n' });
        }
    }
} 