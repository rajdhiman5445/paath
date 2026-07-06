export default function FontControls({ onDecrease, onIncrease }) {
  return (
    <div className="font-controls" aria-label="Font size controls">
      <button type="button" className="font-button" onClick={onDecrease} aria-label="Decrease font size">
        A−
      </button>
      <button type="button" className="font-button" onClick={onIncrease} aria-label="Increase font size">
        A+
      </button>
    </div>
  );
}
