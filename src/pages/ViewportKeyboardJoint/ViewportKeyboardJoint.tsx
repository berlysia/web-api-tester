import { useCallback, useEffect, useRef, useState } from 'react';
import '../../types/virtual-keyboard.d.ts';
import styles from './ViewportKeyboardJoint.module.css';

interface VisualViewportProps {
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

export function ViewportKeyboardJoint() {
  const [viewportProps, setViewportProps] = useState<VisualViewportProps | null>(null);
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

      <div className={styles.apiGrid}>
        <section className={styles.apiSection}>
          <h2 className={styles.sectionTitle}>
            Visual Viewport
            <span className={`${styles.statusBadge} ${isVisualViewportSupported ? styles.supported : styles.unsupported}`}>
              {isVisualViewportSupported ? 'Supported' : 'Not Supported'}
            </span>
          </h2>
          <div className={styles.propertiesGrid}>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>width</p>
              <p className={styles.propertyValue}>
                {viewportProps ? `${viewportProps.width.toFixed(0)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>height</p>
              <p className={styles.propertyValue}>
                {viewportProps ? `${viewportProps.height.toFixed(0)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>offsetLeft</p>
              <p className={styles.propertyValue}>
                {viewportProps ? `${viewportProps.offsetLeft.toFixed(1)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>offsetTop</p>
              <p className={styles.propertyValue}>
                {viewportProps ? `${viewportProps.offsetTop.toFixed(1)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>scale</p>
              <p className={styles.propertyValue}>
                {viewportProps ? `${viewportProps.scale.toFixed(2)}x` : 'N/A'}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.apiSection}>
          <h2 className={styles.sectionTitle}>
            Virtual Keyboard
            <span className={`${styles.statusBadge} ${isVirtualKeyboardSupported ? styles.supported : styles.unsupported}`}>
              {isVirtualKeyboardSupported ? 'Supported' : 'Not Supported'}
            </span>
          </h2>
          <div className={styles.propertiesGrid}>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>x</p>
              <p className={styles.propertyValue}>
                {isVirtualKeyboardSupported ? `${(keyboardRect?.x ?? 0).toFixed(0)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>y</p>
              <p className={styles.propertyValue}>
                {isVirtualKeyboardSupported ? `${(keyboardRect?.y ?? 0).toFixed(0)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>width</p>
              <p className={styles.propertyValue}>
                {isVirtualKeyboardSupported ? `${(keyboardRect?.width ?? 0).toFixed(0)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>height</p>
              <p className={styles.propertyValue}>
                {isVirtualKeyboardSupported ? `${(keyboardRect?.height ?? 0).toFixed(0)}px` : 'N/A'}
              </p>
            </div>
            <div className={styles.propertyCard}>
              <p className={styles.propertyName}>overlaysContent</p>
              <p className={styles.propertyValue}>
                {isVirtualKeyboardSupported ? (overlaysContent ? 'true' : 'false') : 'N/A'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Controls</h2>
        <div className={styles.controlSection}>
          <div className={styles.controlRow}>
            <div className={styles.toggle}>
              <span className={styles.toggleLabel}>overlaysContent:</span>
              <div
                className={`${styles.switch} ${overlaysContent ? styles.active : ''} ${!isVirtualKeyboardSupported ? styles.disabled : ''}`}
                onClick={isVirtualKeyboardSupported ? toggleOverlaysContent : undefined}
              >
                <div className={styles.switchKnob} />
              </div>
              <span>{isVirtualKeyboardSupported ? (overlaysContent ? 'true' : 'false') : 'N/A'}</span>
            </div>
            <div className={styles.toggle}>
              <span className={styles.toggleLabel}>virtualkeyboardpolicy:</span>
              <div
                className={`${styles.switch} ${keyboardPolicy === 'manual' ? styles.active : ''}`}
                onClick={() => setKeyboardPolicy(keyboardPolicy === 'auto' ? 'manual' : 'auto')}
              >
                <div className={styles.switchKnob} />
              </div>
              <span>{keyboardPolicy}</span>
            </div>
          </div>
          <div className={styles.buttons}>
            <button onClick={showKeyboard} disabled={!isVirtualKeyboardSupported}>
              show()
            </button>
            <button onClick={hideKeyboard} disabled={!isVirtualKeyboardSupported}>
              hide()
            </button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Combined Event Log</h2>
        <div className={styles.eventLog}>
          {eventLog.length === 0 ? (
            <p className={styles.noEvents}>
              No events yet. Focus the input below to trigger events.
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

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Test Area</h2>
        <div className={styles.demoArea}>
          <p className={styles.demoText}>
            Tap the input below to open the virtual keyboard and observe how both APIs respond.
          </p>
          <input
            type="text"
            className={styles.input}
            placeholder="Tap to open virtual keyboard..."
            virtualkeyboardpolicy={keyboardPolicy}
            onFocus={keyboardPolicy === 'manual' ? showKeyboard : undefined}
            onBlur={keyboardPolicy === 'manual' ? hideKeyboard : undefined}
          />
        </div>
      </section>
    </div>
  );
}
