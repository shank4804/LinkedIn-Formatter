import type { EditorMark, EditorNode } from './exportLinkedInText';

const HORIZONTAL_RULE_PATTERN = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const BULLET_PATTERN = /^\s*[-+*]\s+(.+)$/;
const ORDERED_PATTERN = /^\s*(\d+)\.\s+(.+)$/;
const BLOCKQUOTE_PATTERN = /^\s*>\s?(.*)$/;

export function looksLikeMarkdown(text: string): boolean {
  return /(^\s{0,3}([-+*]|\d+\.|>)\s+|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|~~[^~]+~~|__[^_]+__|^\s{0,3}[-*_]{3,}\s*$)/m.test(text);
}

export function markdownToTipTap(markdown: string): EditorNode {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const content: EditorNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (HORIZONTAL_RULE_PATTERN.test(line)) {
      content.push({ type: 'horizontalRule' });
      index += 1;
      continue;
    }

    const bulletMatch = line.match(BULLET_PATTERN);

    if (bulletMatch) {
      const items: EditorNode[] = [];

      while (index < lines.length) {
        const itemMatch = lines[index].match(BULLET_PATTERN);

        if (!itemMatch) {
          break;
        }

        items.push(listItem(itemMatch[1]));
        index += 1;
      }

      content.push({ type: 'bulletList', content: items });
      continue;
    }

    const orderedMatch = line.match(ORDERED_PATTERN);

    if (orderedMatch) {
      const start = Number.parseInt(orderedMatch[1], 10);
      const items: EditorNode[] = [];

      while (index < lines.length) {
        const itemMatch = lines[index].match(ORDERED_PATTERN);

        if (!itemMatch) {
          break;
        }

        items.push(listItem(itemMatch[2]));
        index += 1;
      }

      content.push({ type: 'orderedList', attrs: { start }, content: items });
      continue;
    }

    const quoteMatch = line.match(BLOCKQUOTE_PATTERN);

    if (quoteMatch) {
      const quoteLines: string[] = [];

      while (index < lines.length) {
        const itemMatch = lines[index].match(BLOCKQUOTE_PATTERN);

        if (!itemMatch) {
          break;
        }

        quoteLines.push(itemMatch[1]);
        index += 1;
      }

      content.push({ type: 'blockquote', content: quoteLines.map((quoteLine) => paragraph(quoteLine)) });
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    content.push(paragraph(paragraphLines.join(' ')));
  }

  return { type: 'doc', content };
}

function isBlockStart(line: string): boolean {
  return HORIZONTAL_RULE_PATTERN.test(line) || BULLET_PATTERN.test(line) || ORDERED_PATTERN.test(line) || BLOCKQUOTE_PATTERN.test(line);
}

function listItem(text: string): EditorNode {
  return { type: 'listItem', content: [paragraph(text)] };
}

function paragraph(text: string): EditorNode {
  return { type: 'paragraph', content: parseInlineMarks(text) };
}

function parseInlineMarks(text: string): EditorNode[] {
  const nodes: EditorNode[] = [];
  const tokenPattern = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|~~[^~]+~~|__[^_]+__|\*[^*]+\*)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(textNode(text.slice(lastIndex, index)));
    }

    nodes.push(parseToken(match[0]));
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(textNode(text.slice(lastIndex)));
  }

  return nodes.length ? nodes : [textNode(text)];
}

function parseToken(token: string): EditorNode {
  const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

  if (linkMatch) {
    return textNode(linkMatch[1], [{ type: 'link', attrs: { href: normalizeHref(linkMatch[2]) } }]);
  }

  if (token.startsWith('**') && token.endsWith('**')) {
    return textNode(token.slice(2, -2), [{ type: 'bold' }]);
  }

  if (token.startsWith('__') && token.endsWith('__')) {
    return textNode(token.slice(2, -2), [{ type: 'underline' }]);
  }

  if (token.startsWith('~~') && token.endsWith('~~')) {
    return textNode(token.slice(2, -2), [{ type: 'strike' }]);
  }

  if (token.startsWith('`') && token.endsWith('`')) {
    return textNode(token.slice(1, -1), [{ type: 'code' }]);
  }

  if (token.startsWith('*') && token.endsWith('*')) {
    return textNode(token.slice(1, -1), [{ type: 'italic' }]);
  }

  return textNode(token);
}

function normalizeHref(href: string): string {
  const trimmed = href.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function textNode(text: string, marks?: EditorMark[]): EditorNode {
  return marks?.length ? { type: 'text', text, marks } : { type: 'text', text };
}
