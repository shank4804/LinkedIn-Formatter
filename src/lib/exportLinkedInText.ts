import { LINKEDIN_POST_CHARACTER_LIMIT, getCharacterCountStatus } from './constants';
import { type UnicodeStyleOptions, styleText } from './unicodeStyles';

export interface EditorMark {
  type?: string;
  attrs?: Record<string, unknown>;
}

export interface EditorNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: EditorMark[];
  content?: EditorNode[];
}

export function exportLinkedInText(document: EditorNode | null | undefined): string {
  if (!document) {
    return '';
  }

  const blocks = document.type === 'doc' ? document.content ?? [] : [document];
  return renderBlocks(blocks).trim();
}

export function countLinkedInCharacters(text: string): number {
  return Array.from(text.normalize('NFC')).length;
}

export function getLinkedInCharacterStatus(text: string) {
  return getCharacterCountStatus(countLinkedInCharacters(text));
}

export function getLinkedInCharacterSummary(text: string) {
  const count = countLinkedInCharacters(text);

  return {
    count,
    limit: LINKEDIN_POST_CHARACTER_LIMIT,
    remaining: LINKEDIN_POST_CHARACTER_LIMIT - count,
    status: getCharacterCountStatus(count),
  };
}

function renderBlocks(nodes: EditorNode[]): string {
  return nodes
    .map((node) => renderBlock(node))
    .filter((text) => text.length > 0)
    .join('\n\n');
}

function renderBlock(node: EditorNode): string {
  switch (node.type) {
    case 'doc':
      return renderBlocks(node.content ?? []);
    case 'paragraph':
    case 'heading':
      return renderInline(node.content ?? []);
    case 'bulletList':
      return renderList(node, 'bullet');
    case 'orderedList':
      return renderList(node, 'ordered');
    case 'listItem':
      return renderListItemLines(node).join('\n');
    case 'text':
      return renderTextNode(node);
    case 'hardBreak':
      return '\n';
    default:
      return node.content ? renderBlocks(node.content) : '';
  }
}

function renderInline(nodes: EditorNode[]): string {
  return nodes.map((node) => renderInlineNode(node)).join('');
}

function renderInlineNode(node: EditorNode): string {
  if (node.type === 'text') {
    return renderTextNode(node);
  }

  if (node.type === 'hardBreak') {
    return '\n';
  }

  return node.content ? renderInline(node.content) : '';
}

function renderTextNode(node: EditorNode): string {
  const text = node.text ?? '';
  const marks = node.marks ?? [];
  const href = getLinkHref(marks);
  const styledText = styleText(text, getStyleOptions(marks));

  if (!href) {
    return styledText;
  }

  if (text.trim() === href) {
    return href;
  }

  return `${styledText} (${href})`;
}

function renderList(node: EditorNode, kind: 'bullet' | 'ordered'): string {
  let orderedIndex = getOrderedStart(node);
  const lines: string[] = [];

  for (const item of node.content ?? []) {
    if (item.type !== 'listItem') {
      continue;
    }

    const itemLines = renderListItemLines(item);
    const firstLine = itemLines.shift() ?? '';
    const prefix = kind === 'bullet' ? '• ' : `${orderedIndex}. `;
    lines.push(`${prefix}${firstLine}`.trimEnd());
    lines.push(...itemLines);
    orderedIndex += 1;
  }

  return lines.join('\n');
}

function renderListItemLines(node: EditorNode): string[] {
  const leadParts: string[] = [];
  const extraLines: string[] = [];

  for (const child of node.content ?? []) {
    if (child.type === 'paragraph' || child.type === 'heading') {
      const text = renderInline(child.content ?? []).trim();

      if (text) {
        leadParts.push(text);
      }
    } else if (child.type === 'bulletList') {
      extraLines.push(...renderList(child, 'bullet').split('\n').filter(Boolean));
    } else if (child.type === 'orderedList') {
      extraLines.push(...renderList(child, 'ordered').split('\n').filter(Boolean));
    } else {
      const text = renderBlock(child).trim();

      if (text) {
        leadParts.push(text);
      }
    }
  }

  return [leadParts.join(' '), ...extraLines].filter((line) => line.length > 0);
}

function getStyleOptions(marks: EditorMark[]): UnicodeStyleOptions {
  return {
    bold: marks.some((mark) => mark.type === 'bold'),
    italic: marks.some((mark) => mark.type === 'italic'),
    code: marks.some((mark) => mark.type === 'code'),
    strike: marks.some((mark) => mark.type === 'strike'),
  };
}

function getLinkHref(marks: EditorMark[]): string | null {
  const link = marks.find((mark) => mark.type === 'link');
  const href = link?.attrs?.href;

  return typeof href === 'string' && href.trim() ? href.trim() : null;
}

function getOrderedStart(node: EditorNode): number {
  const start = node.attrs?.start;

  return typeof start === 'number' && Number.isFinite(start) ? start : 1;
}