import { useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/Breeds.module.css';
import Link from 'next/link';
import { searchBreeds } from '../../utils/breedData';

export default function BreedsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await searchBreeds(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Dog Breeds Directory</h1>
        
        <form onSubmit={handleSearch} className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search breeds..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className={styles.breedsGrid}>
          {searchResults.length > 0 ? (
            searchResults.map((breed) => (
              <Link 
                key={breed.id}
                href={`/breeds/${breed.name.toLowerCase().replace(/ /g, '-')}`}
                className={styles.breedCard}
              >
                <h3>{breed.name}</h3>
              </Link>
            ))
          ) : (
            <p>No breeds found. Try searching for a specific breed.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
