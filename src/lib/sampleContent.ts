import type { EditorNode } from './exportLinkedInText';

export const SAMPLE_DOCUMENT: EditorNode = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Post draft', marks: [{ type: 'bold' }] }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Paste your rough idea here, then use the toolbar to shape it for LinkedIn.' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Bold and italic survive as Unicode text.' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Flat lists become plain bullet lines.' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Links export with their URL visible.' }] }] },
      ],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '#LinkedIn #Writing' }],
    },
  ],
};