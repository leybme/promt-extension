chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/reloaded');
  
  // First create default prompts and placeholders if they don't exist, then update menu
  chrome.storage.local.get(["prompts", "placeholders"], (result) => {
    const prompts = result.prompts || [];
    const placeholders = result.placeholders || [];
    console.log('Current prompts:', prompts.length);
    console.log('Current placeholders:', placeholders.length);
    
    let shouldUpdateMenu = false;
    
    if (prompts.length === 0) {
      console.log('Creating default prompts...');
      shouldUpdateMenu = true;
      // Create default prompts first
      const defaultPrompts = [
        {
          id: 'default-1',
          title: 'Code Review',
          text: 'Act as a senior software engineer and review this code. Provide a detailed analysis covering:\n\n**Code Quality:**\n- Readability and naming conventions\n- Code structure and organization\n- SOLID principles adherence\n\n**Security & Best Practices:**\n- Potential security vulnerabilities\n- Input validation and sanitization\n- Error handling and edge cases\n\n**Performance:**\n- Algorithm efficiency (time/space complexity)\n- Memory usage optimization\n- Database query optimization\n\n**Suggestions:**\n- Specific improvements with code examples\n- Alternative approaches or patterns\n- Priority level for each issue (High/Medium/Low)\n\nPlease be constructive and provide actionable feedback.'
        },
        {
          id: 'default-2',
          title: 'Explain Code',
          text: 'Analyze and explain this code in a clear, educational manner:\n\n**Overview:**\n- What problem does this code solve?\n- What is the main purpose and expected outcome?\n\n**How it Works:**\n- Step-by-step breakdown of the logic\n- Key algorithms or patterns used\n- Data flow and transformations\n\n**Key Concepts:**\n- Important programming concepts demonstrated\n- Design patterns or architectural principles\n- Language-specific features utilized\n\n**Use Cases:**\n- When and where this code would be useful\n- Potential modifications for different scenarios\n- Integration possibilities\n\nExplain as if teaching someone who understands programming basics but is new to this specific implementation.'
        },
        {
          id: 'default-3',
          title: 'Debug Help',
          text: 'I\'m experiencing an issue with this code. Please help me debug it systematically:\n\n**Problem Analysis:**\n- Analyze the code for potential bugs\n- Identify logical errors or incorrect assumptions\n- Check for common pitfalls and anti-patterns\n\n**Debugging Strategy:**\n- Specific debugging steps to isolate the issue\n- What to log or print for diagnosis\n- Tools or techniques that would help\n\n**Likely Causes:**\n- Most probable reasons for the issue\n- Edge cases that might be causing problems\n- Environment or configuration issues\n\n**Solutions:**\n- Immediate fixes for the identified problems\n- Code improvements to prevent similar issues\n- Best practices to avoid future bugs\n\nPlease provide specific, actionable debugging steps and potential solutions.'
        },
        {
          id: 'default-4',
          title: 'Optimize Performance',
          text: 'Analyze this code for performance optimization opportunities:\n\n**Performance Analysis:**\n- Current time and space complexity\n- Bottlenecks and expensive operations\n- Resource usage patterns\n\n**Optimization Opportunities:**\n- Algorithm improvements (better data structures, algorithms)\n- Memory optimization (reduce allocations, efficient data usage)\n- I/O optimization (database queries, file operations, network calls)\n- Caching strategies and memoization\n\n**Specific Improvements:**\n- Code refactoring suggestions with examples\n- Alternative implementations\n- Parallel processing opportunities\n- Lazy loading and pagination strategies\n\n**Expected Impact:**\n- Estimated performance gains\n- Trade-offs and considerations\n- Monitoring and measurement recommendations\n\nProvide concrete optimization suggestions with code examples and expected performance improvements.'
        },
        {
          id: 'default-5',
          title: 'Write Tests',
          text: 'Help me create comprehensive tests for this code:\n\n**Test Strategy:**\n- Identify testable units and components\n- Determine appropriate testing levels (unit, integration, e2e)\n- Edge cases and boundary conditions to test\n\n**Unit Tests:**\n- Test individual functions with various inputs\n- Mock external dependencies\n- Assert expected outputs and side effects\n\n**Integration Tests:**\n- Test component interactions\n- Database and API integration scenarios\n- End-to-end workflow validation\n\n**Test Cases to Include:**\n- Happy path scenarios\n- Error conditions and exception handling\n- Boundary values and edge cases\n- Performance and load testing considerations\n\n**Test Implementation:**\n- Provide actual test code with setup/teardown\n- Mock data and fixtures\n- Assertion examples and expected outcomes\n\nGenerate practical, runnable test code with clear descriptions of what each test validates.'
        },
        {
          id: 'default-6',
          title: 'Documentation',
          text: 'Help me create comprehensive documentation for this code:\n\n**API Documentation:**\n- Function/method signatures with parameter descriptions\n- Return value types and possible values\n- Exception handling and error codes\n- Usage examples and code snippets\n\n**Architecture Overview:**\n- High-level component structure\n- Data flow and system interactions\n- Dependencies and integration points\n\n**Usage Guide:**\n- Step-by-step implementation guide\n- Configuration options and settings\n- Common use cases and examples\n- Troubleshooting tips\n\n**Developer Notes:**\n- Setup and installation instructions\n- Development environment requirements\n- Contributing guidelines\n- Known limitations and future improvements\n\nCreate documentation that is clear, comprehensive, and useful for both users and future developers.'
        },
        {
          id: 'default-7',
          title: 'Refactor Code',
          text: 'Suggest refactoring improvements for this code to enhance maintainability and quality:\n\n**Structural Improvements:**\n- Break down large functions into smaller, focused ones\n- Improve class/module organization and responsibilities\n- Apply SOLID principles and design patterns\n- Reduce code duplication and increase reusability\n\n**Code Clarity:**\n- Improve variable and function naming\n- Add meaningful comments and documentation\n- Simplify complex conditional logic\n- Enhance code readability and flow\n\n**Technical Debt Reduction:**\n- Remove dead code and unused variables\n- Update deprecated methods and libraries\n- Improve error handling consistency\n- Standardize coding style and conventions\n\n**Modernization:**\n- Use modern language features and syntax\n- Implement current best practices\n- Improve type safety and validation\n- Consider async/await patterns where appropriate\n\nProvide specific refactoring suggestions with before/after code examples and explanations of the benefits.'
        },
        {
          id: 'default-8',
          title: 'Convert to Different Language',
          text: 'Convert this code to [TARGET_LANGUAGE] while maintaining functionality and following best practices:\n\n**Language Conversion:**\n- Translate syntax and language constructs accurately\n- Use idiomatic patterns for the target language\n- Implement equivalent data structures and types\n- Handle language-specific differences appropriately\n\n**Best Practices:**\n- Follow target language naming conventions\n- Use standard libraries and frameworks\n- Implement proper error handling patterns\n- Apply language-specific optimization techniques\n\n**Documentation:**\n- Comment on significant differences between languages\n- Explain target language specific features used\n- Note any functionality that changes due to language constraints\n- Provide setup and dependency information\n\n**Validation:**\n- Ensure equivalent functionality and behavior\n- Include examples of how to test the converted code\n- Highlight any performance differences\n- Suggest migration strategies if needed\n\nProvide a complete, working conversion with explanations of key differences and implementation decisions.'
        }
      ];
      
      chrome.storage.local.set({ prompts: defaultPrompts }, () => {
        updatePromptsMenu();
      });
    } else {
      shouldUpdateMenu = true;
    }
    
    if (placeholders.length === 0) {
      console.log('Creating default placeholders...');
      const defaultPlaceholders = [
        { name: 'TARGET_LANGUAGE', description: 'Language to convert to', defaultValue: '' },
        { name: 'FULL_NAME', description: 'Your full name', defaultValue: '' },
        { name: 'POSITION', description: 'Your job title or position', defaultValue: '' },
        { name: 'COMPANY', description: 'Your company name', defaultValue: '' },
      ];
      
      chrome.storage.local.set({ placeholders: defaultPlaceholders });
    }
    
    if (shouldUpdateMenu) {
      updatePromptsMenu();
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked:', info.menuItemId);
  
  if (info.menuItemId.startsWith("prompt_")) {
    const promptId = info.menuItemId.replace("prompt_", "");
    console.log('Prompt ID:', promptId);
    
    chrome.storage.local.get(["prompts", "placeholders"], (result) => {
      const prompts = result.prompts || [];
      const placeholders = result.placeholders || [];
      const prompt = prompts.find(p => p.id === promptId);
      console.log('Found prompt:', prompt);
      
      if (prompt) {
        let promptText = prompt.text;
        
        // Check if the prompt contains placeholders
        const placeholderPattern = /\[([A-Z_]+)\]/g;
        const foundPlaceholders = [...promptText.matchAll(placeholderPattern)];
        
        if (foundPlaceholders.length > 0) {
          // Replace placeholders that have default values, leave others as-is
          const uniquePlaceholders = [...new Set(foundPlaceholders.map(match => match[1]))];
          
          let finalText = promptText;
          
          uniquePlaceholders.forEach(placeholderName => {
            const placeholderInfo = placeholders.find(p => p.name === placeholderName);
            if (placeholderInfo && placeholderInfo.defaultValue && placeholderInfo.defaultValue.trim()) {
              // Replace with default value using simple string replacement
              const placeholder = `[${placeholderName}]`;
              finalText = finalText.split(placeholder).join(placeholderInfo.defaultValue);
            }
            // If no default value, leave the placeholder as-is in the text
          });
          
          // Insert the text with replaced placeholders (or original placeholders if no defaults)
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertPromptSimple,
            args: [finalText]
          });
        } else {
          // No placeholders, proceed with original insertion logic
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
              args: [promptText]
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
              args: [promptText]
            }).catch(clipboardError => {
              console.error('Clipboard fallback also failed:', clipboardError);
            });
          });
        }
      }
    });
  }
});

function showPlaceholderDialog(promptText, foundPlaceholders, availablePlaceholders) {
  console.log('Showing placeholder dialog for:', foundPlaceholders);
  
  // Create modal dialog
  const modal = document.createElement('div');
  modal.id = 'placeholderReplacementModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  `;
  
  const title = document.createElement('h2');
  title.textContent = 'Replace Placeholders';
  title.style.cssText = `
    margin: 0 0 20px 0;
    color: #333;
    font-size: 24px;
    font-weight: 600;
  `;
  
  const description = document.createElement('p');
  description.textContent = 'Please provide values for the following placeholders:';
  description.style.cssText = `
    margin: 0 0 20px 0;
    color: #666;
    line-height: 1.5;
  `;
  
  const form = document.createElement('form');
  const inputs = {};
  
  foundPlaceholders.forEach(placeholderName => {
    const fieldGroup = document.createElement('div');
    fieldGroup.style.cssText = 'margin-bottom: 16px;';
    
    const label = document.createElement('label');
    label.textContent = `[${placeholderName}]`;
    label.style.cssText = `
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #374151;
    `;
    
    // Find description from available placeholders
    const placeholderInfo = availablePlaceholders.find(p => p.name === placeholderName);
    if (placeholderInfo && placeholderInfo.description) {
      const desc = document.createElement('small');
      desc.textContent = placeholderInfo.description;
      desc.style.cssText = `
        display: block;
        color: #6b7280;
        margin-bottom: 6px;
        font-size: 12px;
      `;
      label.appendChild(desc);
    }
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Enter value for ${placeholderName}`;
    input.style.cssText = `
      width: 100%;
      padding: 10px 12px;
      border: 2px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    `;
    
    input.addEventListener('focus', () => {
      input.style.borderColor = '#4f46e5';
    });
    
    input.addEventListener('blur', () => {
      input.style.borderColor = '#d1d5db';
    });
    
    inputs[placeholderName] = input;
    
    fieldGroup.appendChild(label);
    fieldGroup.appendChild(input);
    form.appendChild(fieldGroup);
  });
  
  const buttonGroup = document.createElement('div');
  buttonGroup.style.cssText = `
    display: flex;
    gap: 12px;
    margin-top: 24px;
    justify-content: flex-end;
  `;
  
  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  cancelButton.style.cssText = `
    padding: 10px 20px;
    border: 2px solid #d1d5db;
    background: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `;
  
  const insertButton = document.createElement('button');
  insertButton.type = 'submit';
  insertButton.textContent = 'Insert Prompt';
  insertButton.style.cssText = `
    padding: 10px 20px;
    border: none;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `;
  
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let finalText = promptText;
    
    // Replace all placeholders with user input
    foundPlaceholders.forEach(placeholderName => {
      const value = inputs[placeholderName].value.trim();
      const placeholder = `[${placeholderName}]`;
      finalText = finalText.split(placeholder).join(value);
    });
    
    // Remove the modal
    document.body.removeChild(modal);
    
    // Insert the final text
    insertPromptSimple(finalText);
  });
  
  buttonGroup.appendChild(cancelButton);
  buttonGroup.appendChild(insertButton);
  
  modalContent.appendChild(title);
  modalContent.appendChild(description);
  modalContent.appendChild(form);
  modalContent.appendChild(buttonGroup);
  modal.appendChild(modalContent);
  
  document.body.appendChild(modal);
  
  // Focus on first input
  if (foundPlaceholders.length > 0) {
    inputs[foundPlaceholders[0]].focus();
  }
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

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
