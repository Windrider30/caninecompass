// Add these functions to utils/breedData.js
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
