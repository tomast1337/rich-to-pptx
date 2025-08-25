import { convertToPptxRichText, formatPptxTextPropsForDisplay, getSampleRichText } from './converter.js';
class RichTextConverterApp {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadSampleText();
    }
    initializeElements() {
        this.inputTextarea = document.getElementById('input-text');
        this.outputTextarea = document.getElementById('output-text');
        this.convertButton = document.getElementById('convert-btn');
        this.clearButton = document.getElementById('clear-btn');
        this.sampleButton = document.getElementById('sample-btn');
        this.copyButton = document.getElementById('copy-btn');
        if (!this.inputTextarea || !this.outputTextarea || !this.convertButton ||
            !this.clearButton || !this.sampleButton || !this.copyButton) {
            throw new Error('Required DOM elements not found');
        }
    }
    setupEventListeners() {
        this.convertButton.addEventListener('click', () => this.handleConvert());
        this.clearButton.addEventListener('click', () => this.handleClear());
        this.sampleButton.addEventListener('click', () => this.handleLoadSample());
        this.copyButton.addEventListener('click', () => this.handleCopy());
        // Auto-convert on input change
        this.inputTextarea.addEventListener('input', () => this.handleConvert());
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
    handleConvert() {
        try {
            const inputText = this.inputTextarea.value;
            if (!inputText.trim()) {
                this.outputTextarea.value = '[]';
                return;
            }
            const result = convertToPptxRichText(inputText);
            const formattedOutput = formatPptxTextPropsForDisplay(result);
            this.outputTextarea.value = formattedOutput;
            // Update button states
            this.copyButton.disabled = false;
        }
        catch (error) {
            console.error('Conversion error:', error);
            this.outputTextarea.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
    handleClear() {
        this.inputTextarea.value = '';
        this.outputTextarea.value = '';
        this.copyButton.disabled = true;
        this.inputTextarea.focus();
    }
    handleLoadSample() {
        this.inputTextarea.value = getSampleRichText();
        this.handleConvert();
        this.inputTextarea.focus();
    }
    async handleCopy() {
        try {
            await navigator.clipboard.writeText(this.outputTextarea.value);
            // Visual feedback
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = 'Copied!';
            this.copyButton.classList.add('copied');
            setTimeout(() => {
                this.copyButton.textContent = originalText;
                this.copyButton.classList.remove('copied');
            }, 2000);
        }
        catch (error) {
            console.error('Failed to copy:', error);
            // Fallback: select the text
            this.outputTextarea.select();
            this.outputTextarea.setSelectionRange(0, 99999);
        }
    }
    loadSampleText() {
        // Load sample text on startup
        this.handleLoadSample();
    }
}
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RichTextConverterApp();
});
//# sourceMappingURL=app.js.map