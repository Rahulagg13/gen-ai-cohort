# Custom Tokenizer

![Custom Tokenizer Demo](/public/custom-tokenizer.png)

## What is a Token?

In the context of **Generative AI**, a **token** is a small chunk of text that the model reads or writes at a time.

Different AI models break text into tokens in different ways — sometimes by words, sometimes by subwords, or even by characters. Tokens are essentially the **encoded representation** of text that the model processes.

**Example:**

Sentence:

```text
Taj Mahal is a part of Seven wonders of the world
```

When converted into tokens (example token IDs):

```
[51, 1255, 162826, 382, 261, 997, 328, 49382, 6391, 328, 2375]
```

## What is Tokenization?

**Tokenization** is the process of converting text into tokens using a specific method or tokenizer.
This step is essential before text can be processed by an AI model.

## Context: Changes in `src/app/page.tsx`

- The file serves as the main page component for the Next.js app.
- The page layout includes a header, main content area, and footer.
- The main content area displays a title, description.
- Styling is applied using Tailwind CSS classes.
- The page is structured to provide a clean UI for interacting with the custom tokenizer functionality.
---

## How to Run This Repo Locally

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start the development server:**

   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to view the app.

---
