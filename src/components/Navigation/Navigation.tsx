import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

export function Navigation() {
  return (
    <nav className={styles.nav}>
      <NavLink
        to="/visual-viewport"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        Visual Viewport
      </NavLink>
      <NavLink
        to="/virtual-keyboard"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        Virtual Keyboard
      </NavLink>
      <NavLink
        to="/viewport-keyboard"
        className={({ isActive }) =>
          `${styles.link} ${isActive ? styles.active : ''}`
        }
      >
        Joint View
      </NavLink>
    </nav>
  );
}
