import type { getLinkedInCharacterSummary } from '../lib/exportLinkedInText';

interface LinkedInPreviewProps {
  summary: ReturnType<typeof getLinkedInCharacterSummary>;
}

export function LinkedInPreview({ summary }: LinkedInPreviewProps) {
  return (
    <div className="preview-stack">
      <div className={`character-meter is-${summary.status}`} aria-live="polite">
        <div>
          <strong>{summary.count.toLocaleString()}</strong> / {summary.limit.toLocaleString()} characters
        </div>
        <meter className="meter-track" min={0} max={summary.limit} value={Math.min(summary.count, summary.limit)} aria-label="LinkedIn character count" />
      </div>
    </div>
  );
}
