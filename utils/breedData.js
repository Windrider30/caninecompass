// Define initialBreeds array
export const initialBreeds = [
  // ... (keep existing breeds data)
];

// Utility functions
export const getBreedById = (id) => {
  return initialBreeds.find(breed => breed.id === id);
};

export const getBreedsByCategory = (categoryId) => {
  return initialBreeds.filter(breed => breed.category === categoryId);
};

export const getAllBreeds = () => {
  return initialBreeds;
};

export const searchBreeds = (query) => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return initialBreeds.filter(breed => 
    breed.name.toLowerCase().includes(lowerQuery) ||
    breed.description.toLowerCase().includes(lowerQuery) ||
    breed.category.toLowerCase().includes(lowerQuery)
  );
};

// API-related functions
export const fetchBreedDetails = async (id) => {
  return getBreedById(id);
};

export const fetchAllBreeds = async () => {
  return initialBreeds;
};
