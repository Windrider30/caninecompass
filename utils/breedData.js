// Fallback search function using local data
export const searchBreeds = async (query) => {
  try {
    // Try fetching from the API first
    const apiUrl = `${process.env.NEXT_PUBLIC_DOG_API_URL}/breeds/search?q=${encodeURIComponent(query)}`;
    console.log('Making request to:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY,
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API search failed, using local data:', error);

    // Fallback to local data if API fails
    return initialBreeds.filter((breed) =>
      breed.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};
