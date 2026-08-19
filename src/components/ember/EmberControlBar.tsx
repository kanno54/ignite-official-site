import React from 'react';
import { ListeningMode } from '../../types/ember';

interface EmberControlBarProps {
  currentMode: ListeningMode;
  onSelectMode: (mode: ListeningMode) => void;
  onTriggerBurn: () => void;
  comboCount: number;
}

export const EmberControlBar: React.FC<EmberControlBarProps> = ({
  currentMode,
  onSelectMode,
  onTriggerBurn,
  comboCount,
}) => {
  return (
    <div className="ember-control-bar" role="toolbar" aria-label="Ember listening mode and reactions">
      <button
        type="button"
        className={`ember-mode-btn ${currentMode === 'LISTEN' ? 'is-active' : ''}`}
        onClick={() => onSelectMode('LISTEN')}
        aria-label="Listen mode"
        title="Listen Mode (標準再生)"
      >
        🎧
      </button>

      <button
        type="button"
        className={`ember-mode-btn ${currentMode === 'DANCE' ? 'is-active' : ''}`}
        onClick={() => onSelectMode('DANCE')}
        aria-label="Dance mode"
        title="Dance Mode (ダンス)"
      >
        💃
      </button>

      <button
        type="button"
        className={`ember-mode-btn ${currentMode === 'VOCAL' ? 'is-active' : ''}`}
        onClick={() => onSelectMode('VOCAL')}
        aria-label="Vocal mode"
        title="Vocal Mode (ボーカル)"
      >
        🎤
      </button>

      <button
        type="button"
        className={`ember-mode-btn ${currentMode === 'CHILL' ? 'is-active' : ''}`}
        onClick={() => onSelectMode('CHILL')}
        aria-label="Chill mode"
        title="Chill Mode (チル)"
      >
        🌙
      </button>

      <div style={{ width: '1px', height: '16px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />

      <button
        type="button"
        className="ember-burn-btn"
        onClick={onTriggerBurn}
        aria-label="Send fire reaction"
        title="Send Fire Reaction (🔥)"
      >
        🔥 {comboCount > 1 ? `x${comboCount}` : 'BURN'}
      </button>
    </div>
  );
};
