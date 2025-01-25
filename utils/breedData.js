// Add this function to analyze family suitability
const getFamilySuitability = (breedData) => {
  const { temperament, weight, height, life_span } = breedData.dogApi || {};
  const { description } = breedData.wikipedia || {};

  const suitability = {
    familiesWithChildren: false,
    singles: false,
    seniors: false,
    activeFamilies: false,
    apartmentLiving: false,
  };

  if (!temperament || !weight || !height) return suitability;

  // Analyze temperament
  const temperamentKeywords = temperament.toLowerCase().split(', ');
  if (
    temperamentKeywords.includes('friendly') ||
    temperamentKeywords.includes('gentle') ||
    temperamentKeywords.includes('patient')
  ) {
    suitability.familiesWithChildren = true;
  }

  if (
    temperamentKeywords.includes('loyal') ||
    temperamentKeywords.includes('affectionate') ||
    temperamentKeywords.includes('companionable')
  ) {
    suitability.singles = true;
    suitability.seniors = true;
  }

  if (
    temperamentKeywords.includes('energetic') ||
    temperamentKeywords.includes('athletic') ||
    temperamentKeywords.includes('playful')
  ) {
    suitability.activeFamilies = true;
  }

  // Analyze size and weight
  const weightKg = parseFloat(weight.metric.split(' - ')[0]);
  const heightCm = parseFloat(height.metric.split(' - ')[0]);

  if (weightKg < 20 && heightCm < 50) {
    suitability.apartmentLiving = true;
  }

  // Analyze lifespan
  const lifespanYears = parseFloat(life_span.split(' - ')[0]);
  if (lifespanYears >= 12) {
    suitability.seniors = true;
  }

  // Analyze Wikipedia description
  if (description) {
    const descriptionLower = description.toLowerCase();
    if (descriptionLower.includes('good with children')) {
      suitability.familiesWithChildren = true;
    }
    if (descriptionLower.includes('apartment') || descriptionLower.includes('small space')) {
      suitability.apartmentLiving = true;
    }
  }

  return suitability;
};

// Update fetchBreedInfo to include suitability
export const fetchBreedInfo = async (breedName) => {
  try {
    // ... (existing code)

    // Combine data
    const combinedData = {
      name: breedName,
      wikipedia: {
        description: wikiResponse.data.extract || 'No description available',
        url: wikiResponse.data.content_urls?.desktop?.page || '#'
      },
      dogApi: dogApiResponse.data[0],
      images: [...dogImages, ...pixabayImages].slice(0, 10),
      suitability: getFamilySuitability({
        dogApi: dogApiResponse.data[0],
        wikipedia: {
          description: wikiResponse.data.extract
        }
      })
    };

    return combinedData;
  } catch (error) {
    handleApiError(error);
    return {
      name: breedName,
      wikipedia: {
        description: 'No description available',
        url: '#'
      },
      dogApi: null,
      images: [],
      suitability: {
        familiesWithChildren: false,
        singles: false,
        seniors: false,
        activeFamilies: false,
        apartmentLiving: false
      }
    };
  }
};
