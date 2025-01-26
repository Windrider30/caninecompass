import Layout from '../../components/Layout';
import styles from '../../styles/Breeds.module.css';
import Link from 'next/link';
import { getAllBreeds } from '../../utils/breedData';

export default function BreedsPage({ breeds }) {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Dog Breeds Directory</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search breeds..."
            className={styles.searchInput}
          />
        </div>
        <div className={styles.breedsGrid}>
          {breeds.map((breed) => (
            <Link 
              key={breed.id}
              href={`/breeds/${breed.id}`}
              className={styles.breedCard}
            >
              <h3>{breed.name}</h3>
              <p>{breed.category}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  // Use the getAllBreeds function correctly
  const breeds = getAllBreeds();
  
  return {
    props: {
      breeds,
    },
  };
}
