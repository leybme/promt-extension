// Function to truncate text to first 5 sentences
function truncateToSentences(text, sentenceCount = 5) {
  // Remove markdown formatting and clean up text
  const cleanText = text.replace(/\*\*/g, '').replace(/\n\n/g, ' ').replace(/\n/g, ' ');
  
  // Split by sentence endings and structured text patterns
  // Look for periods, exclamation marks, question marks, and colons followed by spaces
  const sentences = cleanText.match(/[^\.!?:]+[\.!?:]+(?=\s|$)/g) || [];
  
  // If no proper sentences found, try splitting by double spaces or use word-based truncation
  if (sentences.length === 0) {
    // Try splitting by patterns that indicate new sections
    const sections = cleanText.split(/(?:\s{2,}|\s*-\s)/).filter(s => s.trim().length > 0);
    
    if (sections.length > 1) {
      // Use first few sections as "sentences"
      if (sections.length <= sentenceCount) {
        return { truncated: cleanText, isTruncated: false };
      }
      const truncated = sections.slice(0, sentenceCount).join(' ').trim();
      return { truncated: truncated + '...', isTruncated: true };
    }
    
    // Fall back to word-based truncation for very short or unstructured text
    const words = cleanText.split(' ');
    const wordLimit = sentenceCount * 15; // Approximately 15 words per "sentence"
    
    if (words.length <= wordLimit) {
      return { truncated: cleanText, isTruncated: false };
    }
    const truncated = words.slice(0, wordLimit).join(' ');
    return { truncated: truncated + '...', isTruncated: true };
  }
  
  if (sentences.length <= sentenceCount) {
    return { truncated: cleanText, isTruncated: false };
  }
  
  // Take first few sentences and clean them up
  const truncated = sentences.slice(0, sentenceCount).join(' ').trim();
  return { truncated: truncated + '...', isTruncated: true };
}

function createDefaultPrompts() {
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
    console.log('Default prompts created');
    loadPrompts();
  });
}

function createDefaultPlaceholders() {
  const defaultPlaceholders = [
    { name: 'TARGET_LANGUAGE', description: 'Programming language to convert to', defaultValue: '' },
    { name: 'FULL_NAME', description: 'Your full name', defaultValue: '' },
    { name: 'POSITION', description: 'Your job title or position', defaultValue: '' },
    { name: 'COMPANY', description: 'Your company name', defaultValue: '' },
    { name: 'PROJECT_NAME', description: 'Name of the current project', defaultValue: '' },
    { name: 'FRAMEWORK', description: 'Framework or library being used', defaultValue: '' },
    { name: 'DATABASE', description: 'Database system being used', defaultValue: '' },
    { name: 'API_NAME', description: 'Name of the API or service', defaultValue: '' }
  ];
  
  chrome.storage.local.set({ placeholders: defaultPlaceholders }, () => {
    console.log('Default placeholders created');
    loadPlaceholders();
  });
}

function loadPrompts() {
  chrome.storage.local.get(["prompts"], (result) => {
    const prompts = result.prompts || [];
    
    // If no prompts exist, create default ones
    if (prompts.length === 0) {
      createDefaultPrompts();
      return;
    }
    
    const list = document.getElementById('promptList');
    list.innerHTML = '';
    
    // Show empty state if no prompts
    if (prompts.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3>No prompts yet</h3>
          <p>Create your first prompt using the form above</p>
        </div>
      `;
      return;
    }
    
    prompts.forEach(p => {
      const { truncated, isTruncated } = truncateToSentences(p.text);
      
      const div = document.createElement('div');
      div.className = 'prompt-item';
      div.innerHTML = `
        <div class="prompt-content" data-title="${p.title}" data-text="${p.text}" data-expanded="false">
          <strong>${p.title}</strong>
          <p class="prompt-text">${truncated}</p>
          ${isTruncated ? '<span class="expand-indicator">Click to expand...</span>' : ''}
        </div>
        <div class="prompt-actions">
          <button data-id="${p.id}" data-title="${p.title}" data-text="${p.text}" class="edit">Edit</button>
          <button data-id="${p.id}" class="delete">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  });
}

function loadPlaceholders() {
  chrome.storage.local.get(["placeholders"], (result) => {
    const placeholders = result.placeholders || [];
    
    // If no placeholders exist, create default ones
    if (placeholders.length === 0) {
      createDefaultPlaceholders();
      return;
    }
    
    const tagsContainer = document.getElementById('placeholderTags');
    tagsContainer.innerHTML = '';
    
    if (placeholders.length === 0) {
      tagsContainer.innerHTML = '<div class="placeholder-tag empty-state">No placeholders available</div>';
    } else {
      placeholders.forEach(placeholder => {
        const tag = document.createElement('div');
        tag.className = 'placeholder-tag';
        tag.textContent = `[${placeholder.name}]`;
        tag.title = placeholder.description || placeholder.name;
        tag.addEventListener('click', () => {
          insertPlaceholder(placeholder.name);
        });
        tagsContainer.appendChild(tag);
      });
    }
    
    // Load default values list
    loadDefaultValuesList(placeholders);
    
    // Also update the modal list if it exists
    updateModalPlaceholderList(placeholders);
  });
}

function loadDefaultValuesList(placeholders) {
  const defaultValuesList = document.getElementById('defaultValuesList');
  if (!defaultValuesList) return;
  
  defaultValuesList.innerHTML = '';
  
  if (placeholders.length === 0) {
    defaultValuesList.innerHTML = '<div class="default-value-empty">No placeholders available</div>';
    return;
  }
  
  const hasValues = placeholders.some(p => p.defaultValue && p.defaultValue.trim());
  
  if (!hasValues) {
    defaultValuesList.innerHTML = '<div class="default-value-empty">No default values set. Click "Edit Default Values" to add them.</div>';
    return;
  }
  
  placeholders.forEach(placeholder => {
    if (placeholder.defaultValue && placeholder.defaultValue.trim()) {
      const item = document.createElement('div');
      item.className = 'default-value-item';
      item.innerHTML = `
        <span class="default-value-placeholder">[${placeholder.name}]</span>
        <span class="default-value-text">${placeholder.defaultValue}</span>
      `;
      defaultValuesList.appendChild(item);
    }
  });
}

function insertPlaceholder(placeholderName) {
  const promptTextarea = document.getElementById('prompt');
  const cursorPos = promptTextarea.selectionStart;
  const textBefore = promptTextarea.value.substring(0, cursorPos);
  const textAfter = promptTextarea.value.substring(promptTextarea.selectionEnd);
  
  const placeholderText = `[${placeholderName}]`;
  promptTextarea.value = textBefore + placeholderText + textAfter;
  
  // Set cursor position after the inserted placeholder
  const newCursorPos = cursorPos + placeholderText.length;
  promptTextarea.setSelectionRange(newCursorPos, newCursorPos);
  promptTextarea.focus();
}

function updateModalPlaceholderList(placeholders) {
  const container = document.getElementById('existingPlaceholders');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (placeholders.length === 0) {
    container.innerHTML = '<p style="color: #6b7280; font-style: italic;">No placeholders yet. Add your first placeholder above.</p>';
    return;
  }
  
  placeholders.forEach((placeholder, index) => {
    const div = document.createElement('div');
    div.className = 'existing-placeholder';
    div.innerHTML = `
      <div class="existing-placeholder-info">
        <div class="existing-placeholder-name">[${placeholder.name}]</div>
        ${placeholder.description ? `<div class="existing-placeholder-desc">${placeholder.description}</div>` : ''}
      </div>
      <button class="delete-placeholder" data-index="${index}">Delete</button>
    `;
    container.appendChild(div);
  });
}

document.getElementById('add').addEventListener('click', () => {
  const titleEl = document.getElementById('title');
  const textEl = document.getElementById('prompt');
  const addButton = document.getElementById('add');
  const title = titleEl.value.trim();
  const text = textEl.value.trim();
  
  if (title && text) {
    chrome.storage.local.get(["prompts"], (result) => {
      let prompts = result.prompts || [];
      
      // Check if we're editing an existing prompt
      const editingId = addButton.dataset.editingId;
      
      if (editingId) {
        // Update existing prompt
        const promptIndex = prompts.findIndex(p => p.id === editingId);
        if (promptIndex !== -1) {
          prompts[promptIndex] = { id: editingId, title, text };
        }
        
        // Reset the button and hide cancel
        addButton.textContent = 'Add Prompt';
        document.getElementById('cancel').style.display = 'none';
        delete addButton.dataset.editingId;
      } else {
        // Add new prompt
        prompts.push({ id: Date.now().toString(), title, text });
      }
      
      chrome.storage.local.set({ prompts }, () => {
        titleEl.value = '';
        textEl.value = '';
        loadPrompts();
      });
    });
  }
});

document.getElementById('resetDefaults').addEventListener('click', () => {
  if (confirm('This will replace all current prompts with the default ones. Are you sure?')) {
    createDefaultPrompts();
  }
});

document.getElementById('cancel').addEventListener('click', () => {
  // Reset form and buttons
  document.getElementById('title').value = '';
  document.getElementById('prompt').value = '';
  
  const addButton = document.getElementById('add');
  addButton.textContent = 'Add Prompt';
  delete addButton.dataset.editingId;
  
  document.getElementById('cancel').style.display = 'none';
});

document.getElementById('promptList').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const id = e.target.dataset.id;
    chrome.storage.local.get(["prompts"], (result) => {
      let prompts = result.prompts || [];
      prompts = prompts.filter(p => p.id !== id);
      chrome.storage.local.set({ prompts }, loadPrompts);
    });
  } else if (e.target.classList.contains('edit')) {
    // Handle edit button click
    const id = e.target.dataset.id;
    const title = e.target.dataset.title;
    const text = e.target.dataset.text;
    
    // Load the prompt data into the input fields
    document.getElementById('title').value = title;
    document.getElementById('prompt').value = text;
    
    // Change the Add button to Update button temporarily
    const addButton = document.getElementById('add');
    const cancelButton = document.getElementById('cancel');
    addButton.textContent = 'Update Prompt';
    addButton.dataset.editingId = id;
    
    // Show cancel button
    cancelButton.style.display = 'inline-block';
    
    // Scroll to top so user can see the form
    window.scrollTo(0, 0);
    
    // Focus on title field
    document.getElementById('title').focus();
    
  } else if (e.target.closest('.prompt-content')) {
    // Handle expand/collapse functionality
    const promptContent = e.target.closest('.prompt-content');
    const title = promptContent.dataset.title;
    const text = promptContent.dataset.text;
    const isExpanded = promptContent.dataset.expanded === 'true';
    const promptTextElement = promptContent.querySelector('.prompt-text');
    const expandIndicator = promptContent.querySelector('.expand-indicator');
    
    const { truncated, isTruncated } = truncateToSentences(text);
    
    // Always handle expand/collapse if the text can be truncated
    if (isTruncated || isExpanded) {
      if (isExpanded) {
        // Collapse: show truncated version
        promptTextElement.textContent = truncated;
        promptContent.dataset.expanded = 'false';
        
        // Remove collapse indicator and add expand indicator
        if (expandIndicator) {
          expandIndicator.remove();
        }
        const newExpandIndicator = document.createElement('span');
        newExpandIndicator.className = 'expand-indicator';
        newExpandIndicator.textContent = 'Click to expand...';
        promptContent.appendChild(newExpandIndicator);
      } else {
        // Expand: show full text
        promptTextElement.textContent = text;
        promptContent.dataset.expanded = 'true';
        
        // Remove expand indicator and add collapse indicator
        if (expandIndicator) {
          expandIndicator.remove();
        }
        const collapseIndicator = document.createElement('span');
        collapseIndicator.className = 'expand-indicator';
        collapseIndicator.textContent = 'Click to collapse...';
        promptContent.appendChild(collapseIndicator);
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadPrompts();
  loadPlaceholders();
});

// Placeholder Management Event Listeners
document.getElementById('managePlaceholders').addEventListener('click', () => {
  document.getElementById('placeholderModal').style.display = 'block';
  chrome.storage.local.get(["placeholders"], (result) => {
    const placeholders = result.placeholders || [];
    updateModalPlaceholderList(placeholders);
  });
});

document.getElementById('closePlaceholderModal').addEventListener('click', () => {
  document.getElementById('placeholderModal').style.display = 'none';
  document.getElementById('placeholderName').value = '';
  document.getElementById('placeholderDescription').value = '';
  document.getElementById('placeholderDefaultValue').value = '';
});

document.getElementById('addPlaceholder').addEventListener('click', () => {
  const nameEl = document.getElementById('placeholderName');
  const descEl = document.getElementById('placeholderDescription');
  const defaultValueEl = document.getElementById('placeholderDefaultValue');
  const name = nameEl.value.trim().toUpperCase();
  const description = descEl.value.trim();
  const defaultValue = defaultValueEl.value.trim();
  
  if (name) {
    chrome.storage.local.get(["placeholders"], (result) => {
      let placeholders = result.placeholders || [];
      
      // Check if placeholder already exists
      if (placeholders.some(p => p.name === name)) {
        alert('A placeholder with this name already exists!');
        return;
      }
      
      placeholders.push({ name, description, defaultValue });
      
      chrome.storage.local.set({ placeholders }, () => {
        nameEl.value = '';
        descEl.value = '';
        defaultValueEl.value = '';
        loadPlaceholders();
        updateModalPlaceholderList(placeholders);
      });
    });
  }
});

document.getElementById('cancelPlaceholder').addEventListener('click', () => {
  document.getElementById('placeholderName').value = '';
  document.getElementById('placeholderDescription').value = '';
  document.getElementById('placeholderDefaultValue').value = '';
});

// Default Values Management Event Listeners
document.getElementById('editDefaultValues').addEventListener('click', () => {
  chrome.storage.local.get(["placeholders"], (result) => {
    const placeholders = result.placeholders || [];
    showDefaultValuesModal(placeholders);
  });
});

document.getElementById('closeDefaultValuesModal').addEventListener('click', () => {
  document.getElementById('defaultValuesModal').style.display = 'none';
});

document.getElementById('cancelDefaultValues').addEventListener('click', () => {
  document.getElementById('defaultValuesModal').style.display = 'none';
});

document.getElementById('saveDefaultValues').addEventListener('click', () => {
  saveDefaultValues();
});

// Handle clicking outside modal to close it
document.getElementById('defaultValuesModal').addEventListener('click', (e) => {
  if (e.target.id === 'defaultValuesModal') {
    document.getElementById('defaultValuesModal').style.display = 'none';
  }
});

function showDefaultValuesModal(placeholders) {
  const modal = document.getElementById('defaultValuesModal');
  const form = document.getElementById('defaultValuesForm');
  
  form.innerHTML = '';
  
  if (placeholders.length === 0) {
    form.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No placeholders available. Create some placeholders first.</p>';
  } else {
    placeholders.forEach((placeholder, index) => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'default-value-field';
      
      const label = document.createElement('label');
      label.innerHTML = `
        <span class="placeholder-badge">[${placeholder.name}]</span>
        <span>${placeholder.description || 'No description'}</span>
      `;
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'default-value-input';
      input.placeholder = `Enter default value for [${placeholder.name}]`;
      input.value = placeholder.defaultValue || '';
      input.dataset.index = index;
      
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      form.appendChild(fieldDiv);
    });
  }
  
  modal.style.display = 'block';
}

function saveDefaultValues() {
  chrome.storage.local.get(["placeholders"], (result) => {
    let placeholders = result.placeholders || [];
    
    // Update placeholders with new default values
    const inputs = document.querySelectorAll('#defaultValuesForm .default-value-input');
    inputs.forEach(input => {
      const index = parseInt(input.dataset.index);
      if (placeholders[index]) {
        placeholders[index].defaultValue = input.value.trim();
      }
    });
    
    chrome.storage.local.set({ placeholders }, () => {
      document.getElementById('defaultValuesModal').style.display = 'none';
      loadPlaceholders();
    });
  });
}

// Handle clicking outside modal to close it
document.getElementById('placeholderModal').addEventListener('click', (e) => {
  if (e.target.id === 'placeholderModal') {
    document.getElementById('placeholderModal').style.display = 'none';
    document.getElementById('placeholderName').value = '';
    document.getElementById('placeholderDescription').value = '';
    document.getElementById('placeholderDefaultValue').value = '';
  }
});

// Handle delete placeholder
document.getElementById('existingPlaceholders').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-placeholder')) {
    const index = parseInt(e.target.dataset.index);
    
    chrome.storage.local.get(["placeholders"], (result) => {
      let placeholders = result.placeholders || [];
      placeholders.splice(index, 1);
      
      chrome.storage.local.set({ placeholders }, () => {
        loadPlaceholders();
        updateModalPlaceholderList(placeholders);
      });
    });
  }
});
