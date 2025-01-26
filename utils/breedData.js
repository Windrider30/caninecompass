// Ensure searchBreeds is exported at the bottom of the file
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

// Ensure all exports are listed at the bottom
export { fetchBreedInfo, searchBreeds };
