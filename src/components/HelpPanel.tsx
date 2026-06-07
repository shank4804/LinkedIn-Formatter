export function HelpPanel() {
  return (
    <details className="help-panel">
      <summary>Formatting compatibility</summary>
      <ul>
        <li>Bold and italic export as sans-serif Unicode text, not selectable font styling.</li>
        <li>Hashtags and @mentions stay plain so LinkedIn has the best chance to recognize them.</li>
        <li>Links export as readable text plus URL because custom pasted anchor text is not supported in posts.</li>
        <li>Strikethrough is experimental and may render differently across devices.</li>
        <li>LinkedIn controls the final post font after paste; this app cannot copy CSS fonts into a post.</li>
        <li>The composer is the working view; Copy for LinkedIn transforms it into LinkedIn-ready plain text.</li>
        <li>Keyboard shortcuts include Ctrl+B, Ctrl+I, Ctrl+Z, and Ctrl+Y.</li>
      </ul>
    </details>
  );
}