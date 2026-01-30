import { useCallback, useEffect, useRef, useState } from 'react';
import { InteractiveWidgetSelector } from '../../components/InteractiveWidgetSelector/InteractiveWidgetSelector';
import '../../types/virtual-keyboard.d.ts';
import styles from './ViewportKeyboardJoint.module.css';

export type InteractiveWidgetValue = 'default' | 'resizes-visual' | 'resizes-content' | 'overlays-content';

interface ViewportKeyboardJointProps {
  interactiveWidget?: InteractiveWidgetValue;
}

interface VisualViewportData {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
  pageLeft: number;
  pageTop: number;
  scale: number;
}

interface KeyboardRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EventLogEntry {
  id: number;
  source: 'visualViewport' | 'virtualKeyboard';
  type: string;
  timestamp: Date;
  details: string;
}

const isVisualViewportSupported = typeof window.visualViewport !== 'undefined';
const isVirtualKeyboardSupported = 'virtualKeyboard' in navigator;

export function ViewportKeyboardJoint({ interactiveWidget = 'default' }: ViewportKeyboardJointProps) {
  const [viewportProps, setViewportProps] = useState<VisualViewportData | null>(null);
  const [keyboardRect, setKeyboardRect] = useState<KeyboardRect | null>(null);
  const [overlaysContent, setOverlaysContent] = useState(false);
  const [keyboardPolicy, setKeyboardPolicy] = useState<'auto' | 'manual'>('auto');
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const eventIdRef = useRef(0);

  const addEventLog = useCallback(
    (source: 'visualViewport' | 'virtualKeyboard', type: string, details: string) => {
      eventIdRef.current += 1;
      const newId = eventIdRef.current;
      setEventLog((log) => [
        { id: newId, source, type, timestamp: new Date(), details },
        ...log.slice(0, 99),
      ]);
    },
    []
  );

  const updateVisualViewport = useCallback(() => {
    if (window.visualViewport) {
      setViewportProps({
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        offsetLeft: window.visualViewport.offsetLeft,
        offsetTop: window.visualViewport.offsetTop,
        pageLeft: window.visualViewport.pageLeft,
        pageTop: window.visualViewport.pageTop,
        scale: window.visualViewport.scale,
      });
    }
  }, []);

  const updateKeyboardRect = useCallback(() => {
    if (navigator.virtualKeyboard) {
      const rect = navigator.virtualKeyboard.boundingRect;
      setKeyboardRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  useEffect(() => {
    if (isVisualViewportSupported && window.visualViewport) {
      updateVisualViewport();

      const handleResize = () => {
        updateVisualViewport();
        const vv = window.visualViewport;
        if (vv) {
          addEventLog(
            'visualViewport',
            'resize',
            `${vv.width.toFixed(0)}x${vv.height.toFixed(0)}, scale: ${vv.scale.toFixed(2)}`
          );
        }
      };

      const handleScroll = () => {
        updateVisualViewport();
        const vv = window.visualViewport;
        if (vv) {
          addEventLog(
            'visualViewport',
            'scroll',
            `offset: (${vv.offsetLeft.toFixed(0)}, ${vv.offsetTop.toFixed(0)})`
          );
        }
      };

      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleScroll);

      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [updateVisualViewport, addEventLog]);

  useEffect(() => {
    if (isVirtualKeyboardSupported && navigator.virtualKeyboard) {
      setOverlaysContent(navigator.virtualKeyboard.overlaysContent);
      updateKeyboardRect();

      const handleGeometryChange = () => {
        updateKeyboardRect();
        const rect = navigator.virtualKeyboard?.boundingRect;
        if (rect) {
          addEventLog(
            'virtualKeyboard',
            'geometrychange',
            `rect: (${rect.x.toFixed(0)}, ${rect.y.toFixed(0)}, ${rect.width.toFixed(0)}x${rect.height.toFixed(0)})`
          );
        }
      };

      navigator.virtualKeyboard.addEventListener('geometrychange', handleGeometryChange);

      return () => {
        navigator.virtualKeyboard?.removeEventListener('geometrychange', handleGeometryChange);
      };
    }
  }, [updateKeyboardRect, addEventLog]);

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
      <h1 className={styles.title}>Viewport & Keyboard Joint View</h1>

      <InteractiveWidgetSelector
        basePath="viewport-keyboard"
        currentValue={interactiveWidget}
      />

      {/* Main test area with compact values */}
      <section className={styles.testSection}>
        <div className={styles.valuesContainer}>
          {/* Visual Viewport values */}
          <div className={styles.valueGroup}>
            <div className={styles.groupHeader}>
              <span className={styles.groupLabel}>Visual Viewport</span>
              <span className={isVisualViewportSupported ? styles.supported : styles.unsupported}>
                {isVisualViewportSupported ? '✓' : '✗'}
              </span>
            </div>
            <div className={styles.valueGrid}>
              <div className={styles.valueItem}>
                <span className={styles.label}>size</span>
                <span className={styles.value}>
                  {viewportProps ? `${viewportProps.width.toFixed(0)}×${viewportProps.height.toFixed(0)}` : 'N/A'}
                </span>
              </div>
              <div className={styles.valueItem}>
                <span className={styles.label}>offset</span>
                <span className={styles.value}>
                  {viewportProps ? `(${viewportProps.offsetLeft.toFixed(0)}, ${viewportProps.offsetTop.toFixed(0)})` : 'N/A'}
                </span>
              </div>
              <div className={styles.valueItem}>
                <span className={styles.label}>page</span>
                <span className={styles.value}>
                  {viewportProps ? `(${viewportProps.pageLeft.toFixed(0)}, ${viewportProps.pageTop.toFixed(0)})` : 'N/A'}
                </span>
              </div>
              <div className={styles.valueItem}>
                <span className={styles.label}>scale</span>
                <span className={styles.value}>
                  {viewportProps ? `${viewportProps.scale.toFixed(2)}x` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Virtual Keyboard values */}
          <div className={styles.valueGroup}>
            <div className={styles.groupHeader}>
              <span className={styles.groupLabel}>Virtual Keyboard</span>
              <span className={isVirtualKeyboardSupported ? styles.supported : styles.unsupported}>
                {isVirtualKeyboardSupported ? '✓' : '✗'}
              </span>
            </div>
            <div className={styles.valueGrid}>
              <div className={styles.valueItem}>
                <span className={styles.label}>rect</span>
                <span className={styles.value}>
                  {isVirtualKeyboardSupported
                    ? `(${keyboardRect?.x ?? 0}, ${keyboardRect?.y ?? 0})`
                    : 'N/A'}
                </span>
              </div>
              <div className={styles.valueItem}>
                <span className={styles.label}>size</span>
                <span className={styles.value}>
                  {isVirtualKeyboardSupported
                    ? `${keyboardRect?.width ?? 0}×${keyboardRect?.height ?? 0}`
                    : 'N/A'}
                </span>
              </div>
              <div className={styles.valueItem}>
                <span className={styles.label}>overlays</span>
                <span className={styles.value}>
                  {isVirtualKeyboardSupported ? (overlaysContent ? 'true' : 'false') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls inline */}
        <div className={styles.controls}>
          <label className={styles.controlItem}>
            <input
              type="checkbox"
              checked={overlaysContent}
              onChange={toggleOverlaysContent}
              disabled={!isVirtualKeyboardSupported}
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
            disabled={!isVirtualKeyboardSupported}
          >
            show()
          </button>
          <button
            className={styles.smallButton}
            onClick={hideKeyboard}
            disabled={!isVirtualKeyboardSupported}
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
          {eventLog.length === 0 ? (
            <p className={styles.noEvents}>
              No events yet. Focus the input above to trigger events.
            </p>
          ) : (
            eventLog.map((entry) => (
              <p key={entry.id} className={styles.eventItem}>
                <span className={`${styles.eventSource} ${styles[entry.source]}`}>
                  [{entry.source === 'visualViewport' ? 'VV' : 'VK'}]
                </span>{' '}
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
    </div>
  );
}
