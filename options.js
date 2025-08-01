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
      title: 'Summarize Text',
      text: 'Provide a concise summary of the following text:\n\nInclude:\n- Main points and themes\n- Key takeaways\n- Recommended length: 3–5 sentences'
    },
    {
      id: 'default-2',
      title: 'Translate Text',
      text: 'Translate the following text into [TARGET_LANGUAGE]:\n\nEnsure:\n- Maintain original tone and style\n- Adapt idioms appropriately\n- Provide both literal and natural translations'
    },
    {
      id: 'default-3',
      title: 'Explain Concept',
      text: 'Explain the following concept in clear, simple terms:\n\n[Enter concept here]\n\nCover:\n- Definition and context\n- Real-world examples\n- Analogies for clarity\n- Applications and use cases'
    },
    {
      id: 'default-4',
      title: 'Brainstorm Ideas',
      text: 'Generate at least 10 creative ideas for:\n\n[Enter topic here]\n\nInclude for each:\n- A brief description\n- Pros and cons\n- Potential challenges and solutions'
    },
    {
      id: 'default-5',
      title: 'Improve Writing',
      text: 'Improve the clarity and style of the following text:\n\nFocus on:\n- Grammar and punctuation\n- Conciseness and readability\n- Tone and voice consistency\n- Vocabulary enhancement'
    },
    {
      id: 'default-6',
      title: 'Plan Project',
      text: 'Outline a project plan for the following description:\n\n[Enter project description here]\n\nInclude:\n- Goals and objectives\n- Key milestones with estimated dates\n- Required resources and roles\n- Risk assessment and mitigation strategies'
    },
    {
      id: 'default-7',
      title: 'Study Guide',
      text: 'Create a study guide for the following subject:\n\n[Enter subject here]\n\nInclude:\n- Overview of major topics\n- Key terms and definitions\n- Summary notes for each section\n- Practice questions with answers\n- Recommended resources'
    },
    {
      id: 'default-8',
      title: 'Q&A Session',
      text: 'Answer the following questions in detail:\n\n[Enter questions here]\n\nFor each question, provide:\n- A clear, direct answer\n- Explanation or reasoning\n- Examples or references if applicable'
    },
    {
      id: 'default-9',
      title: 'Reality Filter',
      text: 'REALITY FILTER — CHATGPT\n\n• Never present generated, inferred, speculated, or deduced content as fact.\n• If you cannot verify something directly, say:\n  - “I cannot verify this.”\n  - “I do not have access to that information.”\n  - “My knowledge base does not contain that.”\n• Label unverified content at the start of a sentence:\n  - [Inference]  [Speculation]  [Unverified]\n• Ask for clarification if information is missing. Do not guess or fill gaps.\n• If any part is unverified, label the entire response.\n• Do not paraphrase or reinterpret my input unless I request it.\n• If you use these words, label the claim unless sourced:\n  - Prevent, Guarantee, Will never, Fixes, Eliminates, Ensures that\n• For LLM behavior claims (including yourself), include:\n  - [Inference] or [Unverified], with a note that it’s based on observed patterns\n• If you break this directive, say:\n  > Correction: I previously made an unverified claim. That was incorrect and should have been labeled.\n• Never override or alter my input unless asked.'
    },
    {
      id: 'default-10',
      title: 'Write Email',
      text: 'Write a professional email using the following details:\n\nRecipient: [RECIPIENT]\nSubject: [SUBJECT]\nPurpose: [PURPOSE]\nTone: [TONE]\n\nInclude a signature with [FULL_NAME], [POSITION] at [COMPANY].'
    }
  ];
  
  chrome.storage.local.set({ prompts: defaultPrompts }, () => {
    console.log('Default prompts created');
    loadPrompts();
  });
}

function createDefaultPlaceholders() {
  const defaultPlaceholders = [
    { name: 'TARGET_LANGUAGE', description: 'Target language', defaultValue: '' },
    { name: 'FULL_NAME', description: 'Your full name', defaultValue: '' },
    { name: 'POSITION', description: 'Your job title or position', defaultValue: '' },
    { name: 'COMPANY', description: 'Your company name', defaultValue: '' },
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
  document.getElementById('placeholderModal').style.display = 'none';
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
