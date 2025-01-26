import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import styles from '../../styles/BreedDetail.module.css';
import { useRouter } from 'next/router';

export default function BreedDetailPage() {
  const router = useRouter();
  const { breed } = router.query;
  const [breedData, setBreedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!breed) return;

    const fetchBreedData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch from Dog API
        const dogApiResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_DOG_API_URL}/breeds/${breed}`,
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
            }
          }
        );

        // Fetch Wikipedia summary
        const wikipediaResponse = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${dogApiResponse.data.name}`
        );

        // Fetch images from Pixabay
        const pixabayResponse = await axios.get(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${encodeURIComponent(dogApiResponse.data.name + ' dog')}&image_type=photo&per_page=5`
        );

        // Combine data
        const combinedData = {
          id: dogApiResponse.data.id,
          name: dogApiResponse.data.name,
          description: wikipediaResponse.data.extract,
          images: pixabayResponse.data.hits.length > 0 ?
            pixabayResponse.data.hits.map(hit => hit.webformatURL) :
            ['/images/fallback.jpg'],
          characteristics: {
            size: dogApiResponse.data.height?.metric || 'Unknown',
            lifespan: dogApiResponse.data.life_span || 'Unknown',
            temperament: dogApiResponse.data.temperament?.split(', ') || [],
            goodWith: dogApiResponse.data.bred_for?.split(', ') || [],
            exerciseNeeds: dogApiResponse.data.energy_level || 'Unknown',
            groomingNeeds: dogApiResponse.data.grooming || 'Unknown'
          }
        };

        setBreedData(combinedData);
      } catch (error) {
        console.error('Error fetching breed data:', error);
        setError('Failed to fetch breed details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreedData();
  }, [breed]);

  if (isLoading) return <Layout>Loading...</Layout>;
  if (error) return <Layout>{error}</Layout>;
  if (!breedData) return <Layout>Breed not found</Layout>;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{breedData.name}</h1>
        
        <div className={styles.overview}>
          <div className={styles.imageGallery}>
            {breedData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={breedData.name}
                className={styles.breedImage}
              />
            ))}
          </div>
          
          <div className={styles.details}>
            <h2>Overview</h2>
            <p>{breedData.description}</p>
            
            <div className={styles.characteristics}>
              <h3>Key Characteristics</h3>
              <ul>
                <li><strong>Size:</strong> {breedData.characteristics.size}</li>
                <li><strong>Lifespan:</strong> {breedData.characteristics.lifespan}</li>
                <li>
                  <strong>Temperament:</strong> 
                  {breedData.characteristics.temperament.join(', ')}
                </li>
                <li>
                  <strong>Good With:</strong> 
                  {breedData.characteristics.goodWith.join(', ')}
                </li>
                <li>
                  <strong>Exercise Needs:</strong> 
                  {breedData.characteristics.exerciseNeeds}
                </li>
                <li>
                  <strong>Grooming Needs:</strong> 
                  {breedData.characteristics.groomingNeeds}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.additionalInfo}>
          <h2>More About {breedData.name}</h2>
          <p>
            Additional detailed information about the breed's history, care requirements,
            training tips, and health considerations will be displayed here.
          </p>
        </div>
      </div>
    </Layout>
  );
}
