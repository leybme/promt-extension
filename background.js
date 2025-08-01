chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/reloaded');
  
  // First create default prompts if they don't exist, then update menu
  chrome.storage.local.get(["prompts"], (result) => {
    const prompts = result.prompts || [];
    console.log('Current prompts:', prompts.length);
    
    if (prompts.length === 0) {
      console.log('Creating default prompts...');
      // Create default prompts first
      const defaultPrompts = [
        {
          id: 'default-1',
          title: 'Code Review',
          text: 'Please review this code for best practices, potential bugs, and improvements. Focus on:\n- Code readability and maintainability\n- Performance optimizations\n- Security considerations\n- Error handling'
        },
        {
          id: 'default-2',
          title: 'Explain Code',
          text: 'Please explain what this code does in simple terms. Break down:\n- The main purpose and functionality\n- How each part works\n- Any important concepts or patterns used\n- Potential use cases'
        },
        {
          id: 'default-3',
          title: 'Debug Help',
          text: 'I\'m encountering an issue with this code. Please help me:\n- Identify potential causes of the problem\n- Suggest debugging steps\n- Provide possible solutions\n- Explain why the issue might be occurring'
        },
        {
          id: 'default-4',
          title: 'Optimize Performance',
          text: 'Please analyze this code for performance improvements. Consider:\n- Algorithm efficiency\n- Memory usage\n- Database queries optimization\n- Caching opportunities\n- Code structure improvements'
        },
        {
          id: 'default-5',
          title: 'Write Tests',
          text: 'Please help me write comprehensive tests for this code. Include:\n- Unit tests for individual functions\n- Integration tests for component interactions\n- Edge cases and error scenarios\n- Test data and mock examples'
        },
        {
          id: 'default-6',
          title: 'Documentation',
          text: 'Please help me create documentation for this code. Include:\n- Clear description of functionality\n- Parameter and return value explanations\n- Usage examples\n- Any prerequisites or dependencies'
        },
        {
          id: 'default-7',
          title: 'Refactor Code',
          text: 'Please suggest ways to refactor this code to make it:\n- More readable and maintainable\n- Follow better design patterns\n- Reduce complexity\n- Improve modularity and reusability'
        },
        {
          id: 'default-8',
          title: 'Convert to Different Language',
          text: 'Please convert this code to [TARGET_LANGUAGE]. Ensure:\n- Equivalent functionality\n- Language-specific best practices\n- Proper syntax and conventions\n- Comments explaining any differences'
        }
      ];
      
      chrome.storage.local.set({ prompts: defaultPrompts }, () => {
        updatePromptsMenu();
      });
    } else {
      updatePromptsMenu();
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked:', info.menuItemId);
  
  if (info.menuItemId.startsWith("prompt_")) {
    const promptId = info.menuItemId.replace("prompt_", "");
    console.log('Prompt ID:', promptId);
    
    chrome.storage.local.get(["prompts"], (result) => {
      const prompts = result.prompts || [];
      const prompt = prompts.find(p => p.id === promptId);
      console.log('Found prompt:', prompt);
      
      if (prompt) {
        // First try a simple test injection
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            console.log('Script injection successful!');
            return true;
          }
        }).then((results) => {
          console.log('Test injection results:', results);
          
          // If test works, try the actual insertion
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertPromptSimple,
            args: [prompt.text]
          });
          
        }).catch(error => {
          console.error('Script injection failed:', error);
          
          // Try copying to clipboard as fallback
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (text) => {
              navigator.clipboard.writeText(text).then(() => {
                alert('Prompt copied to clipboard: ' + text.substring(0, 50) + '...');
              });
            },
            args: [prompt.text]
          }).catch(clipboardError => {
            console.error('Clipboard fallback also failed:', clipboardError);
          });
        });
      }
    });
  }
});

function insertPromptSimple(text) {
  console.log('insertPromptSimple called with:', text);
  
  // Simple and direct approach
  try {
    // Step 1: Try to find the specific prompt textarea first
    let target = document.getElementById('prompt-textarea');
    console.log('Found prompt-textarea:', target);
    
    // Step 2: If no specific prompt textarea, try active element
    if (!target) {
      target = document.activeElement;
      console.log('Active element:', target);
    }
    
    // Step 3: If no active element, search for common input types
    if (!target || (target.tagName === 'BODY' || target.tagName === 'HTML')) {
      console.log('No active element, searching...');
      
      // Look for visible input elements in order of preference
      const selectors = [
        '#prompt-textarea',
        '.ProseMirror',
        '[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[role="textbox"]'
      ];
      
      for (let selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements for selector: ${selector}`);
        
        for (let element of elements) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            target = element;
            console.log('Selected target:', target);
            break;
          }
        }
        if (target) break;
      }
    }
    
    if (!target) {
      console.log('No target found, copying to clipboard');
      navigator.clipboard.writeText(text);
      alert('No input field found. Text copied to clipboard.');
      return;
    }
    
    // Step 4: Focus and insert based on element type
    target.focus();
    target.click();
    
    console.log('Target details:', {
      tagName: target.tagName,
      id: target.id,
      type: target.type,
      contentEditable: target.contentEditable,
      className: target.className
    });
    
    // Method 1: ProseMirror specific handling
    if (target.classList.contains('ProseMirror') || target.id === 'prompt-textarea') {
      console.log('Inserting into ProseMirror');
      
      // Focus first
      target.focus();
      
      // Try multiple methods for ProseMirror
      let success = false;
      let lastNode = null;
      
      // Method A: Try to append to existing paragraph
      const existingP = target.querySelector('p');
      if (existingP) {
        console.log('Found existing paragraph, appending text');
        
        // If paragraph only contains "i need paste here", replace it
        if (existingP.textContent.trim() === 'i need paste here') {
          existingP.innerHTML = '';
        } else {
          // Add a line break before new content
          existingP.appendChild(document.createElement('br'));
        }
        
        // Add the new text
        const lines = text.split('\n');
        lines.forEach((line, index) => {
          if (index > 0) {
            const br = document.createElement('br');
            existingP.appendChild(br);
          }
          const textNode = document.createTextNode(line);
          existingP.appendChild(textNode);
          lastNode = textNode; // Keep track of the last node
        });
        
        success = true;
      }
      
      // Method B: Create new paragraph if no existing one
      if (!success) {
        console.log('Creating new paragraph');
        const p = document.createElement('p');
        const lines = text.split('\n');
        lines.forEach((line, index) => {
          if (index > 0) {
            const br = document.createElement('br');
            p.appendChild(br);
          }
          const textNode = document.createTextNode(line);
          p.appendChild(textNode);
          lastNode = textNode; // Keep track of the last node
        });
        target.appendChild(p);
        success = true;
      }
      
      // Method C: Try direct innerHTML manipulation
      if (!success) {
        console.log('Using innerHTML method');
        const formattedText = text.replace(/\n/g, '<br>');
        target.innerHTML = `<p>${formattedText}</p>`;
        success = true;
      }
      
      // Move cursor to the end of inserted text
      if (lastNode && window.getSelection) {
        setTimeout(() => {
          try {
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStartAfter(lastNode);
            range.setEndAfter(lastNode);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log('Cursor positioned at end of text');
          } catch (cursorError) {
            console.log('Could not position cursor:', cursorError);
            // Fallback: try to position at end of target element
            try {
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(target);
              range.collapse(false); // Collapse to end
              selection.removeAllRanges();
              selection.addRange(range);
            } catch (fallbackError) {
              console.log('Fallback cursor positioning also failed:', fallbackError);
            }
          }
        }, 50); // Small delay to ensure DOM is updated
      }
      
      // Trigger events
      ['input', 'change', 'keyup', 'keydown'].forEach(eventType => {
        target.dispatchEvent(new Event(eventType, { bubbles: true }));
      });
      
      console.log('ProseMirror insertion complete');
      return;
    }
    
    // Method 2: Regular input/textarea
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      console.log('Inserting into input/textarea');
      
      const start = target.selectionStart || target.value.length;
      const end = target.selectionEnd || target.value.length;
      const currentValue = target.value || '';
      
      const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
      target.value = newValue;
      
      const newCursorPos = start + text.length;
      target.setSelectionRange(newCursorPos, newCursorPos);
      
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
      console.log('Input insertion complete');
      return;
    }
    
    // Method 3: Other contentEditable elements
    if (target.contentEditable === 'true' || target.isContentEditable) {
      console.log('Inserting into contentEditable');
      
      // Try execCommand first
      if (document.execCommand) {
        const htmlText = text.replace(/\n/g, '<br>');
        if (document.execCommand('insertHTML', false, htmlText)) {
          console.log('execCommand insertion successful');
          
          // Position cursor at end
          setTimeout(() => {
            try {
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(target);
              range.collapse(false); // Collapse to end
              selection.removeAllRanges();
              selection.addRange(range);
              console.log('Cursor positioned at end for contentEditable');
            } catch (cursorError) {
              console.log('Could not position cursor in contentEditable:', cursorError);
            }
          }, 50);
          
          return;
        }
      }
      
      // Fallback to direct manipulation
      const lines = text.split('\n');
      let lastNode = null;
      
      lines.forEach((line, index) => {
        if (index > 0) {
          target.appendChild(document.createElement('br'));
        }
        const textNode = document.createTextNode(line);
        target.appendChild(textNode);
        lastNode = textNode;
      });
      
      // Position cursor after last inserted node
      if (lastNode && window.getSelection) {
        setTimeout(() => {
          try {
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStartAfter(lastNode);
            range.setEndAfter(lastNode);
            selection.removeAllRanges();
            selection.addRange(range);
            console.log('Cursor positioned at end of contentEditable text');
          } catch (cursorError) {
            console.log('Could not position cursor after text:', cursorError);
          }
        }, 50);
      }
      
      target.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('ContentEditable insertion complete');
      return;
    }
    
    // Method 4: Last resort - copy to clipboard
    console.log('Unsupported element type, copying to clipboard');
    navigator.clipboard.writeText(text);
    alert('Text copied to clipboard: ' + text.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('Error in insertPromptSimple:', error);
    
    // Final fallback
    try {
      navigator.clipboard.writeText(text);
      alert('Error occurred. Text copied to clipboard.');
    } catch (clipError) {
      console.error('Clipboard also failed:', clipError);
      alert('Extension error. Please copy this text manually: ' + text);
    }
  }
}

function isEditableElement(element) {
  if (!element) return false;
  
  return element.tagName === 'INPUT' ||
         element.tagName === 'TEXTAREA' ||
         element.isContentEditable ||
         element.contentEditable === 'true' ||
         element.classList.contains('ProseMirror') ||
         element.getAttribute('role') === 'textbox';
}

function insertIntoProseMirror(element, text) {
  console.log('Inserting into ProseMirror');
  
  const proseMirror = element.classList.contains('ProseMirror') ? element : element.closest('.ProseMirror');
  
  try {
    // Method 1: Try to trigger keyboard events
    proseMirror.focus();
    
    // Clear existing content if it's placeholder
    const placeholder = proseMirror.querySelector('.placeholder');
    if (placeholder) {
      proseMirror.innerHTML = '<p></p>';
    }
    
    // Method 2: Direct content manipulation
    const p = proseMirror.querySelector('p') || document.createElement('p');
    if (!p.parentNode) {
      proseMirror.appendChild(p);
    }
    
    // Insert text with proper formatting
    const lines = text.split('\n');
    p.innerHTML = '';
    
    lines.forEach((line, index) => {
      if (index > 0) {
        p.appendChild(document.createElement('br'));
      }
      if (line.trim()) {
        p.appendChild(document.createTextNode(line));
      }
    });
    
    // Method 3: Try simulating typing
    simulateTyping(proseMirror, text);
    
    // Trigger events
    ['input', 'change', 'keyup', 'keydown'].forEach(eventType => {
      proseMirror.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
    
  } catch (error) {
    console.error('ProseMirror insertion failed:', error);
    copyToClipboard(text);
  }
}

function insertIntoContentEditable(element, text) {
  console.log('Inserting into contentEditable');
  
  element.focus();
  
  try {
    // Method 1: execCommand
    if (document.execCommand) {
      const htmlText = text.replace(/\n/g, '<br>');
      if (document.execCommand('insertHTML', false, htmlText)) {
        return;
      }
    }
    
    // Method 2: Selection API
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const lines = text.split('\n');
        const fragment = document.createDocumentFragment();
        
        lines.forEach((line, index) => {
          if (index > 0) {
            fragment.appendChild(document.createElement('br'));
          }
          fragment.appendChild(document.createTextNode(line));
        });
        
        range.insertNode(fragment);
        range.setStartAfter(fragment);
        range.setEndAfter(fragment);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    
    element.dispatchEvent(new Event('input', { bubbles: true }));
    
  } catch (error) {
    console.error('ContentEditable insertion failed:', error);
    copyToClipboard(text);
  }
}

function insertIntoInput(element, text) {
  console.log('Inserting into input/textarea');
  
  element.focus();
  
  const start = element.selectionStart || 0;
  const end = element.selectionEnd || 0;
  const currentValue = element.value || '';
  
  const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
  element.value = newValue;
  
  const newCursorPos = start + text.length;
  element.setSelectionRange(newCursorPos, newCursorPos);
  
  ['input', 'change'].forEach(eventType => {
    element.dispatchEvent(new Event(eventType, { bubbles: true }));
  });
}

function simulateTyping(element, text) {
  // Simulate individual keystrokes for complex editors
  text.split('').forEach((char, index) => {
    setTimeout(() => {
      const keyEvent = new KeyboardEvent('keydown', {
        key: char,
        char: char,
        bubbles: true
      });
      element.dispatchEvent(keyEvent);
    }, index * 10);
  });
}

function copyToClipboard(text) {
  console.log('Copying to clipboard:', text);
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
    // Show a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    notification.textContent = 'Prompt copied to clipboard!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }).catch(err => {
    console.error('Failed to copy to clipboard:', err);
  });
}

function updatePromptsMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "prompts",
      title: "Prompt List",
      contexts: ["page", "editable", "selection"]  // Added more contexts
    });

    chrome.storage.local.get(["prompts"], (result) => {
      const prompts = result.prompts || [];
      prompts.forEach(prompt => {
        chrome.contextMenus.create({
          id: "prompt_" + prompt.id,
          parentId: "prompts",
          title: prompt.title,
          contexts: ["page", "editable", "selection"]  // Added more contexts
        });
      });
    });
  });
}

chrome.storage.onChanged.addListener(updatePromptsMenu);

// Handle extension icon click to open options page
chrome.action.onClicked.addListener(() => {
  console.log('Extension icon clicked, opening options page');
  chrome.runtime.openOptionsPage();
});
