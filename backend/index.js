const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://nithinappari:75nlIXu4s977F7U6@cluster0.7ljelcs.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define User and Connection Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  workemail: String,
  createdon: {
    type: Date,
    default: Date.now, // Automatically sets the date when the document is created
  },
});

const connectionSchema = new mongoose.Schema({
  connectionId: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: String,
  invitationUrl: String,
});

const User = mongoose.model('User', userSchema);
const Connection = mongoose.model('Connection', connectionSchema);

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});
app.post('/api/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

app.put('/api/users/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user has any connections
    const existingConnections = await Connection.find({ user: userId });

    if (existingConnections.length > 0) {
      return res.status(400).json({ error: 'User cannot be deleted because they have active connections.' });
    }

    // If no connections are found, delete the user
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});


// Fetch all connections
app.get('/api/connections', async (req, res) => {
  try {
    const connections = await Connection.find().populate('user', 'name email'); // Populate user details

    // Format response data for better clarity
    const formattedConnections = connections.map(connection => ({
      id: connection._id.toString(),
      connectionId: connection.connectionId,
      user: {
        id: connection.user._id.toString(),
        name: connection.user.name,
        email: connection.user.email,
      },
      status: connection.status,
      invitationUrl: connection.invitationUrl,
    }));

    res.json(formattedConnections);
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ error: 'Error fetching connections' });
  }
});


// Create a connection and store it in the database
app.post('/api/connections', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create connection invitation
    const response = await axios.post(
      'https://issuer.aquarlabs.works:5004/connections/create-invitation',
      {},
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': 'ripcntsoon',
          'Content-Type': 'application/json',
        },
        params: { auto_accept: true },
      }
    );

    const connection = new Connection({
      connectionId: response.data.connection_id,
      user: user._id,
      status: 'Invitation Sent',
      invitationUrl: response.data.invitation_url,
    });

    await connection.save();
    res.json(connection);
  } catch (error) {
    console.error('Error creating connection:', error);
    res.status(500).json({ error: 'Error creating connection' });
  }
});

// Fetch connection status
app.get('/api/connections/:connectionId', async (req, res) => {
  const { connectionId } = req.params;

  try {
    const connection = await Connection.findOne({ connectionId }).populate('user', 'name email');

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Fetch updated connection status
    const response = await axios.get(
      `https://issuer.aquarlabs.works:5004/connections/${connectionId}`,
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': 'ripcntsoon',
        },
      }
    );

    connection.status = response.data.rfc23_state || 'Unknown';
    await connection.save();

    res.json(connection);
  } catch (error) {
    console.error('Error fetching connection record:', error);
    res.status(500).json({ error: 'Error fetching connection record' });
  }
});

// Listen on Port
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
