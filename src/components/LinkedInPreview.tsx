import type { CharacterCountStatus } from '../lib/constants';
import type { getLinkedInCharacterSummary } from '../lib/exportLinkedInText';

interface LinkedInPreviewProps {
  summary: ReturnType<typeof getLinkedInCharacterSummary>;
}

const STATUS_LABELS: Record<CharacterCountStatus, string> = {
  normal: 'Within LinkedIn post range',
  warning: 'Approaching LinkedIn post limit',
  over: 'Over LinkedIn post limit',
};

export function LinkedInPreview({ summary }: LinkedInPreviewProps) {
  return (
    <div className="preview-stack">
      <div className={`character-meter is-${summary.status}`} aria-live="polite">
        <div>
          <strong>{summary.count.toLocaleString()}</strong> / {summary.limit.toLocaleString()} characters
          <span className="meter-status">{STATUS_LABELS[summary.status]}</span>
        </div>
        <meter className="meter-track" min={0} max={summary.limit} value={Math.min(summary.count, summary.limit)} aria-label="LinkedIn character count" />
      </div>
    </div>
  );
}