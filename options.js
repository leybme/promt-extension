function createDefaultPrompts() {
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
    console.log('Default prompts created');
    loadPrompts();
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
      const div = document.createElement('div');
      div.className = 'prompt-item';
      div.innerHTML = `
        <div class="prompt-content" data-title="${p.title}" data-text="${p.text}">
          <strong>${p.title}</strong>
          <p>${p.text}</p>
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
    // Load prompt into input fields when clicked (existing functionality)
    const promptContent = e.target.closest('.prompt-content');
    const title = promptContent.dataset.title;
    const text = promptContent.dataset.text;
    
    document.getElementById('title').value = title;
    document.getElementById('prompt').value = text;
  }
});

document.addEventListener('DOMContentLoaded', loadPrompts);
