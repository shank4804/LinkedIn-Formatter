import { useState } from 'react';

import { CopyPanel, type CopyStatus } from './components/CopyPanel';
import { EditorShell } from './components/EditorShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HelpPanel } from './components/HelpPanel';
import { LinkedInPreview } from './components/LinkedInPreview';
import { copyPlainText } from './lib/clipboard';
import { exportLinkedInText, getLinkedInCharacterSummary, type EditorNode } from './lib/exportLinkedInText';
import { SAMPLE_DOCUMENT } from './lib/sampleContent';
import { clearDraft, loadDraft, saveDraft } from './lib/storage';

function App() {
  const [initialLoad] = useState(loadDraft);
  const [document, setDocument] = useState<EditorNode>(() => initialLoad.document ?? SAMPLE_DOCUMENT);
  const [editorVersion, setEditorVersion] = useState(0);
  const [storageNotice, setStorageNotice] = useState<string | null>(() => initialLoad.error ?? null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({ state: 'idle', message: 'Ready to copy.' });

  const exportedText = exportLinkedInText(document);
  const characterSummary = getLinkedInCharacterSummary(exportedText);

  function handleDocumentChange(nextDocument: EditorNode) {
    setDocument(nextDocument);
    const result = saveDraft(nextDocument);

    if (!result.ok) {
      setStorageNotice(result.message);
    }
  }

  async function handleCopy() {
    try {
      await copyPlainText(exportedText);
      setCopyStatus({ state: 'success', message: 'Copied LinkedIn-ready text.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Copy failed. Select the preview text and copy manually.';
      setCopyStatus({ state: 'error', message });
    }
  }

  function handleReset() {
    clearDraft();
    setDocument(SAMPLE_DOCUMENT);
    setEditorVersion((version) => version + 1);
    setStorageNotice(null);
    setCopyStatus({ state: 'idle', message: 'Draft reset.' });
  }

  return (
    <ErrorBoundary onReset={handleReset}>
      <main className="app-shell">
        <header className="app-header" aria-labelledby="app-title">
          <div className="brand-lockup" aria-hidden="true">
            <span className="brand-mark">in</span>
          </div>
          <div>
            <p className="eyebrow">Client-side post composer</p>
            <h1 id="app-title">LinkedIn Post Formatter</h1>
            <p className="subtitle">Draft with familiar formatting, then copy clean Unicode/plain text into a LinkedIn post.</p>
          </div>
        </header>

        <section className="workspace-grid" aria-label="LinkedIn formatter workspace">
          <div className="workspace-panel editor-workspace">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Draft</p>
                <h2>Composer</h2>
              </div>
              {storageNotice ? <p className="inline-alert" role="status">{storageNotice}</p> : null}
            </div>

            <LinkedInPreview summary={characterSummary} />
            <EditorShell
              key={editorVersion}
              initialContent={document}
              onDocumentChange={handleDocumentChange}
              onReset={handleReset}
            />
            <CopyPanel disabled={!exportedText} status={copyStatus} onCopy={handleCopy} />
            <HelpPanel />
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}

export default App;