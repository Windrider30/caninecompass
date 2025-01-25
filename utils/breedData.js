import axios from 'axios';

const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
  } else if (error.request) {
    console.error('API Request Error:', error.request);
  } else {
    console.error('API Setup Error:', error.message);
  }
  return null;
};

// Fetch all breeds
export const searchBreeds = async (query) => {
  try {
    const response = await axios.get(
      `/api/dogapi/breeds/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
        },
        validateStatus: (status) => status < 500
      }
    );

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Fetch breed info
export const fetchBreedInfo = async (breedName) => {
  try {
    const wikiResponse = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(breedName + ' (dog)')}`,
      {
        validateStatus: (status) => status < 500
      }
    );

    // Verify we're getting dog breed information
    if (
      !wikiResponse.data ||
      (!wikiResponse.data.title.toLowerCase().includes('dog') &&
       !wikiResponse.data.description.toLowerCase().includes('dog') &&
       !wikiResponse.data.extract.toLowerCase().includes('dog'))
    ) {
      throw new Error('Not a dog breed page');
    }

    // Dog API
    const dogApiResponse = await axios.get(
      `/api/dogapi/breeds/search?q=${encodeURIComponent(breedName)}`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
        },
        validateStatus: (status) => status < 500
      }
    );

    // If no breed found in Dog API
    if (!dogApiResponse.data || dogApiResponse.data.length === 0) {
      throw new Error('Breed not found in Dog API');
    }

    const breedId = dogApiResponse.data[0].id;
    
    // Fetch images from both APIs
    const [dogImages, pixabayImages] = await Promise.all([
      fetchDogImages(breedId),
      fetchPixabayImages(breedName)
    ]);

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

// Fetch dog images
const fetchDogImages = async (breedId) => {
  try {
    const response = await axios.get(
      `/api/dogapi/images/search?limit=10&breed_ids=${breedId}`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
        }
      }
    );
    return response.data.map(img => img.url);
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Fetch Pixabay images
const fetchPixabayImages = async (breedName) => {
  try {
    const response = await axios.get(
      `/api/proxy/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${encodeURIComponent(breedName + ' dog')}&image_type=photo&per_page=10`
    );
    return response.data.hits.map(img => img.webformatURL);
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Fetch all breeds
export const fetchAllBreeds = async () => {
  try {
    const response = await axios.get(
      '/api/dogapi/breeds',
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
        },
        validateStatus: (status) => status < 500
      }
    );

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Fetch breed details
export const fetchBreedDetails = async (breedId) => {
  try {
    const response = await axios.get(
      `/api/dogapi/breeds/${breedId}`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY
        },
        validateStatus: (status) => status < 500
      }
    );

    if (!response.data) {
      throw new Error('Breed not found');
    }

    return response.data;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

// Get family suitability
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
