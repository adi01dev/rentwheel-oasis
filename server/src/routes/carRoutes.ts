import express from 'express';
import db from '../db';
import { authenticateToken, checkRole, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all cars
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        c.id, u.id as host_id, c.make, c.model, c.year, c.price, 
        c.location, c.description, c.image_url, c.features, c.availability
      FROM cars c
      JOIN users u ON c.host_id = u.id
      WHERE c.availability = TRUE
      ORDER BY c.created_at DESC`
    );

    const cars = result.rows.map(car => ({
      id: car.id.toString(),
      hostId: car.host_id.toString(),
      make: car.make,
      model: car.model,
      year: car.year,
      price: parseFloat(car.price),
      location: car.location,
      description: car.description,
      imageUrl: car.image_url,
      features: car.features,
      availability: car.availability
    }));

    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get car by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT 
        c.id, u.id as host_id, c.make, c.model, c.year, c.price, 
        c.location, c.description, c.image_url, c.features, c.availability
      FROM cars c
      JOIN users u ON c.host_id = u.id
      WHERE c.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const car = result.rows[0];
    
    res.json({
      id: car.id.toString(),
      hostId: car.host_id.toString(),
      make: car.make,
      model: car.model,
      year: car.year,
      price: parseFloat(car.price),
      location: car.location,
      description: car.description,
      imageUrl: car.image_url,
      features: car.features,
      availability: car.availability
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search cars by location
router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;
    
    let query = `
      SELECT 
        c.id, u.id as host_id, c.make, c.model, c.year, c.price, 
        c.location, c.description, c.image_url, c.features, c.availability
      FROM cars c
      JOIN users u ON c.host_id = u.id
      WHERE c.availability = TRUE
    `;
    
    const params: any[] = [];
    
    if (location) {
      query += ` AND c.location ILIKE $1`;
      params.push(`%${location}%`);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await db.query(query, params);
    
    const cars = result.rows.map(car => ({
      id: car.id.toString(),
      hostId: car.host_id.toString(),
      make: car.make,
      model: car.model,
      year: car.year,
      price: parseFloat(car.price),
      location: car.location,
      description: car.description,
      imageUrl: car.image_url,
      features: car.features,
      availability: car.availability
    }));
    
    res.json(cars);
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get cars by host ID
router.get('/host/:hostId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { hostId } = req.params;
    
    const result = await db.query(
      `SELECT 
        c.id, u.id as host_id, c.make, c.model, c.year, c.price, 
        c.location, c.description, c.image_url, c.features, c.availability
      FROM cars c
      JOIN users u ON c.host_id = u.id
      WHERE c.host_id = $1
      ORDER BY c.created_at DESC`,
      [hostId]
    );
    
    const cars = result.rows.map(car => ({
      id: car.id.toString(),
      hostId: car.host_id.toString(),
      make: car.make,
      model: car.model,
      year: car.year,
      price: parseFloat(car.price),
      location: car.location,
      description: car.description,
      imageUrl: car.image_url,
      features: car.features,
      availability: car.availability
    }));
    
    res.json(cars);
  } catch (error) {
    console.error('Error fetching host cars:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new car
router.post('/', authenticateToken, checkRole('host'), async (req: AuthRequest, res) => {
  try {
    const {
      make,
      model,
      year,
      price,
      location,
      description,
      imageUrl,
      features
    } = req.body;
    
    // Add validation here
    
    const result = await db.query(
      `INSERT INTO cars 
        (host_id, make, model, year, price, location, description, image_url, features) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [req.user!.id, make, model, year, price, location, description, imageUrl, features]
    );
    
    const newCar = result.rows[0];
    
    res.status(201).json({
      id: newCar.id.toString(),
      hostId: newCar.host_id.toString(),
      make: newCar.make,
      model: newCar.model,
      year: newCar.year,
      price: parseFloat(newCar.price),
      location: newCar.location,
      description: newCar.description,
      imageUrl: newCar.image_url,
      features: newCar.features,
      availability: newCar.availability
    });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update car
router.put('/:id', authenticateToken, checkRole('host'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      make,
      model,
      year,
      price,
      location,
      description,
      imageUrl,
      features,
      availability
    } = req.body;
    
    // Check if car belongs to host
    const carCheck = await db.query(
      'SELECT * FROM cars WHERE id = $1',
      [id]
    );
    
    if (carCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    if (carCheck.rows[0].host_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const result = await db.query(
      `UPDATE cars 
      SET make = $1, model = $2, year = $3, price = $4, location = $5, 
          description = $6, image_url = $7, features = $8, availability = $9
      WHERE id = $10 AND host_id = $11
      RETURNING *`,
      [make, model, year, price, location, description, imageUrl, features, availability, id, req.user!.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found or not authorized' });
    }
    
    const updatedCar = result.rows[0];
    
    res.json({
      id: updatedCar.id.toString(),
      hostId: updatedCar.host_id.toString(),
      make: updatedCar.make,
      model: updatedCar.model,
      year: updatedCar.year,
      price: parseFloat(updatedCar.price),
      location: updatedCar.location,
      description: updatedCar.description,
      imageUrl: updatedCar.image_url,
      features: updatedCar.features,
      availability: updatedCar.availability
    });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete car
router.delete('/:id', authenticateToken, checkRole('host'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    // Check if car belongs to host
    const carCheck = await db.query(
      'SELECT * FROM cars WHERE id = $1',
      [id]
    );
    
    if (carCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    if (carCheck.rows[0].host_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await db.query(
      'DELETE FROM cars WHERE id = $1 AND host_id = $2',
      [id, req.user!.id]
    );
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
