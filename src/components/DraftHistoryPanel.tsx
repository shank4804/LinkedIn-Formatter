import { useState } from 'react';

import type { DraftSnapshot } from '../lib/storage';

interface DraftHistoryPanelProps {
  drafts: DraftSnapshot[];
  onDelete: (id: string) => void;
  onRestore: (draft: DraftSnapshot) => void;
  onSave: (title: string) => void;
}

export function DraftHistoryPanel({ drafts, onDelete, onRestore, onSave }: DraftHistoryPanelProps) {
  const [title, setTitle] = useState('');

  function handleSave() {
    const trimmed = title.trim();

    if (!trimmed) {
      return;
    }

    onSave(trimmed);
    setTitle('');
  }

  return (
    <details className="draft-history-panel">
      <summary>Saved drafts</summary>
      <div className="draft-history-actions">
        <label className="draft-title-field">
          <span>Snapshot name</span>
          <input
            type="text"
            value={title}
            placeholder={`Draft ${new Date().toLocaleDateString()}`}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <button type="button" className="secondary-action" onClick={handleSave}>
          Save snapshot
        </button>
        <span>{drafts.length} / 10 saved</span>
      </div>
      {drafts.length ? (
        <ul className="draft-list">
          {drafts.map((draft) => (
            <li key={draft.id} className="draft-item">
              <div>
                <strong>{draft.title}</strong>
                <span>
                  {draft.characterCount.toLocaleString()} chars · {new Date(draft.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="draft-item-actions">
                <button type="button" onClick={() => onRestore(draft)}>
                  Restore
                </button>
                <button type="button" onClick={() => onDelete(draft.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="draft-empty">No saved snapshots yet.</p>
      )}
    </details>
  );
}
