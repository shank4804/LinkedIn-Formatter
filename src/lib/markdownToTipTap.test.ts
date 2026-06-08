import { describe, expect, it } from 'vitest';

import { looksLikeMarkdown, markdownToTipTap } from './markdownToTipTap';

describe('looksLikeMarkdown', () => {
  it('detects common markdown markers', () => {
    expect(looksLikeMarkdown('A **bold** move')).toBe(true);
    expect(looksLikeMarkdown('- item')).toBe(true);
    expect(looksLikeMarkdown('[link](example.com)')).toBe(true);
  });

  it('does not treat plain prose as markdown', () => {
    expect(looksLikeMarkdown('Just a normal LinkedIn post.')).toBe(false);
  });
});

describe('markdownToTipTap', () => {
  it('converts inline marks and links', () => {
    expect(markdownToTipTap('**Bold**, *italic*, __underline__, ~~strike~~, `code`, [site](example.com)')).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'underline', marks: [{ type: 'underline' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'strike', marks: [{ type: 'strike' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'code', marks: [{ type: 'code' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'site', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
          ],
        },
      ],
    });
  });

  it('converts lists, blockquotes, and horizontal rules', () => {
    expect(markdownToTipTap('- First\n- Second\n\n1. One\n2. Two\n\n> Quote\n---')).toEqual({
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'First' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Second' }] }] },
          ],
        },
        {
          type: 'orderedList',
          attrs: { start: 1 },
          content: [
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'One' }] }] },
            { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Two' }] }] },
          ],
        },
        {
          type: 'blockquote',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Quote' }] }],
        },
        { type: 'horizontalRule' },
      ],
    });
  });
});
