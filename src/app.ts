import type * as PrismJS from 'prismjs';
import Toastify from "toastify-js";
import Quill from 'quill';
import {
    convertHtmlToPptxRichText,
    formatPptxTextPropsForDisplay,
    getSampleRichText
} from './converter.js';
import { objectToString } from './objectToString.js';
import * as prettier from "prettier";

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
        Toastify({
            text: 'Welcome to the Rich Text to PptxGenJS Converter',
            duration: 3000,
            destination: 'https://github.com/tomast1337/rich-to-pptx',
            newWindow: true,
            close: true,
            gravity: 'top',
            position: 'right',
            style: {
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)',
            },
            onClick: () => {
                window.open('https://github.com/tomast1337/rich-to-pptx', '_blank');
            }
        }).showToast();
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
                        ['bold', 'italic', 'underline', 'strike'],
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'align': []}],
                        ['link'],
                        ['clean']
                    ]
                },
                placeholder: 'Type your rich text here or paste from Word documents...'
            });

            this.setupEventListeners();
            this.loadSampleText();

            // Initialize button states
            this.copyButton.disabled = true;
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
    }

    private handleConvert(): void {
        try {
            if (!this.editor) {
                console.error('Editor not found');
                return;
            }

            // Get HTML content from QuillJS 2.0
            const htmlContent = this.editor.root.innerHTML;

            if (!htmlContent.trim() || htmlContent === '<p><br></p>') {
                this.setOutputContent('[]');
                return;
            }

            // Convert HTML directly to PptxGenJS format (optimized for QuillJS)
            const result = convertHtmlToPptxRichText(htmlContent);

            prettier.format(objectToString(result),{
                parser: 'typescript',
                bracketSameLine: true,
                printWidth: 120,
                tabWidth: 2,
                useTabs: false,
                singleQuote: false,
                trailingComma: 'all',
                arrowParens: 'always',
                endOfLine: 'lf',
                semi: true,
                bracketSpacing: true,
                quoteProps: 'consistent',
            }).then((formattedOutput) => {
                this.setOutputContent(formattedOutput);
            }).catch((error) => {
                console.error('Failed to format output:', error);
                this.setOutputContent(objectToString(result,4));
            });

            // Update button states
            this.copyButton.disabled = false;

            Toastify({
                text: 'Conversion successful',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: 'var(--background-quaternary)',
                    color: 'var(--text-success)',
                },
            }).showToast();

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
                this.outputCodeElement.className = 'language-javascript';
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
        this.setOutputContent('[]');
        this.copyButton.disabled = true;
        if (this.editor) {
            this.editor.focus();
        }
        Toastify({
            text: 'Cleared',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            style: {
                background: 'var(--background-quaternary)',
                color: 'var(--text-success)',
            },
        }).showToast();
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

            Toastify({
                text: 'Copied to clipboard',
                duration: 3000,
                gravity: 'top',
                position: 'right',
                style: {
                    background: 'var(--background-quaternary)',
                    color: 'var(--text-success)',
                },
                onClick: () => {
                    navigator.clipboard.writeText(content);
                }
            }).showToast();
        } catch (error) {
            console.error('Failed to copy:', error);
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