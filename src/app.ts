import type * as PrismJS from 'prismjs';
import Quill from 'quill';
import {
    convertHtmlToPptxRichText,
    formatPptxTextPropsForDisplay,
    getSampleRichText
} from './converter.js';

// Declare global variables for TypeScript  
declare const Prism: typeof PrismJS;

class RichTextConverterApp {
    private editor: Quill | null = null;
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

    private initializeEditor(): void {
        try {
            this.editor = new Quill('#input-text', {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        ['clean']
                    ]
                },
                placeholder: 'Type your rich text here or paste from Word documents...'
            });

            this.setupEventListeners();
            this.loadSampleText();
        } catch (error) {
            console.error('Failed to initialize QuillJS:', error);
        }
    }

    private setupEventListeners(): void {
        this.convertButton.addEventListener('click', () => this.handleConvert());
        this.clearButton.addEventListener('click', () => this.handleClear());
        this.sampleButton.addEventListener('click', () => this.handleLoadSample());
        this.copyButton.addEventListener('click', () => this.handleCopy());

        // Auto-convert on content change
        if (this.editor) {
            this.editor.on('text-change', () => {
                this.handleConvert();
            });
        }

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
            if (!this.editor) {
                console.error('Editor not found');
                return;
            }

            // Get HTML content from QuillJS 2.0
            const htmlContent = this.editor.root.innerHTML;
            console.log(htmlContent);

            if (!htmlContent.trim() || htmlContent === '<p><br></p>') {
                this.setOutputContent('[]');
                return;
            }

            // Convert HTML directly to PptxGenJS format (optimized for QuillJS)
            const result = convertHtmlToPptxRichText(htmlContent);

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
            this.editor.root.innerHTML = '';
        }
        this.setOutputContent('');
        this.copyButton.disabled = true;
        if (this.editor) {
            this.editor.focus();
        }
    }

    private handleLoadSample(): void {
        if (!this.editor) return;

        // Load sample HTML directly into QuillJS 2.0
        const sampleHtml = getSampleRichText();
        this.editor.root.innerHTML = sampleHtml;
        this.handleConvert();
        this.editor.focus();
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