import { 
  convertToPptxRichText, 
  formatPptxTextPropsForDisplay, 
  getSampleRichText,
  PptxGenJSTextProps 
} from './converter.js';

class RichTextConverterApp {
  private inputTextarea!: HTMLTextAreaElement;
  private outputTextarea!: HTMLTextAreaElement;
  private convertButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  private sampleButton!: HTMLButtonElement;
  private copyButton!: HTMLButtonElement;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.loadSampleText();
  }

  private initializeElements(): void {
    this.inputTextarea = document.getElementById('input-text') as HTMLTextAreaElement;
    this.outputTextarea = document.getElementById('output-text') as HTMLTextAreaElement;
    this.convertButton = document.getElementById('convert-btn') as HTMLButtonElement;
    this.clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
    this.sampleButton = document.getElementById('sample-btn') as HTMLButtonElement;
    this.copyButton = document.getElementById('copy-btn') as HTMLButtonElement;

    if (!this.inputTextarea || !this.outputTextarea || !this.convertButton || 
        !this.clearButton || !this.sampleButton || !this.copyButton) {
      throw new Error('Required DOM elements not found');
    }
  }

  private setupEventListeners(): void {
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

  private handleConvert(): void {
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
      
    } catch (error) {
      console.error('Conversion error:', error);
      this.outputTextarea.value = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private handleClear(): void {
    this.inputTextarea.value = '';
    this.outputTextarea.value = '';
    this.copyButton.disabled = true;
    this.inputTextarea.focus();
  }

  private handleLoadSample(): void {
    this.inputTextarea.value = getSampleRichText();
    this.handleConvert();
    this.inputTextarea.focus();
  }

  private async handleCopy(): Promise<void> {
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
      
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback: select the text
      this.outputTextarea.select();
      this.outputTextarea.setSelectionRange(0, 99999);
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