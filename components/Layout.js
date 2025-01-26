import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Canine Compass</title>
        <meta name="description" content="Find your perfect dog breed with Canine Compass" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            Canine Compass
          </Link>
          <div className={styles.navLinks}>
            <Link href="/breeds">Breeds</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Canine Compass. 
          Some data sourced from Wikipedia.
        </p>
      </footer>
    </div>
  )
}
