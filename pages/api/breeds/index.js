import { fetchAllBreeds } from '../../../utils/breedData';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const breeds = await fetchAllBreeds();
    if (!breeds || breeds.length === 0) {
      return res.status(404).json({ message: 'No breeds found' });
    }

    res.status(200).json(breeds);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
