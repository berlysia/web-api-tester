import { useCallback, useEffect, useRef, useState } from 'react';
import { BaselineStatus } from '../../components/BaselineStatus/BaselineStatus';
import '../../types/virtual-keyboard.d.ts';
import styles from './VirtualKeyboard.module.css';

interface KeyboardRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EventLogEntry {
  id: number;
  type: 'geometrychange';
  timestamp: Date;
  details: string;
}

const isApiDetected = 'virtualKeyboard' in navigator;
const isSupported = isApiDetected;

export function VirtualKeyboard() {
  const [boundingRect, setBoundingRect] = useState<KeyboardRect | null>(null);
  const [overlaysContent, setOverlaysContent] = useState(false);
  const [keyboardPolicy, setKeyboardPolicy] = useState<'auto' | 'manual'>('auto');
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const eventIdRef = useRef(0);

  const addEventLog = useCallback((type: 'geometrychange', details: string) => {
    eventIdRef.current += 1;
    const newId = eventIdRef.current;
    setEventLog((log) => [
      { id: newId, type, timestamp: new Date(), details },
      ...log.slice(0, 49),
    ]);
  }, []);

  const updateBoundingRect = useCallback(() => {
    if (navigator.virtualKeyboard) {
      const rect = navigator.virtualKeyboard.boundingRect;
      setBoundingRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupported || !navigator.virtualKeyboard) return;

    setOverlaysContent(navigator.virtualKeyboard.overlaysContent);
    updateBoundingRect();

    const handleGeometryChange = () => {
      updateBoundingRect();
      const rect = navigator.virtualKeyboard?.boundingRect;
      if (rect) {
        addEventLog(
          'geometrychange',
          `rect: (${rect.x.toFixed(0)}, ${rect.y.toFixed(0)}, ${rect.width.toFixed(0)}x${rect.height.toFixed(0)})`
        );
      }
    };

    navigator.virtualKeyboard.addEventListener(
      'geometrychange',
      handleGeometryChange
    );

    return () => {
      navigator.virtualKeyboard?.removeEventListener(
        'geometrychange',
        handleGeometryChange
      );
    };
  }, [updateBoundingRect, addEventLog]);

  const toggleOverlaysContent = () => {
    if (navigator.virtualKeyboard) {
      const newValue = !overlaysContent;
      navigator.virtualKeyboard.overlaysContent = newValue;
      setOverlaysContent(newValue);
    }
  };

  const showKeyboard = () => {
    navigator.virtualKeyboard?.show();
  };

  const hideKeyboard = () => {
    navigator.virtualKeyboard?.hide();
  };

  const clearEventLog = () => setEventLog([]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Virtual Keyboard API</h1>

      <BaselineStatus
        status="limited"
        apiName="Virtual Keyboard API"
        mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API"
        browsers={{
          chrome: '94',
          edge: '94',
        }}
        requiresSecureContext={true}
        isApiDetected={isApiDetected}
      />

      {/* Test Area with compact values */}
      <section className={styles.testSection}>
        <div className={styles.compactValues}>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>rect:</span>
            <span className={styles.valueData}>
              {isSupported
                ? `(${boundingRect?.x ?? 0}, ${boundingRect?.y ?? 0})`
                : 'N/A'}
            </span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>size:</span>
            <span className={styles.valueData}>
              {isSupported
                ? `${boundingRect?.width ?? 0} × ${boundingRect?.height ?? 0}`
                : 'N/A'}
            </span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>overlays:</span>
            <span className={styles.valueData}>
              {isSupported ? (overlaysContent ? 'true' : 'false') : 'N/A'}
            </span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>policy:</span>
            <span className={styles.valueData}>{keyboardPolicy}</span>
          </div>
        </div>

        <div className={styles.controls}>
          <label className={styles.controlItem}>
            <input
              type="checkbox"
              checked={overlaysContent}
              onChange={toggleOverlaysContent}
              disabled={!isSupported}
            />
            <span>overlaysContent</span>
          </label>
          <label className={styles.controlItem}>
            <input
              type="checkbox"
              checked={keyboardPolicy === 'manual'}
              onChange={() => setKeyboardPolicy(keyboardPolicy === 'auto' ? 'manual' : 'auto')}
            />
            <span>manual policy</span>
          </label>
          <button
            className={styles.smallButton}
            onClick={showKeyboard}
            disabled={!isSupported}
          >
            show()
          </button>
          <button
            className={styles.smallButton}
            onClick={hideKeyboard}
            disabled={!isSupported}
          >
            hide()
          </button>
        </div>

        <input
          type="text"
          className={styles.input}
          placeholder="Tap to open virtual keyboard..."
          virtualkeyboardpolicy={keyboardPolicy}
          onFocus={keyboardPolicy === 'manual' ? showKeyboard : undefined}
          onBlur={keyboardPolicy === 'manual' ? hideKeyboard : undefined}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Event Log</h2>
        <div className={styles.eventLog}>
          {!isSupported ? (
            <p className={styles.noEvents}>
              API not supported. Events cannot be captured.
            </p>
          ) : eventLog.length === 0 ? (
            <p className={styles.noEvents}>
              No events yet. Focus the input above to trigger keyboard geometry
              changes.
            </p>
          ) : (
            eventLog.map((entry) => (
              <p key={entry.id} className={styles.eventItem}>
                <span className={styles.eventType}>[{entry.type}]</span>{' '}
                {entry.details} at{' '}
                {entry.timestamp.toLocaleTimeString('ja-JP', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  fractionalSecondDigits: 3,
                })}
              </p>
            ))
          )}
        </div>
        {eventLog.length > 0 && (
          <button onClick={clearEventLog} className={styles.clearButton}>
            Clear Log
          </button>
        )}
      </section>

      <section className={styles.section}>
        <details className={styles.cssVarDetails}>
          <summary className={styles.cssVarSummary}>CSS Environment Variables</summary>
          <p className={styles.cssVarDesc}>
            When overlaysContent is true, these CSS environment variables can
            be used to adjust layout:
          </p>
          <div className={styles.cssVarGrid}>
            <code className={styles.cssVarItem}>env(keyboard-inset-top)</code>
            <code className={styles.cssVarItem}>env(keyboard-inset-right)</code>
            <code className={styles.cssVarItem}>env(keyboard-inset-bottom)</code>
            <code className={styles.cssVarItem}>env(keyboard-inset-left)</code>
            <code className={styles.cssVarItem}>env(keyboard-inset-width)</code>
            <code className={styles.cssVarItem}>env(keyboard-inset-height)</code>
          </div>
        </details>
      </section>
    </div>
  );
}
