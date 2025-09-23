export type PendingOperation = () => void;

export class Editor {
  private textarea: HTMLTextAreaElement;
  private updateContent: (content: string) => void;
  private pendingOperations: PendingOperation[] = [];

  constructor(textarea: HTMLTextAreaElement, updateContent: (content: string) => void) {
    this.textarea = textarea;
    this.updateContent = updateContent;
    this.setupEventListeners();
  }

  private setupEventListeners = () => {
    this.textarea.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      this.handleTabIndentation(e.shiftKey);
    }
  }

  private handleTabIndentation = (isShift: boolean) => {
    const start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const value = this.textarea.value;
    console.log('handleTabIndentation', start, end, value);
    
    if (start === end) {
      // Single cursor position - insert/remove indentation
      if (isShift) {
        // Shift+Tab: remove indentation at cursor position
        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
        
        // Check if there are spaces before cursor that we can remove
        const spacesToRemove = Math.min(2, beforeCursor.length - beforeCursor.trimEnd().length);
        const newValue = beforeCursor.slice(0, -spacesToRemove) + afterCursor;
        const newCursorPos = start - spacesToRemove;
        
        this.setContentAndFocus(newValue, newCursorPos, newCursorPos);
      } else {
        // Tab: insert 2 spaces at cursor position
        const newValue = value.slice(0, start) + "  " + value.slice(end);
        const newCursorPos = start + 2;
        
        this.setContentAndFocus(newValue, newCursorPos, newCursorPos);
      }
    } else {
      // Multiple lines selected - indent/outdent all selected lines
      const lines = value.split('\n');
      const startLine = value.substring(0, start).split('\n').length - 1;
      const endLine = value.substring(0, end).split('\n').length - 1;
      
      let newStart = start;
      let newEnd = end;
      
      const modifiedLines = lines.map((line, index) => {
        if (index >= startLine && index <= endLine) {
          if (isShift) {
            // Shift+Tab: remove indentation from line start
            const trimmed = line.replace(/^ {2}/, '');
            const removedSpaces = line.length - trimmed.length;
            
            // Adjust cursor positions
            if (index === startLine) {
              newStart = Math.max(0, newStart - removedSpaces);
            }
            if (index === endLine) {
              newEnd = Math.max(0, newEnd - removedSpaces);
            }
            
            return trimmed;
          } else {
            // Tab: add indentation to line start
            const indented = "  " + line;
            
            // Adjust cursor positions
            if (index === startLine) {
              newStart += 2;
            }
            if (index === endLine) {
              newEnd += 2;
            }
            
            return indented;
          }
        }
        return line;
      });
      
      const newValue = modifiedLines.join('\n');
      this.setContentAndFocus(newValue, newStart, newEnd);
    }
  }

  private setContentAndFocus = (content: string, selectionStart: number, selectionEnd: number): void => {
    console.log('setContentAndFocus', content, selectionStart, selectionEnd);
    
    // Add cursor operation to pending operations queue
    this.addPendingOperation(() => {
      if (this.textarea && document.contains(this.textarea)) {
        this.textarea.focus();
        this.textarea.setSelectionRange(selectionStart, selectionEnd);
      }
    });
    
    // Update content through React state
    this.updateContent(content);
  }

  // Add a pending operation to the queue
  public addPendingOperation = (operation: PendingOperation): void => {
    this.pendingOperations.push(operation);
  }

  // Consumer method - to be called by React component after re-render
  public consumePendingOperations = (): void => {
    // Execute all pending operations
    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations.shift();
      if (operation) {
        operation();
      }
    }
  }

  // Check if there are pending operations
  public hasPendingOperations = (): boolean => {
    return this.pendingOperations.length > 0;
  }

  public destroy = (): void => {
    this.textarea.removeEventListener('keydown', this.handleKeyDown);
  }
}

