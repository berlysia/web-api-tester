import type { ReactNode } from 'react';
import { Navigation } from '../Navigation/Navigation';
import styles from './Layout.module.css';

const baseUrl = import.meta.env.BASE_URL;

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <a href={baseUrl} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className={styles.title}>Web API Tester</h1>
          </a>
          <Navigation />
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
