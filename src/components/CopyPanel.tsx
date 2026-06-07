import { AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

export type CopyStatus =
  | { state: 'idle'; message: string }
  | { state: 'success'; message: string }
  | { state: 'error'; message: string };

interface CopyPanelProps {
  disabled: boolean;
  status: CopyStatus;
  onCopy: () => void;
}

export function CopyPanel({ disabled, status, onCopy }: CopyPanelProps) {
  const StatusIcon = status.state === 'success' ? CheckCircle2 : status.state === 'error' ? AlertTriangle : Copy;

  return (
    <div className={`copy-panel is-${status.state}`}>
      <button type="button" className="primary-action" disabled={disabled} onClick={onCopy}>
        <Copy aria-hidden="true" size={18} />
        Copy for LinkedIn
      </button>
      <p className="copy-status" role="status" aria-live="polite">
        <StatusIcon aria-hidden="true" size={16} />
        {status.message}
      </p>
    </div>
  );
}