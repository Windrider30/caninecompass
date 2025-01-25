// Add logging to debug image URLs
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

    console.log('Dog API Images:', response.data); // Log Dog API response

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

    console.log('Pixabay Images:', response.data.hits); // Log Pixabay response

    return response.data.hits.map(img => img.webformatURL);
  } catch (error) {
    handleApiError(error);
    return [];
  }
};
