import bcrypt from 'bcryptjs'; // For hashing passwords
import jwt from 'jsonwebtoken'; // For creating JWT
import User from '../models/user.model.js'; // Import User model

// Create a new user (with password hashing)
export const createUser = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the hashed password
    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await user.save();

    // Respond with the newly created user (without password)
    res.status(201).json({ message: 'User created successfully', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();  // Get all users from the database
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Login user (password validation and JWT generation)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    // If the user doesn't exist, send an error
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token
    const payload = {
      userId: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,  // You may want to send the role in the token
    };

    const secretKey = process.env.JWT_SECRET || 'yourSecretKey';  // Use an environment variable for the secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Token expires in 1 hour

    // Respond with the JWT token
    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};
