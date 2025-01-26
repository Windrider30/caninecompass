import Layout from '../../components/Layout';
import styles from '../../styles/Breeds.module.css';
import Link from 'next/link';

export default function BreedsPage() {
  // Placeholder data - will be replaced with API data
  const breeds = [
    { id: 'affenpinscher', name: 'Affenpinscher' },
    { id: 'afghan-hound', name: 'Afghan Hound' },
    { id: 'africanis', name: 'Africanis' },
    { id: 'aidi', name: 'Aidi' },
    { id: 'airedale-terrier', name: 'Airedale Terrier' },
    { id: 'akbash', name: 'Akbash' },
    { id: 'akita', name: 'Akita' },
    { id: 'alaskan-malamute', name: 'Alaskan Malamute' },
    { id: 'american-bulldog', name: 'American Bulldog' },
    { id: 'american-pit-bull-terrier', name: 'American Pit Bull Terrier' },
    { id: 'australian-cattle-dog', name: 'Australian Cattle Dog' },
    { id: 'basenji', name: 'Basenji' }
  ];

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
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
