import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../Navigation/Navigation';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className={styles.title}>Web API Tester</h1>
          </Link>
          <Navigation />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
