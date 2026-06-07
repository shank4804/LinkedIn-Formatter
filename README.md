# LinkedIn Post Formatter

A client-side formatter for drafting LinkedIn posts with familiar rich text controls and copying LinkedIn-ready plain text. The editor uses TipTap for word-processor-style selection behavior, then exports bold, italic, code, lists, and links into plain text that can be pasted into LinkedIn.

This is not an official LinkedIn app and does not post to LinkedIn directly. All draft content stays in the browser.

## Features

- TipTap rich text editor with toolbar controls and keyboard shortcuts.
- Sans-serif Unicode bold, italic, bold italic, code, and experimental strikethrough export.
- Flat bullet and numbered lists for LinkedIn-friendly paste behavior.
- Links export as readable label plus URL, for example `Read more (https://example.com)`.
- Hashtags and mentions remain plain text so LinkedIn has the best chance to recognize them.
- Live plain-text preview and 3,000-character LinkedIn post counter.
- One-click copy with a fallback for browsers that block the Clipboard API.
- Local draft autosave with reset/recovery behavior.
- GitHub Actions workflow for GitHub Pages deployment.

## Local Development

```bash
npm install
npm run dev
```

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages Deployment

The workflow in `.github/workflows/pages.yml` builds the app and deploys `dist` to GitHub Pages on pushes to `main`.

In the repository settings, set Pages source to **GitHub Actions**. The workflow passes `VITE_BASE_PATH` as `/${{ github.event.repository.name }}/`, which matches the standard project Pages URL path. For a custom domain, set `VITE_BASE_PATH` to `/` in the workflow.

## LinkedIn Formatting Limits

LinkedIn feed posts are plain text. Pasted HTML, Markdown, and CSS font choices are not reliably preserved, so this app uses sans-serif Unicode characters for visual styling. That means formatting is visual rather than semantic, and assistive technologies may not announce it as bold or italic. LinkedIn still controls the final post font after paste.

The character counter is based on the exported clipboard text and uses a 3,000-character feed post limit. LinkedIn can change limits or count edge-case Unicode differently, so paste into LinkedIn before publishing high-stakes posts.

## MVP Scope

Supported now: paragraphs, hard breaks, bold, italic, code, strikethrough, flat bullets, flat numbered lists, links, hashtags, mentions, local autosave, and copy.

Deferred intentionally: nested lists, blockquotes, underline, horizontal dividers, real LinkedIn entity mentions, direct posting, analytics, and server-side storage.