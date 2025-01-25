import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import styles from '../../styles/BreedDetail.module.css';
import { useRouter } from 'next/router';
import { fetchBreedInfo, searchBreeds } from '../../utils/breedData';

// Fetch all breed paths at build time
export async function getStaticPaths() {
  // Fetch all breeds from the Dog API
  const breeds = await searchBreeds('');

  // Generate paths for each breed
  const paths = breeds.map((breed) => ({
    params: { breed: breed.name.toLowerCase().replace(/ /g, '-') },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate pages on-demand if not pre-rendered
  };
}

// Fetch breed data at build time
export async function getStaticProps({ params }) {
  const breedName = params.breed.replace(/-/g, ' ');
  const breedData = await fetchBreedInfo(breedName);

  if (!breedData) {
    return {
      notFound: true, // Return 404 if breed is not found
    };
  }

  return {
    props: {
      breedData,
    },
    revalidate: 60 * 60, // Revalidate data every hour (in seconds)
  };
}

export default function BreedDetailPage({ breedData: initialBreedData }) {
  const router = useRouter();
  const [breedData, setBreedData] = useState(initialBreedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialBreedData && router.isReady) {
      // Fetch breed data on the client side if not pre-rendered
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetchBreedInfo(router.query.breed);
          if (!data) {
            throw new Error('Breed information not found');
          }
          setBreedData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [router.isReady, router.query.breed, initialBreedData]);

  if (router.isFallback || loading) {
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

        {breedData.suitability && (
          <div className={styles.familySuitability}>
            <h2>Family Suitability</h2>
            <div className={styles.suitabilityList}>
              {breedData.suitability.familiesWithChildren && (
                <div className={styles.suitabilityItem}>
                  <h3>👨‍👩‍👧‍👦 Families with Children</h3>
                  <p>This breed is great for families with kids due to its friendly and patient nature.</p>
                </div>
              )}
              {breedData.suitability.singles && (
                <div className={styles.suitabilityItem}>
                  <h3>👤 Singles</h3>
                  <p>Perfect for individuals looking for a loyal and affectionate companion.</p>
                </div>
              )}
              {breedData.suitability.seniors && (
                <div className={styles.suitabilityItem}>
                  <h3>👵 Seniors</h3>
                  <p>Ideal for seniors due to its calm temperament and manageable size.</p>
                </div>
              )}
              {breedData.suitability.activeFamilies && (
                <div className={styles.suitabilityItem}>
                  <h3>🏃‍♂️ Active Families</h3>
                  <p>Great for active families who enjoy outdoor activities and exercise.</p>
                </div>
              )}
              {breedData.suitability.apartmentLiving && (
                <div className={styles.suitabilityItem}>
                  <h3>🏢 Apartment Living</h3>
                  <p>Well-suited for apartment living due to its small size and adaptability.</p>
                </div>
              )}
            </div>
          </div>
        )}

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
