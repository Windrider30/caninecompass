import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Search.module.css';
import Link from 'next/link';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch from Dog API
      const dogApiResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_DOG_API_URL}/breeds/search?q=${query}`,
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
          }
        }
      );

      // Fetch Wikipedia summary
      const wikipediaResponse = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${query}`
      );

      // Fetch images from Pixabay
      const pixabayResponse = await axios.get(
        `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${encodeURIComponent(query + ' dog')}&image_type=photo`
      );

      // Combine results
      const combinedResults = await Promise.all(dogApiResponse.data.map(async breed => {
        // Get best matching image from Pixabay
        const breedImage = pixabayResponse.data.hits[0]?.webformatURL || '/images/fallback.jpg';

        return {
          id: breed.id,
          name: breed.name,
          description: wikipediaResponse.data.extract || 'No description available',
          category: breed.breed_group || 'Unknown',
          image: breedImage,
          characteristics: {
            size: breed.height?.metric || 'Unknown',
            energy: breed.energy_level || 'Unknown',
            familyFriendly: breed.bred_for || 'Unknown',
            trainability: breed.temperament || 'Unknown'
          }
        };
      }));

      setResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search breeds..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.searchButton}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.resultsContainer}>
        {results.length > 0 ? (
          results.map((breed) => (
            <Link 
              key={breed.id} 
              href={`/breeds/${breed.id}`}
              className={styles.resultItem}
            >
              <img 
                src={breed.image} 
                alt={breed.name} 
                className={styles.breedImage}
              />
              <h3>{breed.name}</h3>
              <p className={styles.category}>Category: {breed.category}</p>
              <p>{breed.description}</p>
              <div className={styles.characteristics}>
                <span>Size: {breed.characteristics.size}</span>
                <span>Energy: {breed.characteristics.energy}</span>
                <span>Family Friendly: {breed.characteristics.familyFriendly}</span>
                <span>Trainability: {breed.characteristics.trainability}</span>
              </div>
            </Link>
          ))
        ) : query && !isLoading ? (
          <p className={styles.noResults}>No breeds match your search.</p>
        ) : null}
      </div>
    </div>
  );
}
