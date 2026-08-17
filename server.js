

const express = require('express');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// ---------------------
// IN-MEMORY DATABASE
// ---------------------

let nextStationId = 5;
let nextBookingId = 102;

let stations = [
  {
    id: 1,
    name: "Zeon EV Fast Charger",
    location: "Indiranagar",
    address: "100 Feet Rd, Bengaluru",
    type: "CCS2 (Fast)",
    availability: "Available",
    hours: "24/7",
    contact: "+91 98765 11111",
    info: "400V DC Fast Charger with amenities nearby."
  },
  {
    id: 2,
    name: "Tata Power EZ Charge",
    location: "Koramangala",
    address: "80 Feet Rd, 4th Block, Bengaluru",
    type: "Type 2 (AC)",
    availability: "Available",
    hours: "06:00 AM - 11:00 PM",
    contact: "+91 98765 22222",
    info: "Suitable for slow overnight or work hours charging."
  },
  {
    id: 3,
    name: "Jio-bp Pulse Hub",
    location: "HSR Layout",
    address: "Sector 3, Outer Ring Rd, Bengaluru",
    type: "CCS2 (Fast)",
    availability: "Busy",
    hours: "24/7",
    contact: "+91 98765 33333",
    info: "High demand station. Booking ahead recommended."
  },
  {
    id: 4,
    name: "Ather Grid Charger",
    location: "Whitefield",
    address: "ITPL Main Rd, Bengaluru",
    type: "GB/T (Fast)",
    availability: "Maintenance",
    hours: "08:00 AM - 08:00 PM",
    contact: "+91 98765 44444",
    info: "Currently under maintenance till 5 PM."
  }
];

let bookings = [
  {
    id: 101,
    stationId: 1,
    stationName: "Zeon EV Fast Charger",
    userName: "Rahul Sharma",
    userEmail: "rahul@example.com",
    userContact: "+91 9812345678",
    vehicleInfo: "Tata Nexon EV (KA-01-AB-1234)",
    date: "2026-08-20",
    time: "14:30",
    notes: "Full charge needed",
    status: "CONFIRMED"
  }
];

// ---------------------
// ROOT ROUTE
// ---------------------

app.get('/', function (request, response) {
  response.send('EV Charging Station Booking API is running');
});

// ---------------------
// CHARGING STATION ROUTES
// ---------------------

// Get all charging stations
app.get('/api/stations', function (request, response) {
  response.json({
    message: 'All stations fetched successfully.',
    data: stations
  });
});

// Get a single station by ID
app.get('/api/stations/:id', function (request, response) {
  const stationId = Number(request.params.id);
  const station = stations.find(s => s.id === stationId);

  if (!station) {
    return response.status(404).json({ message: 'Station not found.' });
  }

  response.json({
    message: 'Station fetched successfully.',
    data: station
  });
});

// Add a new charging station
app.post('/api/stations', function (request, response) {
  const { name, location, address, type, availability, hours, contact, info } = request.body;

  if (!name || !location || !address || !type || !contact) {
    return response.status(400).json({
      message: 'Please provide name, location, address, type, and contact.'
    });
  }

  const newStation = {
    id: nextStationId,
    name,
    location,
    address,
    type,
    availability: availability || 'Available',
    hours: hours || '24/7',
    contact,
    info: info || 'N/A'
  };

  stations.push(newStation);
  nextStationId += 1;

  response.status(201).json({
    message: 'Station created successfully.',
    data: newStation
  });
});

// Update an existing charging station
app.put('/api/stations/:id', function (request, response) {
  const stationId = Number(request.params.id);
  const station = stations.find(s => s.id === stationId);

  if (!station) {
    return response.status(404).json({ message: 'Station not found.' });
  }

  const { name, location, address, type, availability, hours, contact, info } = request.body;

  if (name) station.name = name;
  if (location) station.location = location;
  if (address) station.address = address;
  if (type) station.type = type;
  if (availability) station.availability = availability;
  if (hours) station.hours = hours;
  if (contact) station.contact = contact;
  if (info) station.info = info;

  response.json({
    message: 'Station updated successfully.',
    data: station
  });
});

// Delete a charging station
app.delete('/api/stations/:id', function (request, response) {
  const stationId = Number(request.params.id);
  const index = stations.findIndex(s => s.id === stationId);

  if (index === -1) {
    return response.status(404).json({ message: 'Station not found.' });
  }

  const deletedStation = stations.splice(index, 1)[0];

  response.json({
    message: 'Station deleted successfully.',
    data: deletedStation
  });
});

// ---------------------
// BOOKING ROUTES
// ---------------------

// Get all bookings
app.get('/api/bookings', function (request, response) {
  response.json({
    message: 'All bookings fetched successfully.',
    data: bookings
  });
});

// Get a single booking by ID
app.get('/api/bookings/:id', function (request, response) {
  const bookingId = Number(request.params.id);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return response.status(404).json({ message: 'Booking not found.' });
  }

  response.json({
    message: 'Booking fetched successfully.',
    data: booking
  });
});

// Create a new booking
app.post('/api/bookings', function (request, response) {
  const { stationId, userName, userEmail, userContact, vehicleInfo, date, time, notes } = request.body;

  // Find target station
  const station = stations.find(s => s.id === Number(stationId));

  if (!station) {
    return response.status(404).json({ message: 'Station not found.' });
  }

  // Validate required fields
  if (!userName || !userEmail || !userContact || !vehicleInfo || !date || !time) {
    return response.status(400).json({
      message: 'Please provide userName, userEmail, userContact, vehicleInfo, date, and time.'
    });
  }

  // Check if station is available
  if (station.availability === 'Maintenance') {
    return response.status(400).json({ message: 'This station is under maintenance.' });
  }

  const newBooking = {
    id: nextBookingId,
    stationId: station.id,
    stationName: station.name,
    userName,
    userEmail,
    userContact,
    vehicleInfo,
    date,
    time,
    notes: notes || 'None',
    status: 'CONFIRMED'
  };

  bookings.push(newBooking);
  nextBookingId += 1;

  response.status(201).json({
    message: `Booking complete! Confirmation email sent to ${userEmail}.`,
    data: newBooking
  });
});

// Update a booking (e.g., change date, time, or notes)
app.put('/api/bookings/:id', function (request, response) {
  const bookingId = Number(request.params.id);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return response.status(404).json({ message: 'Booking not found.' });
  }

  const { date, time, notes, status } = request.body;

  if (date) booking.date = date;
  if (time) booking.time = time;
  if (notes) booking.notes = notes;
  if (status) booking.status = status;

  response.json({
    message: 'Booking updated successfully.',
    data: booking
  });
});

// Cancel or delete a booking
app.delete('/api/bookings/:id', function (request, response) {
  const bookingId = Number(request.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);

  if (index === -1) {
    return response.status(404).json({ message: 'Booking not found.' });
  }

  const deletedBooking = bookings.splice(index, 1)[0];

  response.json({
    message: 'Booking cancelled/deleted successfully.',
    data: deletedBooking
  });
});

// ---------------------
// 404 CATCH-ALL ROUTE
// ---------------------

app.use(function (request, response) {
  response.status(404).json({ message: 'Route not found.' });
});

// Start Server
app.listen(PORT, function () {
  console.log('API is running');
  console.log(`Server is running at http://localhost:${PORT}`);
});