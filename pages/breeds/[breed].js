// Add a fallback image URL
const fallbackImage = '/images/fallback.jpg';

// Update the image gallery section
<div className={styles.imageGallery}>
  {breedData.images.length > 0 ? (
    breedData.images.map((image, index) => (
      <img
        key={index}
        src={image || fallbackImage} // Use fallback if image URL is invalid
        alt={breedData.name}
        className={styles.breedImage}
        loading="lazy"
      />
    ))
  ) : (
    <img
      src={fallbackImage}
      alt="No images available"
      className={styles.breedImage}
    />
  )}
</div>
