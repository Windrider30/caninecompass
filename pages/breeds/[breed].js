import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/BreedDetail.module.css';
import { useRouter } from 'next/router';
import { fetchBreedInfo } from '../../utils/breedData';

export default function BreedDetailPage() {
  const router = useRouter();
  const { breed } = router.query;
  const [breedData, setBreedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!breed) return;
      
      try {
        setLoading(true);
        const data = await fetchBreedInfo(breed);
        
        if (!data || (!data.wikipedia.description && !data.dogApi)) {
          throw new Error('Breed information not found');
        }
        
        setBreedData(data);
      } catch (err) {
        setError('Failed to find dog breed information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [breed]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <p>Loading breed information...</p>
        </div>
      </Layout>
    );
  }

  if (error || !breedData) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1>Error</h1>
          <p>{error || 'Failed to load breed information'}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{breedData.name}</h1>
        
        <div className={styles.overview}>
          <div className={styles.imageGallery}>
            {breedData.images.length > 0 ? (
              breedData.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={breedData.name}
                  className={styles.breedImage}
                  loading="lazy"
                />
              ))
            ) : (
              <p>No images available for this breed</p>
            )}
          </div>
          
          <div className={styles.details}>
            <h2>Overview</h2>
            <p>{breedData.wikipedia.description}</p>
            
            {breedData.dogApi && (
              <div className={styles.characteristics}>
                <h3>Key Characteristics</h3>
                <ul>
                  <li><strong>Breed Group:</strong> {breedData.dogApi.breed_group || 'N/A'}</li>
                  <li><strong>Life Span:</strong> {breedData.dogApi.life_span || 'N/A'}</li>
                  <li><strong>Temperament:</strong> {breedData.dogApi.temperament || 'N/A'}</li>
                  <li><strong>Weight:</strong> {breedData.dogApi.weight?.metric || 'N/A'} kg</li>
                  <li><strong>Height:</strong> {breedData.dogApi.height?.metric || 'N/A'} cm</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {breedData.wikipedia.url !== '#' && (
          <div className={styles.additionalInfo}>
            <h2>More Information</h2>
            <p>
              Read more about {breedData.name} on{' '}
              <a href={breedData.wikipedia.url} target="_blank" rel="noopener noreferrer">
                Wikipedia
              </a>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
