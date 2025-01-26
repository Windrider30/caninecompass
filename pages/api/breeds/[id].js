import { fetchBreedDetails } from '../../../utils/breedData';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Breed ID is required' });
    }

    const breedDetails = await fetchBreedDetails(id);
    if (!breedDetails) {
      return res.status(404).json({ message: 'Breed not found' });
    }

    res.status(200).json(breedDetails);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
