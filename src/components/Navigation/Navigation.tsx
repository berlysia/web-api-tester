import styles from './Navigation.module.css';

const baseUrl = import.meta.env.BASE_URL;

export function Navigation() {
  const currentPath = window.location.pathname;

  const isActive = (path: string) => currentPath.startsWith(baseUrl + path);

  return (
    <nav className={styles.nav}>
      <a
        href={`${baseUrl}visual-viewport/`}
        className={`${styles.link} ${isActive('visual-viewport') ? styles.active : ''}`}
      >
        Visual Viewport
      </a>
      <a
        href={`${baseUrl}virtual-keyboard/`}
        className={`${styles.link} ${isActive('virtual-keyboard') ? styles.active : ''}`}
      >
        Virtual Keyboard
      </a>
      <a
        href={`${baseUrl}viewport-keyboard/`}
        className={`${styles.link} ${isActive('viewport-keyboard') ? styles.active : ''}`}
      >
        Joint View
      </a>
    </nav>
  );
}
