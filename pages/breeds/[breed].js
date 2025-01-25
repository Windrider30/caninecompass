// Add this CSS to styles/BreedDetail.module.css
.familySuitability {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.familySuitability h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.suitabilityList {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.suitabilityItem {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.suitabilityItem h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.suitabilityItem p {
  color: #4a5568;
}

// Update the BreedDetailPage component
import styles from '../../styles/BreedDetail.module.css';

// Add this component inside the return statement, after the additionalInfo section
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
