# Fairy ✨

A frontend-only static app that mimics modern LLM chatbots (like ChatGPT) with hard-coded responses and funny, self-aware interactions. Meet **Fairy** - the AI assistant that's refreshingly honest about not being AI at all!

## Tech Stack

- **Svelte 5** - Modern reactive framework
- **SvelteKit** - Full-stack framework
- **Vite** - Fast build tool
- **Vercel** - Deployment platform

## Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment

This project is configured to deploy on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect SvelteKit and deploy

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Features

- 🎨 **ChatGPT-style UI** - Modern, dark-themed interface with smooth animations
- 💬 **Multiple Chat Sessions** - Create and switch between different conversations
- 📋 **Sidebar Navigation** - Chat history and menu items, just like the real thing
- 🧚 **Meet Fairy** - Your self-aware "AI" assistant powered by JavaScript if-statements
- ✨ **Smooth Animations** - Typing indicators, message transitions, and hover effects
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🎭 **Educational Content** - Menu items with thoughtful commentary on AI, energy use, and societal effects

## Project Structure

```
src/
├── routes/
│   ├── +layout.js       # Static site configuration
│   └── +page.svelte     # Main app layout
├── lib/
│   ├── components/
│   │   ├── ChatInterface.svelte  # Main chat area
│   │   ├── Sidebar.svelte        # Left sidebar with chats & menu
│   │   ├── Message.svelte        # Individual message component
│   │   └── Modal.svelte          # Modal for menu content
│   ├── stores/
│   │   └── chatStore.js          # Svelte store for chat state
│   └── data/
│       ├── responses.js          # Hard-coded funny responses
│       └── menuContent.js        # Content for menu items
└── app.html                      # HTML template
```

