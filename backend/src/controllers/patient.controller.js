import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing and comparison
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for JWT creation
import Patient from '../models/patient.model.js'; // Import Patient model

// Add a new patient (with password hashing)
export const addPatient = async (req, res) => {
  const { full_name, dob, gender, contact_info, assigned_doctor, medical_history, password } = req.body;

  try {
    // Check if the required fields are provided
    if (!full_name || !dob || !gender || !contact_info || !assigned_doctor || !medical_history || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new Patient instance with hashed password
    const newPatient = new Patient({
      full_name,
      dob,
      gender,
      contact_info,
      assigned_doctor,
      medical_history,
      password: hashedPassword // Save the hashed password
    });

    // Save the patient to the database
    await newPatient.save();

    // Respond with the newly created patient (without password)
    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: 'Error adding patient', error: error.message });
  }
};

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    // If no patients found, send an empty array with a message
    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found' });
    }

    // Respond with the list of patients (without passwords)
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Get patient details by ID
export const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the patient by ID and populate the assigned doctor
    const patient = await Patient.findById(id).populate('assigned_doctor');

    // If patient not found, send a 404 response
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Respond with the patient details (without password)
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

// Login patient (password validation and JWT generation)
export const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the patient by email
    const patient = await Patient.findOne({ 'contact_info.email': email });

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Patient not found' });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    // Generate JWT token
    const payload = {
      patientId: patient._id,
      full_name: patient.full_name,
      email: patient.contact_info.email,
    };

    const secretKey = process.env.JWT_SECRET || 'yourSecretKey'; // Use an environment variable for secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Token expires in 1 hour

    // Respond with the JWT token
    res.json({ success: true, message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
