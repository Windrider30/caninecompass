import Layout from '../../components/Layout';
import styles from '../../styles/BreedDetail.module.css';
import { useRouter } from 'next/router';

export default function BreedDetailPage() {
  const router = useRouter();
  const { breed } = router.query;

  // Placeholder data - will be replaced with API data
  const breedData = {
    id: breed,
    name: breed.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `The ${breed.replace(/-/g, ' ')} is a wonderful breed known for...`,
    characteristics: {
      size: 'Medium',
      lifespan: '10-12 years',
      temperament: ['Friendly', 'Energetic', 'Intelligent'],
      goodWith: ['Children', 'Other Dogs'],
      exerciseNeeds: 'High',
      groomingNeeds: 'Moderate'
    },
    images: [
      '/images/placeholder.jpg',
      '/images/placeholder.jpg',
      '/images/placeholder.jpg'
    ]
  };

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
