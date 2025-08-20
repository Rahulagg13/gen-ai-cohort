# Notebook LLM Chat App

A modern chat application built with Next.js, React, and TypeScript, featuring PDF upload, context-aware LLM responses, and a beautiful UI.

## Demo Video

Watch a quick demo of Notebook LLM Chat App:

[Video Link](https://drive.google.com/file/d/1xqboisVfOVrbp1zVnNpQBu8TxyeaBBAu/view?usp=sharing)

## Features

- Chat with an AI assistant using context from uploaded PDF files or links
- Upload PDF documents to provide context for your queries
- Real-time chat interface with typing indicator and message history
- Context-aware responses powered by LLMs (Gemini, etc.)
- Modern, responsive UI built with custom components
- Clear chat functionality

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

```bash
pnpm install
```

### Running Locally

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Support

A `docker-compose.yml` is provided for running services locally.

## Project Structure

```
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/           # API routes (response, upload-file, upload-link)
│   │   └── ...
│   ├── components/        # UI and chat components
│   ├── context/           # Message context provider
│   └── lib/               # Utility functions
├── package.json           # Project metadata and scripts
├── docker-compose.yml     # Docker configuration
├── README.md              # Project documentation
└── ...
```

## API Endpoints

- `/api/response` — Handles chat responses from the LLM
- `/api/upload-file` — Upload PDF files for context
- `/api/upload-link` — Upload links for context

## Technologies Used

- Next.js
- React
- TypeScript
- @tanstack/react-query
- Axios
- Custom UI components

## Contributing

Pull requests and issues are welcome! Please open an issue to discuss major changes.

## License

MIT

---

Made with ❤️ by Rahul Aggarwal
