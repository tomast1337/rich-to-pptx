import type * as PptxGenJS from 'pptxgenjs';
// Types for PptxGenJS TextProps
export type PptxGenJSTextProps = PptxGenJS.default.TextProps

// Supports rich text conversion from QuillJS HTML output

/**
 * Convert PptxGenJS TextProps array to a readable JSON format for display
 */
export function formatPptxTextPropsForDisplay(props: PptxGenJSTextProps[]): string {
    return JSON.stringify(props, null, 2);
}

/**
 * Create a sample rich text for testing (HTML format for QuillJS)
 */
export function getSampleRichText(): string {
    return `<p><strong>Super example, btw, this text has font size 12</strong><p class=ql-align-justify><span>This example tries to have an example of a better thing that we should support, from </span><strong>bold text</strong><span> to </span><em>italic text</em><span>, </span><u>underlined</u><span> text, and strikethrough text. This whole paragraph is supposed to be justified, so I’m trying to type as much as possible. </span><strong>HERE IS AN EXAMPLE OF ALL-CAPS TEXT</strong><span>. This text has a font size of 10. To truly test the capabilities of our text rendering engine, </span><strong><em>we must include a diverse and comprehensive set of stylistic variations. </em></strong><span>This includes not only basic formatting but also mixed styles like </span><strong><em>bold and italic</em></strong><span> or even</span><u> underline and strikethrough </u><span>used together. Furthermore, we should handle different font sizes gracefully. THIS SENTENCE IS IN ALL CAPS WITH A LARGER FONT, while this one returns to a standard size. The ultimate goal is to ensure that justified alignment works flawlessly, wrapping text evenly across the full width of the container without disrupting the applied styles. This requires a robust parser that can handle nested and sequential formatting commands without failure. Let's add more text to ensure the justification is clearly visible. The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How razorback-jumping frogs can level six piqued gymnasts</span><p><span>With this program, we hope to solve:</span><ol><li data-list=ordered><span class=ql-ui contenteditable=false></span><strong>Parse the rich text</strong><span>: Correctly identify all the different formatting styles applied to various text segments.</span><li data-list=ordered><span class=ql-ui contenteditable=false></span><strong>Map the styles:</strong><span> Translate each discovered style into the corresponding properties understood by the pptxgenjs library.</span><li data-list=ordered><span class=ql-ui contenteditable=false></span><strong>Generate PowerPoint content:</strong><span> Use the library to create a slide (PptxGenJS.Slide) and add a text object (slide.addText()) that accurately recreates the original formatting.</span></ol><p class=ql-align-center><br><p class=ql-align-center><span>This is an example of multiple languages, and centered text:</span><ol><li data-list=bullet><span class=ql-ui contenteditable=false></span><span>Obuoliai Agurkai بطاطا تفاح Огурцы Помидоры 배추 시금치 白菜 菠菜</span><li data-list=bullet><span class=ql-ui contenteditable=false></span><span>Duona Ryžiai أرز معكرونة Хлеб Соль 쌀 국수 米 面条</span><li data-list=bullet><span class=ql-ui contenteditable=false></span><span>Pienas Kiauliena لحم دجاج Молоко Сыр 달걀 두부 鸡蛋 豆腐</span><li data-list=bullet><span class=ql-ui contenteditable=false></span><span>Arbata Druska قهوة شاي Перец Шоколад 고추장 초콜릿 酱油 巧克力</span><li data-list=bullet><span class=ql-ui contenteditable=false></span><br></ol><p><span>I have no Idea what is written below, I just hope that it isn't something bad.</span><p><span>بالتأكيد، إليك فقرة كاملة باللغة العربية:</span><p><span>يَسْعَى الْعُلَمَاءُ دَائِمًا لِفَهْمِ أَسْرَارِ الْكَوْنِ وَكَشْفِ غُمُوضِهِ، مُسْتَخْدِمِينَ فِي ذَلِكَ أَدَقَّ الْأَجْهِزَةِ وَأَطْوَرَهَا. فَمِنْ دِرَاسَةِ الْجُسَيْمَاتِ الدَّقِيقَةِ جِدًّا إِلَى مُلَاحَظَةِ الْمَجَرَّاتِ الْبَعِيدَةِ جِدًّا، تُظْهِرُ الْبَشَرِيَّةُ شَغَفَهَا الْأَزَلِيَّ بِالْمَعْرِفَةِ. وَرُبَّمَا سَتَكْشِفُ لَنَا هَذِهِ الرِّحْلَةُ الْعِلْمِيَّةُ يَوْمًا مَا عَنْ أَجْوِبَةٍ لِأَعْظَمِ الْأَسْئِلَةِ الْوُجُودِيَّةِ الَّتِي حَيَّرَتِ الْعُقُولَ عَلَى مَرِّ الْعُصُور.</span><p><strong>好</strong><span>的，</span><strong>这</strong><span>是一</span><strong>段</strong><span>关</span><strong>于</strong><span>左</span><strong>对</strong><span>齐</span><strong>文</strong><span>本</span><strong>的</strong><span>中</span><strong>文</strong><span>段</span><strong>落</strong><span>，并</span><strong>设</strong><span>置</span><strong>为</strong><span>左</span><strong>对</strong><span>齐。</span><p><br><p><span>左对齐文本是一种最常见的段落对齐方式。在这种格式下，</span><strong><em><u>段落的每一行都从同一个左侧起始位置开始</u></em></strong><span>，但结束位置则根据每行字数的多少而有所不同，</span><em><u>因此右侧边缘会呈现参差不齐的自然状态</u></em><span>。这种排版方式显得自然而随意，易于阅读，并且不会像两端对齐那样产生单词或字符间不均匀的间距。它被广泛用于书籍、文章和网页等各种印刷和数字媒体中，</span><strong>为读者提供舒适流畅的阅读体验</strong><span>。</span>`;
} 

/**
 * Convert HTML directly to PptxGenJS-compatible format (optimized for QuillJS)
 * @param html - HTML string from QuillJS
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
    // Handle QuillJS alignment at paragraph level
    if (node instanceof Element && node.classList) {
        if (node.classList.contains('ql-align-justify')) {
            inheritedOptions.align = 'justify';
        } else if (node.classList.contains('ql-align-center')) {
            inheritedOptions.align = 'center';
        } else if (node.classList.contains('ql-align-right')) {
            inheritedOptions.align = 'right';
        }
    }
    for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent || '';
            if (text.trim()) {
                const options = { ...inheritedOptions };
                if (indentLevel > 0 && !options.bullet) {
                    options.indentLevel = indentLevel;
                }
                
                // Set default font that supports multi-language text
                if (!options.fontFace) {
                    options.fontFace = 'Arial Unicode MS';
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
                    // Handle QuillJS styled spans
                    const style = element.getAttribute('style') || '';
                    const className = element.getAttribute('class') || '';
                    
                    // Handle font weight
                    if (style.includes('font-weight: bold') || style.includes('font-weight:bold')) {
                        newOptions.bold = true;
                    }
                    
                    // Handle font style
                    if (style.includes('font-style: italic') || style.includes('font-style:italic')) {
                        newOptions.italic = true;
                    }
                    
                    // Handle text decoration
                    if (style.includes('text-decoration: underline') || style.includes('text-decoration:underline')) {
                        newOptions.underline = { style: 'heavy' };
                    }
                    if (style.includes('text-decoration: line-through') || style.includes('text-decoration:line-through')) {
                        newOptions.strike = true;
                    }
                    
                    // Handle font size
                    const fontSizeMatch = style.match(/font-size:\s*(\d+)pt/);
                    if (fontSizeMatch) {
                        newOptions.fontSize = parseInt(fontSizeMatch[1]);
                    }
                    
                    // Handle QuillJS UI elements
                    if (className.includes('ql-ui')) {
                        // Skip QuillJS UI elements
                        continue;
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
                case 'ol':
                    // Handle both ordered and unordered lists
                    const isOrdered = tagName === 'ol';
                    processListElement(element, result, indentLevel, isOrdered);
                    continue;
                    
                case 'li':
                    // Handle QuillJS list items with data-list attribute
                    const listType = element.getAttribute('data-list');
                    if (listType) {
                        newOptions.bullet = {
                            type: listType === 'ordered' ? 'number' : 'bullet'
                        };
                        newOptions.indentLevel = indentLevel;
                    } else {
                        // Fallback to indentation if no list type
                        newOptions.indentLevel = indentLevel;
                    }
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