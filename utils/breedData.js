// Breed categories data
export const breedCategories = [
  {
    id: 'working',
    name: 'Working Dogs',
    description: 'Dogs bred for specific tasks like guarding, pulling sleds, or water rescue.'
  },
  {
    id: 'herding',
    name: 'Herding Dogs',
    description: 'Dogs bred to herd livestock, known for their intelligence and energy.'
  },
  {
    id: 'hound',
    name: 'Hound Dogs',
    description: 'Dogs bred for hunting, known for their keen sense of smell or sight.'
  },
  {
    id: 'terrier',
    name: 'Terrier Dogs',
    description: 'Small, energetic dogs originally bred for hunting vermin.'
  },
  {
    id: 'toy',
    name: 'Toy Dogs',
    description: 'Small companion dogs bred primarily for their size and appearance.'
  },
  {
    id: 'non-sporting',
    name: 'Non-Sporting Dogs',
    description: 'Diverse group of companion dogs that don\'t fit into other categories.'
  }
];

// Initial breeds data
export const initialBreeds = [
  {
    id: 'affenpinscher',
    name: 'Affenpinscher',
    category: 'toy',
    description: 'The Affenpinscher is a German breed of small toy dog of Pinscher type.',
    characteristics: {
      size: 'small',
      energy: 'high',
      familyFriendly: 'moderate',
      trainability: 'moderate'
    }
  },
  {
    id: 'afghan-hound',
    name: 'Afghan Hound',
    category: 'hound',
    description: 'The Afghan Hound is a hound distinguished by its thick, fine, silky coat.',
    characteristics: {
      size: 'large',
      energy: 'moderate',
      familyFriendly: 'moderate',
      trainability: 'low'
    }
  },
  {
    id: 'airedale-terrier',
    name: 'Airedale Terrier',
    category: 'terrier',
    description: 'The Airedale Terrier is a dog breed of the terrier type.',
    characteristics: {
      size: 'medium',
      energy: 'high',
      familyFriendly: 'high',
      trainability: 'high'
    }
  }
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
  return initialBreeds.filter(breed => 
    breed.name.toLowerCase().includes(query.toLowerCase())
  );
};

// API-related functions
export const fetchBreedDetails = async (id) => {
  return getBreedById(id);
};

export const fetchAllBreeds = async () => {
  return initialBreeds;
};
