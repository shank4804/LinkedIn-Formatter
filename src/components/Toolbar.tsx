import type { Editor } from '@tiptap/react';
import { Bold, Code2, Italic, Link2, List, ListOrdered, Redo2, Strikethrough, Trash2, Undo2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onReset: () => void;
}

interface ToolButtonProps {
  label: string;
  shortcut?: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function Toolbar({ editor, onReset }: ToolbarProps) {
  function run(command: () => boolean) {
    if (!editor) {
      return;
    }

    command();
  }

  function toggleLink() {
    if (!editor) {
      return;
    }

    const existingHref = editor.getAttributes('link').href as string | undefined;
    const value = window.prompt('Paste a URL for the selected text. Leave empty to remove the link.', existingHref ?? 'https://');

    if (value === null) {
      return;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    const href = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  }

  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting toolbar">
      <div className="toolbar-group" aria-label="History">
        <ToolButton
          label="Undo"
          shortcut="Ctrl+Z"
          icon={Undo2}
          disabled={!editor?.can().undo()}
          onClick={() => run(() => editor!.chain().focus().undo().run())}
        />
        <ToolButton
          label="Redo"
          shortcut="Ctrl+Y"
          icon={Redo2}
          disabled={!editor?.can().redo()}
          onClick={() => run(() => editor!.chain().focus().redo().run())}
        />
      </div>

      <div className="toolbar-group" aria-label="Inline styles">
        <ToolButton
          label="Bold"
          shortcut="Ctrl+B"
          icon={Bold}
          active={editor?.isActive('bold') ?? false}
          disabled={!editor}
          onClick={() => run(() => editor!.chain().focus().toggleBold().run())}
        />
        <ToolButton
          label="Italic"
          shortcut="Ctrl+I"
          icon={Italic}
          active={editor?.isActive('italic') ?? false}
          disabled={!editor}
          onClick={() => run(() => editor!.chain().focus().toggleItalic().run())}
        />
        <ToolButton
          label="Code"
          icon={Code2}
          active={editor?.isActive('code') ?? false}
          disabled={!editor}
          onClick={() => run(() => editor!.chain().focus().toggleCode().run())}
        />
        <ToolButton
          label="Strikethrough"
          icon={Strikethrough}
          active={editor?.isActive('strike') ?? false}
          disabled={!editor}
          onClick={() => run(() => editor!.chain().focus().toggleStrike().run())}
        />
        <ToolButton label="Link" icon={Link2} active={editor?.isActive('link') ?? false} disabled={!editor} onClick={toggleLink} />
      </div>

      <div className="toolbar-group" aria-label="Lists">
        <ToolButton
          label="Bulleted list"
          icon={List}
          active={editor?.isActive('bulletList') ?? false}
          disabled={!editor}
          onClick={() => run(() => editor!.chain().focus().toggleBulletList().run())}
        />
        <ToolButton
          label="Numbered list"
          icon={ListOrdered}
          active={editor?.isActive('orderedList') ?? false}
          disabled={!editor}
          onClick={() => run(() => editor!.chain().focus().toggleOrderedList().run())}
        />
      </div>

      <div className="toolbar-group toolbar-group-push" aria-label="Draft actions">
        <ToolButton label="Reset draft" icon={Trash2} disabled={!editor} onClick={onReset} />
      </div>
    </div>
  );
}

function ToolButton({ label, shortcut, icon: Icon, active, disabled, onClick }: ToolButtonProps) {
  const title = shortcut ? `${label} (${shortcut})` : label;
  const buttonContent = <Icon aria-hidden="true" size={18} strokeWidth={2.2} />;

  if (active === true) {
    return (
      <button
        type="button"
        className="tool-button is-active"
        aria-label={title}
        aria-pressed="true"
        disabled={disabled}
        title={title}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
      >
        {buttonContent}
      </button>
    );
  }

  if (active === false) {
    return (
      <button
        type="button"
        className="tool-button"
        aria-label={title}
        aria-pressed="false"
        disabled={disabled}
        title={title}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="tool-button"
      aria-label={title}
      disabled={disabled}
      title={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
}