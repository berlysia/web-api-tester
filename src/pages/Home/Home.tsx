import type { ApiInfo, BaselineStatus } from '../../types/api-status';
import styles from './Home.module.css';

const baseUrl = import.meta.env.BASE_URL;

const apis: ApiInfo[] = [
  {
    id: 'visual-viewport',
    name: 'Visual Viewport API',
    description:
      'ページの視覚的なビューポートに関する情報を提供し、ピンチズームやソフトキーボードによるビューポートの変化を検出できます。',
    baselineStatus: 'widely-available',
    mdnUrl:
      'https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API',
    caniuseUrl: 'https://caniuse.com/visualviewport',
    browsers: {
      chrome: '61',
      firefox: '91',
      safari: '13',
      edge: '79',
    },
    path: 'visual-viewport/',
  },
  {
    id: 'virtual-keyboard',
    name: 'Virtual Keyboard API',
    description:
      '仮想キーボードの表示・非表示を制御し、キーボードの境界矩形情報を取得できます。Chrome/Edge 94以降でのみ利用可能です。',
    baselineStatus: 'limited',
    mdnUrl:
      'https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API',
    browsers: {
      chrome: '94',
      edge: '94',
    },
    path: 'virtual-keyboard/',
  },
  {
    id: 'viewport-keyboard',
    name: 'Joint View',
    description:
      'Visual Viewport APIとVirtual Keyboard APIの両方の値を同時に確認できます。',
    baselineStatus: 'limited',
    browsers: {
      chrome: '94',
      edge: '94',
    },
    path: 'viewport-keyboard/',
  },
];

const statusLabels: Record<BaselineStatus, string> = {
  'widely-available': 'Widely Available',
  'newly-available': 'Newly Available',
  limited: 'Limited',
  'not-available': 'Not Available',
};

const statusStyles: Record<BaselineStatus, string> = {
  'widely-available': styles.widelyAvailable,
  'newly-available': styles.newlyAvailable,
  limited: styles.limited,
  'not-available': styles.notAvailable,
};

export function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Web API Tester</h1>
      <p className={styles.description}>
        ブラウザのWeb APIの対応状況を確認し、実際の動作をテストできます。
      </p>

      <div className={styles.apiList}>
        {apis.map((api) => (
          <a key={api.id} href={`${baseUrl}${api.path}`} className={styles.apiCard}>
            <div className={styles.cardHeader}>
              <span className={styles.apiName}>{api.name}</span>
              <span
                className={`${styles.badge} ${statusStyles[api.baselineStatus]}`}
              >
                {statusLabels[api.baselineStatus]}
              </span>
            </div>
            <p className={styles.apiDescription}>{api.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
