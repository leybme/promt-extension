# Prompt Saver - Chrome Extension

A powerful Chrome extension that helps you save, manage, and quickly access your favorite prompts for AI assistants, code reviews, and other repetitive tasks.

## 📋 Features

- **📝 Save Custom Prompts**: Create and store your own prompt templates
- **🔄 Quick Access**: Right-click context menu to instantly copy prompts to clipboard
- **🎯 Pre-built Templates**: Comes with 10 ready-to-use prompt templates for general-purpose tasks
- **✏️ Edit & Manage**: Full CRUD operations - create, read, update, and delete prompts
- **🎨 Beautiful UI**: Modern, responsive interface with gradient design
- **💾 Local Storage**: All prompts are stored locally in your browser

## 🚀 Installation

### From Source (Developer Mode)

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" button
5. Select the folder containing the extension files
6. The extension should now appear in your extensions list

### Usage After Installation

1. The extension will automatically create default prompts on first install
2. Click the extension icon in your toolbar to open the Prompt Manager
3. Right-click on any webpage to access the context menu with your prompts

## 📖 How to Use

### Managing Prompts

#### Opening the Prompt Manager
- Click the "Prompt Saver" extension icon in your Chrome toolbar
- This opens the options page where you can manage all your prompts

#### Adding a New Prompt
1. In the Prompt Manager, fill in the "Title" field with a descriptive name
2. Enter your prompt text in the "Prompt Text" textarea
3. Click "Add Prompt" to save it

#### Editing an Existing Prompt
1. Click the "Edit" button next to any prompt in the list
2. The prompt data will load into the input fields
3. Make your changes
4. Click "Update Prompt" to save changes
5. Click "Cancel" to discard changes

#### Deleting a Prompt
- Click the "Delete" button next to any prompt in the list
- The prompt will be immediately removed

#### Loading Prompt into Form
- Click anywhere on a prompt's content area to load it into the input fields
- This is useful for creating variations of existing prompts

### Using Prompts

#### Via Context Menu
1. Right-click on any webpage or editable field
2. Select **Prompt List** and choose a prompt
3. The prompt will be directly inserted into the active input or textarea

#### Via Prompt Manager
1. Open the Prompt Manager
2. Click on any prompt's content to load it into the form fields
3. Copy the text from the textarea as needed

### Default Prompts

The extension comes with 10 pre-built prompt templates:

1. **Summarize Text** - Provide concise summaries of any text
2. **Translate Text** - Translate text into a specified language
3. **Explain Concept** - Clarify concepts with definitions and examples
4. **Brainstorm Ideas** - Generate creative ideas with pros and cons
5. **Improve Writing** - Enhance clarity, style, and tone of text
6. **Plan Project** - Outline project plans with goals and milestones
7. **Study Guide** - Create structured study notes and practice questions
8. **Q&A Session** - Provide detailed answers with explanations
9. **Reality Filter** - Ensure factual accuracy and label unverified content
10. **Write Email** - Generate professional emails using placeholders

#### Reset to Defaults
- Click the "Reset to Defaults" button in the Prompt Manager
- This will replace all current prompts with the default set
- **Warning**: This action cannot be undone

## 🛠️ Technical Details

### File Structure
```
promt-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for context menus
├── content.js            # Content script (currently empty)
├── options.html          # Prompt manager UI
├── options.js            # Prompt manager functionality
└── README.md             # This file
```

### Permissions Used
- `storage` - For saving prompts locally
- `contextMenus` - For right-click menu integration
- `scripting` - For potential future content script features
- `clipboardWrite` - For copying prompts to clipboard
- `<all_urls>` - For context menu access on all websites

### Data Storage
- All prompts are stored locally using Chrome's `chrome.storage.local` API
- Data persists across browser sessions
- No data is sent to external servers

## 🎨 Customization

### Adding Your Own Prompts
The extension is designed to be flexible. You can create prompts for:
- Text summarization and translation
- Concept explanations and brainstorming
- Writing improvement and documentation
- Project planning and study guides
- Email and communication templates
- Any repetitive text you use frequently

### Modifying Default Prompts
You can edit the default prompts in `options.js` and `background.js` by modifying the `defaultPrompts` array.

## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript, HTML, and CSS
- Chrome browser with Developer mode enabled

### Making Changes
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

### Key Components
- **background.js**: Handles context menu creation and prompt management
- **options.js**: Manages the UI interactions and prompt CRUD operations
- **options.html**: The main interface with styling

## 🐛 Troubleshooting

### Extension Not Working
1. Check that the extension is enabled in `chrome://extensions/`
2. Try refreshing the extension
3. Check the browser console for error messages

### Context Menu Not Appearing
1. Make sure you have the latest version of Chrome
2. Try refreshing the page where you're testing
3. Check if the extension has proper permissions

### Prompts Not Saving
1. Check browser storage permissions
2. Make sure you're not in incognito mode (unless extension is enabled for incognito)

## 📝 License

This project is open source. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions:
1. Check this README for common solutions
2. Look at the browser console for error messages
3. Create an issue in the project repository

---

**Version**: 1.0  
**Last Updated**: August 2025
