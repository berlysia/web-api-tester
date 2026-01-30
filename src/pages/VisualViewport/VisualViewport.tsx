import { useCallback, useEffect, useRef, useState } from 'react';
import { BaselineStatus } from '../../components/BaselineStatus/BaselineStatus';
import { InteractiveWidgetSelector } from '../../components/InteractiveWidgetSelector/InteractiveWidgetSelector';
import styles from './VisualViewport.module.css';

export type InteractiveWidgetValue = 'default' | 'resizes-visual' | 'resizes-content' | 'overlays-content';

interface VisualViewportProps {
  interactiveWidget?: InteractiveWidgetValue;
}

interface ViewportProperties {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
  pageLeft: number;
  pageTop: number;
  scale: number;
}

interface EventLogEntry {
  id: number;
  type: 'resize' | 'scroll';
  timestamp: Date;
  details: string;
}

const isSupported = typeof window.visualViewport !== 'undefined';

export function VisualViewport({ interactiveWidget = 'default' }: VisualViewportProps) {
  const [properties, setProperties] = useState<ViewportProperties | null>(null);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const eventIdRef = useRef(0);

  const updateProperties = useCallback(() => {
    if (window.visualViewport) {
      setProperties({
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

  const addEventLog = useCallback(
    (type: 'resize' | 'scroll', details: string) => {
      eventIdRef.current += 1;
      const newId = eventIdRef.current;
      setEventLog((log) => [
        { id: newId, type, timestamp: new Date(), details },
        ...log.slice(0, 49),
      ]);
    },
    []
  );

  useEffect(() => {
    if (!isSupported || !window.visualViewport) return;

    updateProperties();

    const handleResize = () => {
      updateProperties();
      const vv = window.visualViewport;
      if (vv) {
        addEventLog(
          'resize',
          `${vv.width.toFixed(0)}x${vv.height.toFixed(0)}, scale: ${vv.scale.toFixed(2)}`
        );
      }
    };

    const handleScroll = () => {
      updateProperties();
      const vv = window.visualViewport;
      if (vv) {
        addEventLog(
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
  }, [updateProperties, addEventLog]);

  const clearEventLog = () => setEventLog([]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Visual Viewport API</h1>

      <BaselineStatus
        status="widely-available"
        apiName="Visual Viewport API"
        mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API"
        caniuseUrl="https://caniuse.com/visualviewport"
        browsers={{
          chrome: '61',
          firefox: '91',
          safari: '13',
          edge: '79',
        }}
        requiresSecureContext={false}
        isApiDetected={isSupported}
      />

      <InteractiveWidgetSelector
        basePath="visual-viewport"
        currentValue={interactiveWidget}
      />

      {/* Test Area with values - positioned for mobile visibility */}
      <section className={styles.testSection}>
        <div className={styles.compactValues}>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>size:</span>
            <span className={styles.valueData}>
              {properties ? `${properties.width.toFixed(0)} × ${properties.height.toFixed(0)}` : 'N/A'}
            </span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>offset:</span>
            <span className={styles.valueData}>
              {properties ? `(${properties.offsetLeft.toFixed(1)}, ${properties.offsetTop.toFixed(1)})` : 'N/A'}
            </span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>page:</span>
            <span className={styles.valueData}>
              {properties ? `(${properties.pageLeft.toFixed(1)}, ${properties.pageTop.toFixed(1)})` : 'N/A'}
            </span>
          </div>
          <div className={styles.valueRow}>
            <span className={styles.valueLabel}>scale:</span>
            <span className={styles.valueData}>
              {properties ? `${properties.scale.toFixed(2)}x` : 'N/A'}
            </span>
          </div>
        </div>

        <input
          type="text"
          className={styles.input}
          placeholder="Tap to open keyboard..."
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Event Log</h2>
        <div className={styles.eventLog}>
          {eventLog.length === 0 ? (
            <p className={styles.noEvents}>
              No events yet. Try pinch-zooming or using the input above to
              trigger the soft keyboard.
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
    </div>
  );
}
