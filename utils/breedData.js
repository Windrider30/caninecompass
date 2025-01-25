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

export const fetchBreedInfo = async (breedName) => {
  try {
    // Wikipedia API
    const wikiResponse = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(breedName + ' (dog)')}`,
      {
        validateStatus: (status) => status < 500
      }
    );

    // Verify we're getting dog breed information
    if (wikiResponse.data.title.toLowerCase().indexOf('dog') === -1 &&
        wikiResponse.data.description.toLowerCase().indexOf('dog') === -1 &&
        wikiResponse.data.extract.toLowerCase().indexOf('dog') === -1) {
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
      images: [...dogImages, ...pixabayImages].slice(0, 10) // Limit to 10 images
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
      images: []
    };
  }
};

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
