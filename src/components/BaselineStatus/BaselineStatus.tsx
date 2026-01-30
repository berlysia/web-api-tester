import type {
  BaselineStatus as BaselineStatusType,
  BrowserSupport,
} from '../../types/api-status';
import styles from './BaselineStatus.module.css';

interface BaselineStatusProps {
  status: BaselineStatusType;
  apiName: string;
  mdnUrl: string;
  caniuseUrl?: string;
  browsers: BrowserSupport;
  requiresSecureContext: boolean;
  isApiDetected: boolean;
}

const statusLabels: Record<BaselineStatusType, string> = {
  'widely-available': 'Widely Available',
  'newly-available': 'Newly Available',
  limited: 'Limited Availability',
  'not-available': 'Not Available',
};

const statusIcons: Record<BaselineStatusType, string> = {
  'widely-available': '✓',
  'newly-available': '◐',
  limited: '⚠',
  'not-available': '✗',
};

const statusStyles: Record<BaselineStatusType, string> = {
  'widely-available': styles.widelyAvailable,
  'newly-available': styles.newlyAvailable,
  limited: styles.limited,
  'not-available': styles.notAvailable,
};

const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;

type AvailabilityStatus = 'available' | 'context-blocked' | 'not-supported';

function getAvailabilityStatus(
  isApiDetected: boolean,
  requiresSecureContext: boolean
): AvailabilityStatus {
  if (isApiDetected) {
    return 'available';
  }
  if (requiresSecureContext && !isSecureContext) {
    return 'context-blocked';
  }
  return 'not-supported';
}

const availabilityLabels: Record<AvailabilityStatus, string> = {
  available: 'Available',
  'context-blocked': 'Not available (requires HTTPS)',
  'not-supported': 'Not supported in this browser',
};

const availabilityIcons: Record<AvailabilityStatus, string> = {
  available: '✓',
  'context-blocked': '⚠',
  'not-supported': '✗',
};

export function BaselineStatus({
  status,
  apiName,
  mdnUrl,
  caniuseUrl,
  browsers,
  requiresSecureContext,
  isApiDetected,
}: BaselineStatusProps) {
  const availabilityStatus = getAvailabilityStatus(
    isApiDetected,
    requiresSecureContext
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${statusStyles[status]}`}>
          <span>{statusIcons[status]}</span>
          {statusLabels[status]}
        </span>
        <span className={styles.apiName}>{apiName}</span>
      </div>

      <div className={styles.detectionGrid}>
        <div className={styles.detectionSection}>
          <h3 className={styles.detectionTitle}>Requirements</h3>
          <div className={styles.detectionItem}>
            <span className={styles.detectionLabel}>Secure Context:</span>
            <span
              className={
                requiresSecureContext ? styles.required : styles.notRequired
              }
            >
              {requiresSecureContext ? 'Required' : 'Not required'}
            </span>
          </div>
        </div>

        <div className={styles.detectionSection}>
          <h3 className={styles.detectionTitle}>Current Environment</h3>
          <div className={styles.detectionItem}>
            <span className={styles.detectionLabel}>Context:</span>
            <span
              className={
                isSecureContext ? styles.satisfied : styles.notSatisfied
              }
            >
              {isSecureContext ? 'Secure (HTTPS)' : 'Not secure (HTTP)'}
            </span>
          </div>
          <div className={styles.detectionItem}>
            <span className={styles.detectionLabel}>API Detection:</span>
            <span
              className={isApiDetected ? styles.satisfied : styles.notSatisfied}
            >
              {isApiDetected ? 'Detected' : 'Not detected'}
            </span>
          </div>
        </div>

        <div className={styles.detectionSection}>
          <h3 className={styles.detectionTitle}>Availability</h3>
          <div
            className={`${styles.availabilityBadge} ${styles[availabilityStatus]}`}
          >
            <span>{availabilityIcons[availabilityStatus]}</span>
            <span>{availabilityLabels[availabilityStatus]}</span>
          </div>
        </div>
      </div>

      <div className={styles.browsers}>
        {browsers.chrome && (
          <div className={styles.browser}>
            <span>Chrome</span>
            <span>{browsers.chrome}+</span>
          </div>
        )}
        {browsers.firefox && (
          <div className={styles.browser}>
            <span>Firefox</span>
            <span>{browsers.firefox}+</span>
          </div>
        )}
        {browsers.safari && (
          <div className={styles.browser}>
            <span>Safari</span>
            <span>{browsers.safari}+</span>
          </div>
        )}
        {browsers.edge && (
          <div className={styles.browser}>
            <span>Edge</span>
            <span>{browsers.edge}+</span>
          </div>
        )}
      </div>

      <div className={styles.links}>
        <a
          href={mdnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          MDN Docs
        </a>
        {caniuseUrl && (
          <a
            href={caniuseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Can I Use
          </a>
        )}
      </div>
    </div>
  );
}
