import { 
  convertToPptxRichText, 
  formatPptxTextPropsForDisplay, 
  getSampleRichText,
  convertHtmlToMarkdown,
  PptxGenJSTextProps 
} from './converter.js';

// Declare CKEditor types for TypeScript
declare const ClassicEditor: any;

class RichTextConverterApp {
  private editor: any;
  private outputTextarea!: HTMLTextAreaElement;
  private convertButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  private sampleButton!: HTMLButtonElement;
  private copyButton!: HTMLButtonElement;

  constructor() {
    this.initializeElements();
    this.initializeEditor();
  }

  private initializeElements(): void {
    this.outputTextarea = document.getElementById('output-text') as HTMLTextAreaElement;
    this.convertButton = document.getElementById('convert-btn') as HTMLButtonElement;
    this.clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
    this.sampleButton = document.getElementById('sample-btn') as HTMLButtonElement;
    this.copyButton = document.getElementById('copy-btn') as HTMLButtonElement;

    if (!this.outputTextarea || !this.convertButton || 
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
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'undo',
            'redo'
          ]
        },
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
          ]
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
        this.outputTextarea.value = '[]';
        return;
      }

      // Convert HTML to markdown first, then to PptxGenJS format
      const markdownContent = convertHtmlToMarkdown(htmlContent);
      const result = convertToPptxRichText(markdownContent);
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
    if (this.editor) {
      this.editor.setData('');
    }
    this.outputTextarea.value = '';
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