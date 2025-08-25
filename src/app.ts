import type * as PrismJS from 'prismjs';
import Quill from 'quill';
import {
    PptxGenJSTextProps,
    convertHtmlToPptxRichText,
    formatPptxTextPropsForDisplay,
    getSampleRichText
} from './converter.js';
import PptxGenJS from 'pptxgenjs';

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
    private downloadButton!: HTMLButtonElement;
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
        this.downloadButton = document.getElementById('download-btn') as HTMLButtonElement;

        if (!this.outputElement || !this.outputCodeElement || !this.convertButton ||
            !this.clearButton || !this.sampleButton || !this.copyButton || !this.downloadButton) {
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
        
        // Initialize button states
        this.copyButton.disabled = true;
        this.downloadButton.disabled = true;
        } catch (error) {
            console.error('Failed to initialize QuillJS:', error);
        }
    }

    private setupEventListeners(): void {
        this.convertButton.addEventListener('click', () => this.handleConvert());
        this.clearButton.addEventListener('click', () => this.handleClear());
        this.sampleButton.addEventListener('click', () => this.handleLoadSample());
        this.copyButton.addEventListener('click', () => this.handleCopy());
        this.downloadButton.addEventListener('click', () => this.handleDownload());
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
            this.downloadButton.disabled = false;

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
        this.downloadButton.disabled = true;
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

    private async handleDownload(): Promise<void> {
        try {
            const content = this.getOutputContent();
            
            // Validate that we have content to convert
            if (!content.trim()) {
                alert('No content to download. Please convert some text first.');
                return;
            }

            // Parse the JSON content
            let textProps: PptxGenJSTextProps[];
            try {
                textProps = JSON.parse(content) as PptxGenJSTextProps[];
            } catch (error) {
                alert('Invalid content format. Please convert some text first.');
                return;
            }

            // Create the PPTX
            const pptx = new PptxGenJS();
            const slide = pptx.addSlide();
            
            // Add the text to the slide
            slide.addText(textProps, {
                x: 0.1,
                y: 0.1,
                w: 9.8,
                h: 5.4,
                fontSize: 8,
                color: '000000',
                align: 'left',
                valign: 'top',
                fontFace: 'Arial',
            });
            
            // Generate the PPTX as a blob
            const blob = await pptx.write({ outputType: 'blob' });
            
            // Download the file
            const url = URL.createObjectURL(blob as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.pptx';
            a.click();
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Download error:', error);
            alert(`Failed to create PPTX: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RichTextConverterApp();
}); 