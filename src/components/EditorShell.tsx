import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { LINKEDIN_POST_CHARACTER_LIMIT } from '../lib/constants';
import type { EditorNode } from '../lib/exportLinkedInText';
import { looksLikeMarkdown, markdownToTipTap } from '../lib/markdownToTipTap';
import type { FeedPreviewMode } from '../lib/feedPreview';
import { Toolbar } from './Toolbar';

interface EditorShellProps {
  feedPreviewMode: FeedPreviewMode | null;
  initialContent: EditorNode;
  onFeedPreviewModeChange: (mode: FeedPreviewMode | null) => void;
  onDocumentChange: (document: EditorNode) => void;
  onReset: () => void;
}

const extensions = [
  StarterKit.configure({
    codeBlock: false,
    heading: {
      levels: [2, 3],
    },
  }),
  Underline,
  Link.configure({
    autolink: true,
    defaultProtocol: 'https',
    openOnClick: true,
    HTMLAttributes: {
      target: '_blank',
      rel: 'noopener noreferrer nofollow',
      title: 'Click to open. Use the Link toolbar button to edit.',
    },
  }),
  Placeholder.configure({
    placeholder: 'Paste or write your LinkedIn post draft...',
  }),
  CharacterCount.configure({
    limit: LINKEDIN_POST_CHARACTER_LIMIT,
  }),
];

export function EditorShell({
  feedPreviewMode,
  initialContent,
  onDocumentChange,
  onFeedPreviewModeChange,
  onReset,
}: EditorShellProps) {
  const editor = useEditor({
    extensions,
    content: initialContent as JSONContent,
    editorProps: {
      attributes: {
        'aria-label': 'LinkedIn post draft editor',
        class: 'rich-editor-content',
      },
      transformPastedHTML(html) {
        return html
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<table[\s\S]*?<\/table>/gi, '')
          .replace(/<img[^>]*>/gi, '');
      },
      handlePaste(view, event) {
        const plainText = event.clipboardData?.getData('text/plain') ?? '';

        if (!plainText || !looksLikeMarkdown(plainText)) {
          return false;
        }

        const parsedDocument = markdownToTipTap(plainText);
        const schemaNode = view.state.schema.nodeFromJSON(parsedDocument);
        const transaction = view.state.tr.replaceSelectionWith(schemaNode, false).scrollIntoView();
        view.dispatch(transaction);
        return true;
      },
    },
    immediatelyRender: false,
    onCreate({ editor: currentEditor }) {
      onDocumentChange(currentEditor.getJSON() as EditorNode);
    },
    onUpdate({ editor: currentEditor }) {
      onDocumentChange(currentEditor.getJSON() as EditorNode);
    },
  });

  return (
    <div className="editor-shell">
      <Toolbar editor={editor} onReset={onReset} />
      <div className="editor-preview-controls" aria-label="Editor preview width">
        <span>View</span>
        <PreviewModeButton active={feedPreviewMode === null} label="Editor" onClick={() => onFeedPreviewModeChange(null)} />
        <PreviewModeButton active={feedPreviewMode === 'desktop'} label="Desktop" onClick={() => onFeedPreviewModeChange('desktop')} />
        <PreviewModeButton active={feedPreviewMode === 'mobile'} label="Mobile" onClick={() => onFeedPreviewModeChange('mobile')} />
      </div>
      <div className={`editor-frame${feedPreviewMode ? ` is-feed-preview is-${feedPreviewMode}` : ''}`}>
        {feedPreviewMode ? (
          <div className="feed-editor-card">
            <FeedEditorHeader />
            <EditorContent editor={editor} />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
}

interface PreviewModeButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function PreviewModeButton({ active, label, onClick }: PreviewModeButtonProps) {
  return (
    <button type="button" className={`preview-toggle${active ? ' is-active' : ''}`} aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );
}

function FeedEditorHeader() {
  return (
    <div className="feed-preview-header">
      <div className="feed-avatar" aria-hidden="true">in</div>
      <div>
        <p className="feed-author">LinkedIn Post Formatter</p>
        <p className="feed-meta">Now · Public</p>
      </div>
    </div>
  );
}