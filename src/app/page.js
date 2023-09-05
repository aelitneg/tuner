'use client';
import { PageProvider } from '../context/PageContext';
import { TunerProvider } from '../context/TunerContext';
import Tuner from '../components/Tuner';
import styles from './page.module.css';

export default function Home() {
  return (
    <PageProvider>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1>tuner</h1>
          <p>A simple, free tuner.</p>
        </header>
        <main className={styles.main}>
          <TunerProvider>
            <Tuner />
          </TunerProvider>
        </main>
        <footer className={styles.footer}>
          <div>
            © 2023 -{' '}
            <a href="https://www.aelitneg.com" target="_blank">
              aelitneg.com
            </a>
          </div>
          <div>MIT License</div>
        </footer>
      </div>
    </PageProvider>
  );
}
