# StillRoot

<div align="center">

**AI-Powered Conversational Note-Taking Application**

[🌐 Live Demo](https://stillroot.app) • [📖 Documentation](#) • [🐛 Report Bug](https://github.com/Peiiii/stillroot/issues) • [💡 Request Feature](https://github.com/Peiiii/stillroot/issues)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

---

## ✨ Overview

**StillRoot** is a modern, AI-powered note-taking application that transforms the way you capture, organize, and interact with your thoughts. Built with a conversational interface inspired by messaging apps, it eliminates the friction of traditional note-taking tools and makes knowledge management feel natural and effortless.

### 🎯 Key Features

- **💬 Conversational Interface** - Record notes through a chat-like interface, just like messaging yourself or an AI assistant
- **📁 Channel System** - Organize notes into themed channels (e.g., #work-log, #reading-notes, #ideas)
- **🤖 AI Assistant** - Get summaries, translations, formatting help, and creative inspiration from your AI companion
- **🧵 Thread Discussions** - Reply to notes to create threaded conversations and deeper discussions
- **🏷️ Tag System** - Use `#tags` to organize and categorize your notes automatically
- **📱 Cross-Platform** - Progressive Web App (PWA) that works seamlessly on desktop and mobile
- **🌍 Internationalization** - Support for multiple languages (English, Chinese, and more)
- **🎨 Rich Editor** - Markdown support, code blocks, math equations, tables, and more
- **🔍 Smart Search** - Full-text search across all your notes with instant results
- **📊 Multiple Views** - Timeline, board, mindmap, and calendar views for different perspectives

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Peiiii/stillroot.git
cd stillroot

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development (web + local workers)
pnpm dev
```

Visit the printed local URL to see the application.

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Configuration (Optional)
VITE_OPENAI_API_KEY=your_openai_key
VITE_DASHSCOPE_API_KEY=your_dashscope_key

# GitHub Integration (Optional)
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret

# Feedback Space URL (Optional)
VITE_FEEDBACK_SPACE_URL=your_feedback_space_url
```

## 🛠️ Tech Stack

### Core Technologies

- **[React 19](https://react.dev/)** - Modern UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Router](https://reactrouter.com/)** - Client-side routing

### UI Components

- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### Rich Text Editing

- **[TipTap](https://tiptap.dev/)** - Headless rich text editor
- **[Marked](https://marked.js.org/)** - Markdown parser
- **[KaTeX](https://katex.org/)** - Math rendering
- **[Mermaid](https://mermaid.js.org/)** - Diagram rendering

### Data & AI

- **[Firebase](https://firebase.google.com/)** - Backend services (Auth, Firestore)
- **[OpenAI SDK](https://sdk.vercel.ai/)** - AI integration
- **[RxJS](https://rxjs.dev/)** - Reactive programming

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript-specific linting

## 📁 Project Structure

```
StillRoot/
├── src/
│   ├── common/              # Shared components and utilities
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Libraries and utilities
│   │   └── config/          # Configuration files
│   ├── core/                # Core application logic
│   │   ├── stores/          # Zustand state stores
│   │   ├── services/        # Business logic services
│   │   └── hooks/           # Core hooks
│   ├── desktop/             # Desktop-specific features
│   ├── mobile/              # Mobile-specific features
│   └── main.tsx             # Application entry point
├── docs/                    # Documentation
├── memory-bank/             # Project knowledge base
└── public/                  # Static assets
```

## 🔌 API

- StillRoot API v1 (OpenAPI): `docs/api/stillroot-api.v1.openapi.yaml`
- Backend Worker: `workers/app-api`

## 🎨 Features in Detail

### Conversational Note-Taking

Write notes as if you're chatting with yourself or an AI assistant. No more blank page anxiety - just start typing and send.

### Channel Organization

Create channels for different topics:
- `#work-log` - Daily work notes
- `#reading-notes` - Book summaries and insights
- `#ideas` - Creative thoughts and inspirations
- `#meetings` - Meeting notes and action items

### AI-Powered Assistance

- **Summarize** long conversations or documents
- **Translate** content between languages
- **Format** text into structured formats
- **Generate** ideas and creative suggestions
- **Answer** questions based on your notes

### Thread Discussions

Reply to any note to create threaded conversations, perfect for:
- Following up on ideas
- Adding context or corrections
- Collaborative discussions
- Building on previous thoughts

### Smart Tagging

Use `#tags` in your notes for automatic organization:
- `#todo` - Action items
- `#idea` - Creative concepts
- `#important` - Key information
- `#project-name` - Project-specific notes

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Deployment
pnpm deploy           # Deploy to OSS
pnpm deploy:pages     # Deploy to GitHub Pages
```

### Code Style

This project follows strict code style guidelines:

- **No `any` types** - Use proper TypeScript types
- **English only** - All code, comments, and UI text in English
- **No comments** - Self-documenting code (unless explicitly requested)
- **Kebab-case** - File and directory naming
- **PascalCase** - Component naming
- **Absolute imports** - Use `@/` path aliases

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and architecture
- Write self-documenting code
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [Firebase](https://firebase.google.com/) and [OpenAI](https://openai.com/)

## 📧 Contact

- **Website**: [stillroot.app](https://stillroot.app)
- **GitHub**: [@Peiiii](https://github.com/Peiiii)
- **Issues**: [GitHub Issues](https://github.com/Peiiii/stillroot/issues)

---

<div align="center">

Made with ❤️ by the StillRoot team

⭐ Star this repo if you find it helpful!

</div>
