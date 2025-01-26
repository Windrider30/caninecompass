// Search breeds by query
export const searchBreeds = async (query) => {
  try {
    // Ensure the API URL is correct
    const apiUrl = `${process.env.NEXT_PUBLIC_DOG_API_URL}/breeds/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(apiUrl, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search error:', error);
    return []; // Return an empty array if there's an error
  }
};
