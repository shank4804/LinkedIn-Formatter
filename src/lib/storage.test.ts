import { beforeEach, describe, expect, it } from 'vitest';

import type { EditorNode } from './exportLinkedInText';
import { deleteDraftSnapshot, loadDraftHistory, saveDraftSnapshot } from './storage';

const document: EditorNode = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Draft' }] }] };

describe('draft history storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and loads draft snapshots newest first', () => {
    const first = saveDraftSnapshot(document, 'First', 5);
    const second = saveDraftSnapshot(document, 'Second', 6);
    const drafts = loadDraftHistory();

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(drafts).toHaveLength(2);
    expect(drafts[0].title).toBe('Second');
    expect(drafts[1].title).toBe('First');
  });

  it('deletes a saved draft snapshot', () => {
    const saved = saveDraftSnapshot(document, 'Delete me', 9);
    const id = saved.draft?.id ?? '';

    expect(deleteDraftSnapshot(id).ok).toBe(true);
    expect(loadDraftHistory()).toEqual([]);
  });

  it('limits history to ten saved drafts', () => {
    for (let index = 0; index < 12; index += 1) {
      saveDraftSnapshot(document, `Draft ${index}`, index);
    }

    expect(loadDraftHistory()).toHaveLength(10);
  });
});
