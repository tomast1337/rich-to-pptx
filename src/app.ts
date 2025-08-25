import {
    convertToPptxRichText,
    formatPptxTextPropsForDisplay,
    getSampleRichText,
    convertHtmlToMarkdown,
    PptxGenJSTextProps
} from './converter.js';
import type * as PrismJS from 'prismjs';

// Declare global variables for TypeScript  
declare const ClassicEditor: any;
declare const Prism: typeof PrismJS;

class RichTextConverterApp {
    private editor: any;
    private outputElement!: HTMLElement;
    private outputCodeElement!: HTMLElement;
    private convertButton!: HTMLButtonElement;
    private clearButton!: HTMLButtonElement;
    private sampleButton!: HTMLButtonElement;
    private copyButton!: HTMLButtonElement;

    constructor() {
        this.initializeElements();
        this.initializeEditor();
    }

    private initializeElements(): void {
        this.outputElement = document.getElementById('output-text') as HTMLElement;
        this.outputCodeElement = this.outputElement.querySelector('code') as HTMLElement;
        this.convertButton = document.getElementById('convert-btn') as HTMLButtonElement;
        this.clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
        this.sampleButton = document.getElementById('sample-btn') as HTMLButtonElement;
        this.copyButton = document.getElementById('copy-btn') as HTMLButtonElement;

        if (!this.outputElement || !this.outputCodeElement || !this.convertButton ||
            !this.clearButton || !this.sampleButton || !this.copyButton) {
            throw new Error('Required DOM elements not found');
        }
    }

    private async initializeEditor(): Promise<void> {
        try {
            this.editor = await ClassicEditor.create(document.querySelector('#input-text'), {
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'subscript',
                        'superscript',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'link',
                        '|',
                        'undo',
                        'redo'
                    ]
                },
                heading: {
                    options: [
                        {model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph'},
                        {model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
                        {model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
                        {model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3'}
                    ]
                },
                fontSize: {
                    options: [9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]
                },
                fontFamily: {
                    options: [
                        'default',
                        'Arial, Helvetica, sans-serif',
                        'Courier New, Courier, monospace',
                        'Georgia, serif',
                        'Lucida Sans Unicode, Lucida Grande, sans-serif',
                        'Tahoma, Geneva, sans-serif',
                        'Times New Roman, Times, serif',
                        'Trebuchet MS, Helvetica, sans-serif',
                        'Verdana, Geneva, sans-serif'
                    ]
                },
                fontColor: {
                    colors: [
                        {
                            color: 'hsl(0, 0%, 0%)',
                            label: 'Black'
                        },
                        {
                            color: 'hsl(0, 0%, 30%)',
                            label: 'Dim grey'
                        },
                        {
                            color: 'hsl(0, 0%, 60%)',
                            label: 'Grey'
                        },
                        {
                            color: 'hsl(0, 0%, 90%)',
                            label: 'Light grey'
                        },
                        {
                            color: 'hsl(0, 0%, 100%)',
                            label: 'White',
                            hasBorder: true
                        },
                        {
                            color: 'hsl(0, 75%, 60%)',
                            label: 'Red'
                        },
                        {
                            color: 'hsl(30, 75%, 60%)',
                            label: 'Orange'
                        },
                        {
                            color: 'hsl(60, 75%, 60%)',
                            label: 'Yellow'
                        },
                        {
                            color: 'hsl(90, 75%, 60%)',
                            label: 'Light green'
                        },
                        {
                            color: 'hsl(120, 75%, 60%)',
                            label: 'Green'
                        },
                        {
                            color: 'hsl(150, 75%, 60%)',
                            label: 'Aquamarine'
                        },
                        {
                            color: 'hsl(180, 75%, 60%)',
                            label: 'Turquoise'
                        },
                        {
                            color: 'hsl(210, 75%, 60%)',
                            label: 'Light blue'
                        },
                        {
                            color: 'hsl(240, 75%, 60%)',
                            label: 'Blue'
                        },
                        {
                            color: 'hsl(270, 75%, 60%)',
                            label: 'Purple'
                        }
                    ]
                },
                alignment: {
                    options: ['left', 'center', 'right', 'justify']
                }
            });

            this.setupEventListeners();
            this.loadSampleText();
        } catch (error) {
            console.error('Failed to initialize CKEditor:', error);
        }
    }

    private setupEventListeners(): void {
        this.convertButton.addEventListener('click', () => this.handleConvert());
        this.clearButton.addEventListener('click', () => this.handleClear());
        this.sampleButton.addEventListener('click', () => this.handleLoadSample());
        this.copyButton.addEventListener('click', () => this.handleCopy());

        // Auto-convert on content change
        this.editor.model.document.on('change:data', () => {
            this.handleConvert();
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.handleConvert();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.handleClear();
                        break;
                }
            }
        });
    }

    private showRichTextDetectedMessage(): void {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.textContent = '✨ Rich text formatting detected and converted!';
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }

    private handleConvert(): void {
        try {
            if (!this.editor) return;

            // Get HTML content from CKEditor
            const htmlContent = this.editor.getData();

            if (!htmlContent.trim()) {
                this.setOutputContent('[]');
                return;
            }

            // Convert HTML to markdown first, then to PptxGenJS format
            // TODO: Enhanced conversion will be completed in next update
            const markdownContent = convertHtmlToMarkdown(htmlContent);
            const result = convertToPptxRichText(markdownContent);

            const formattedOutput = formatPptxTextPropsForDisplay(result);
            this.setOutputContent(formattedOutput);

            // Update button states
            this.copyButton.disabled = false;

        } catch (error) {
            console.error('Conversion error:', error);
            this.setOutputContent(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private setOutputContent(content: string): void {
        this.outputCodeElement.textContent = content;
        // Apply syntax highlighting if it's valid JSON
        if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
            try {
                // Validate JSON first
                JSON.parse(content);
                this.outputCodeElement.className = 'language-json';
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(this.outputCodeElement);
                }
            } catch {
                // Not valid JSON, just display as text
                this.outputCodeElement.className = 'language-none';
            }
        } else {
            this.outputCodeElement.className = 'language-none';
        }
    }

    private getOutputContent(): string {
        return this.outputCodeElement.textContent || '';
    }

    private handleClear(): void {
        if (this.editor) {
            this.editor.setData('');
        }
        this.setOutputContent('');
        this.copyButton.disabled = true;
        if (this.editor) {
            this.editor.editing.view.focus();
        }
    }

    private handleLoadSample(): void {
        if (!this.editor) return;

        // Convert sample markdown to HTML for CKEditor
        const sampleText = getSampleRichText();
        const sampleHtml = this.convertMarkdownToHtml(sampleText);
        this.editor.setData(sampleHtml);
        this.handleConvert();
        this.editor.editing.view.focus();
    }

    private convertMarkdownToHtml(markdown: string): string {
        return markdown
            // Convert bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<strong>$1</strong>')
            // Convert italic
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/_([^_]+)_/g, '<em>$1</em>')
            // Convert strikethrough
            .replace(/~~(.*?)~~/g, '<s>$1</s>')
            // Convert underline (keep as is since it's already HTML)
            // Convert line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Wrap in paragraphs
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            // Clean up empty paragraphs
            .replace(/<p><\/p>/g, '<p>&nbsp;</p>');
    }

    private async handleCopy(): Promise<void> {
        try {
            const content = this.getOutputContent();
            await navigator.clipboard.writeText(content);

            // Visual feedback
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = 'Copied!';
            this.copyButton.classList.add('copied');

            setTimeout(() => {
                this.copyButton.textContent = originalText;
                this.copyButton.classList.remove('copied');
            }, 2000);

        } catch (error) {
            console.error('Failed to copy:', error);
            // Fallback: create a temporary textarea for selection
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = this.getOutputContent();
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
        }
    }

    private loadSampleText(): void {
        // Load sample text on startup
        this.handleLoadSample();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RichTextConverterApp();
}); 