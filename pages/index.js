import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find Your Perfect Canine Companion</h1>
          <p className={styles.heroSubtitle}>
            Discover the ideal dog breed for your lifestyle with our comprehensive breed directory and matching tools.
          </p>
          <Link href="/breeds" className={styles.ctaButton}>
            Explore Breeds
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <h2>Why Choose Canine Compass?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🐾</div>
              <h3 className={styles.featureTitle}>Comprehensive Breed Info</h3>
              <p className={styles.featureDescription}>
                Detailed profiles for hundreds of dog breeds, including temperament, care needs, and suitability for families.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏠</div>
              <h3 className={styles.featureTitle}>Lifestyle Matching</h3>
              <p className={styles.featureDescription}>
                Find breeds that match your living situation, activity level, and family dynamics.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3 className={styles.featureTitle}>Expert Resources</h3>
              <p className={styles.featureDescription}>
                Access training tips, health information, and care guides from canine experts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
