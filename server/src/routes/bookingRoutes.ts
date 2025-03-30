import express from 'express';
import db from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { carId, startDate, endDate, totalPrice } = req.body;
    const userId = req.user!.id;

    // Check if car exists and is available
    const carCheck = await db.query(
      'SELECT * FROM cars WHERE id = $1 AND availability = TRUE',
      [carId]
    );

    if (carCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found or not available' });
    }

    // Check if car is already booked for requested dates
    const bookingCheck = await db.query(
      `SELECT * FROM bookings 
      WHERE car_id = $1 AND status NOT IN ('cancelled') 
      AND (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      )`,
      [carId, startDate, endDate]
    );

    if (bookingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Car is not available for the selected dates' });
    }

    // Create the booking
    const result = await db.query(
      `INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [userId, carId, startDate, endDate, totalPrice, 'confirmed']
    );

    const booking = result.rows[0];

    res.status(201).json({
      id: booking.id.toString(),
      userId: booking.user_id.toString(),
      carId: booking.car_id.toString(),
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for a user
router.get('/user/:userId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own bookings
    if (parseInt(userId) !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(
      `SELECT b.*, c.make, c.model, c.image_url
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC`,
      [userId]
    );

    const bookings = result.rows.map(booking => ({
      id: booking.id.toString(),
      userId: booking.user_id.toString(),
      carId: booking.car_id.toString(),
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      car: {
        make: booking.make,
        model: booking.model,
        imageUrl: booking.image_url
      }
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bookings for a car
router.get('/car/:carId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { carId } = req.params;
    
    // Check if user is the host of the car
    const carCheck = await db.query(
      'SELECT host_id FROM cars WHERE id = $1',
      [carId]
    );
    
    if (carCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    if (carCheck.rows[0].host_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(
      `SELECT b.*, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.car_id = $1
      ORDER BY b.start_date ASC`,
      [carId]
    );

    const bookings = result.rows.map(booking => ({
      id: booking.id.toString(),
      userId: booking.user_id.toString(),
      carId: booking.car_id.toString(),
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalPrice: parseFloat(booking.total_price),
      status: booking.status,
      user: {
        name: booking.user_name,
        email: booking.user_email
      }
    }));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching car bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status
router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Get booking details to check permissions
    const bookingCheck = await db.query(
      `SELECT b.*, c.host_id 
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      WHERE b.id = $1`,
      [id]
    );
    
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = bookingCheck.rows[0];
    
    // Check if user is authorized (user who made booking or host of the car)
    if (booking.user_id !== req.user!.id && booking.host_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Users can only cancel their own bookings
    // Hosts can confirm, complete, or cancel bookings
    if (req.user!.id === booking.user_id && status !== 'cancelled') {
      return res.status(403).json({ error: 'Users can only cancel bookings' });
    }
    
    const result = await db.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    const updatedBooking = result.rows[0];
    
    res.json({
      id: updatedBooking.id.toString(),
      userId: updatedBooking.user_id.toString(),
      carId: updatedBooking.car_id.toString(),
      startDate: updatedBooking.start_date,
      endDate: updatedBooking.end_date,
      totalPrice: parseFloat(updatedBooking.total_price),
      status: updatedBooking.status
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
