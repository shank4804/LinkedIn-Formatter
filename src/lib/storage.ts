import type { EditorNode } from './exportLinkedInText';

const DRAFT_STORAGE_KEY = 'linkedin-format:draft-v1';
const DRAFT_HISTORY_KEY = 'linkedin-format:draft-history-v1';
const MAX_DRAFT_HISTORY = 10;

export interface DraftSnapshot {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  characterCount: number;
  document: EditorNode;
}

interface LoadDraftResult {
  document: EditorNode | null;
  error: string | null;
}

interface SaveDraftResult {
  ok: boolean;
  message: string;
}

interface SaveDraftSnapshotResult extends SaveDraftResult {
  draft?: DraftSnapshot;
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

export function loadDraftHistory(): DraftSnapshot[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isDraftSnapshot).sort((left, right) => right.updatedAt - left.updatedAt);
  } catch {
    return [];
  }
}

export function saveDraftSnapshot(document: EditorNode, title: string, characterCount: number): SaveDraftSnapshotResult {
  if (!canUseStorage()) {
    return { ok: false, message: 'Draft history is unavailable in this browser context.' };
  }

  try {
    const now = Date.now();
    const draft: DraftSnapshot = {
      id: createDraftId(),
      title: title.trim() || `Draft ${new Date(now).toLocaleString()}`,
      createdAt: now,
      updatedAt: now,
      characterCount,
      document,
    };
    const drafts = [draft, ...loadDraftHistory()].slice(0, MAX_DRAFT_HISTORY);
    window.localStorage.setItem(DRAFT_HISTORY_KEY, JSON.stringify(drafts));
    return { ok: true, message: 'Draft saved to history.', draft };
  } catch {
    return { ok: false, message: 'Draft history save failed. Your current draft is still autosaved.' };
  }
}

export function deleteDraftSnapshot(id: string): SaveDraftResult {
  if (!canUseStorage()) {
    return { ok: false, message: 'Draft history is unavailable in this browser context.' };
  }

  try {
    const drafts = loadDraftHistory().filter((draft) => draft.id !== id);
    window.localStorage.setItem(DRAFT_HISTORY_KEY, JSON.stringify(drafts));
    return { ok: true, message: 'Saved draft deleted.' };
  } catch {
    return { ok: false, message: 'Saved draft could not be deleted.' };
  }
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function createDraftId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isEditorNode(value: unknown): value is EditorNode {
  return typeof value === 'object' && value !== null && 'type' in value;
}

function isDraftSnapshot(value: unknown): value is DraftSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as DraftSnapshot;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.createdAt === 'number' &&
    typeof candidate.updatedAt === 'number' &&
    typeof candidate.characterCount === 'number' &&
    isEditorNode(candidate.document)
  );
}