import type { EditorNode } from './exportLinkedInText';

const DRAFT_STORAGE_KEY = 'linkedin-format:draft-v1';

interface LoadDraftResult {
  document: EditorNode | null;
  error: string | null;
}

interface SaveDraftResult {
  ok: boolean;
  message: string;
}

export function loadDraft(): LoadDraftResult {
  if (!canUseStorage()) {
    return { document: null, error: null };
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!raw) {
      return { document: null, error: null };
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!isEditorNode(parsed)) {
      return { document: null, error: 'Stored draft could not be read, so the sample draft was restored.' };
    }

    return { document: parsed, error: null };
  } catch {
    return { document: null, error: 'Stored draft could not be read, so the sample draft was restored.' };
  }
}

export function saveDraft(document: EditorNode): SaveDraftResult {
  if (!canUseStorage()) {
    return { ok: false, message: 'Draft autosave is unavailable in this browser context.' };
  }

  try {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(document));
    return { ok: true, message: 'Draft saved.' };
  } catch {
    return { ok: false, message: 'Draft autosave failed. Your content is still in the editor.' };
  }
}

export function clearDraft(): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Reset should keep working even when storage is blocked.
  }
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isEditorNode(value: unknown): value is EditorNode {
  return typeof value === 'object' && value !== null && 'type' in value;
}