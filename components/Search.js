import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log('Search initiated for:', query); // Debugging
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

      console.log('Dog API response:', dogApiResponse.data); // Debugging

      // Fetch images from Pixabay
      const pixabayResponse = await axios.get(
        `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${encodeURIComponent(query + ' dog')}&image_type=photo`
      );

      console.log('Pixabay response:', pixabayResponse.data); // Debugging

      // Combine results
      const combinedResults = dogApiResponse.data.map(breed => ({
        id: breed.id,
        name: breed.name,
        image: pixabayResponse.data.hits[0]?.webformatURL || '/images/fallback.jpg',
        category: breed.breed_group || 'Unknown',
        characteristics: {
          size: breed.height?.metric || 'Unknown',
          energy: breed.energy_level || 'Unknown',
          familyFriendly: breed.bred_for || 'Unknown',
          trainability: breed.temperament || 'Unknown'
        }
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <form 
        onSubmit={handleSearch} 
        style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
      >
        <input
          type="text"
          placeholder="Search breeds..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 15px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <div>
        {results.length > 0 ? (
          results.map((breed) => (
            <Link 
              key={breed.id} 
              href={`/breeds/${breed.id}`}
              style={{
                display: 'block',
                padding: '20px',
                marginBottom: '15px',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <img 
                src={breed.image} 
                alt={breed.name} 
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}
              />
              <h3 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>{breed.name}</h3>
              <p style={{ fontSize: '0.9em', color: '#718096', margin: '5px 0' }}>
                Category: {breed.category}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ padding: '5px 10px', background: '#edf2f7', borderRadius: '4px', fontSize: '0.85em' }}>
                  Size: {breed.characteristics.size}
                </span>
                <span style={{ padding: '5px 10px', background: '#edf2f7', borderRadius: '4px', fontSize: '0.85em' }}>
                  Energy: {breed.characteristics.energy}
                </span>
                <span style={{ padding: '5px 10px', background: '#edf2f7', borderRadius: '4px', fontSize: '0.85em' }}>
                  Family Friendly: {breed.characteristics.familyFriendly}
                </span>
                <span style={{ padding: '5px 10px', background: '#edf2f7', borderRadius: '4px', fontSize: '0.85em' }}>
                  Trainability: {breed.characteristics.trainability}
                </span>
              </div>
            </Link>
          ))
        ) : query && !isLoading ? (
          <p style={{ textAlign: 'center', color: '#718096', padding: '20px' }}>
            No breeds match your search.
          </p>
        ) : null}
      </div>
    </div>
  );
}
