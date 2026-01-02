import Beds from '../models/bed.model.js';
// import Patient from '../models/Patient.js';
import {asyncHandler} from '../utils/async_handler.utils.js';
import {APIError} from '../utils/api_error_handler.utils.js';
import ApiResponse from '../utils/api_response.utils.js';

// 1. Create a new bed
export const createBed = asyncHandler(async (req, res) => {
  const { room_number, ward, bed_type } = req.body;

  if (!room_number || !ward || !bed_type) {
    throw new APIError(400, "All fields (room_number, ward, bed_type) are required");
  }

  const existingBed = await Beds.findOne({ room_number });
  if (existingBed) {
    throw new APIError(409, "Bed with this room number already exists");
  }

  const bed = await Beds.create({
    room_number,
    ward,
    bed_type,
    is_occupied: false
  });

  return res.status(201).json(new ApiResponse(201, "Bed created successfully", bed));
});

// 2. Get all beds
export const getAllBeds = asyncHandler(async (req, res) => {
  const beds = await Beds.find()
      .populate('assigned_patient', 'full_name dob')
      .populate('assigned_by', 'full_name role');
  return res.status(200).json(new ApiResponse(200, 'All beds fetched', beds));
});

// 2. Get available (unoccupied) beds
export const getAvailableBeds = asyncHandler(async (req, res) => {
  const beds = await Beds.find({ is_occupied: false });
  return res.status(200).json(new ApiResponse(200, 'Available beds fetched', beds));
});

// 3. Assign or release bed
export const assignPatientToBed = asyncHandler(async (req, res) => {
  const { bedId } = req.params;
  const { patientId, action } = req.body;

  const bed = await Beds.findById(bedId);
  if (!bed) throw new APIError(404, 'Bed not found');

  if (action === 'assign') {
    if (bed.is_occupied) throw new APIError(400, 'Bed already occupied');

    // Optional: check if patient already assigned to a bed
    const existing = await Beds.findOne({ assigned_patient: patientId });
    if (existing) throw new APIError(400, 'Patient is already assigned to another bed');

    bed.assigned_patient = patientId;
    bed.assigned_by = req.user.id; // Set who assigned
    bed.is_occupied = true;
  } else if (action === 'release') {
    if (!bed.is_occupied) throw new APIError(400, 'Bed is already unoccupied');

    bed.assigned_patient = null;
    bed.assigned_by = null; // Clear assignment
    bed.is_occupied = false;
  } else {
    throw new APIError(400, "Invalid action. Use 'assign' or 'release'");
  }

  await bed.save();
  return res.status(200).json(new ApiResponse(200, `Bed ${action}ed successfully`, bed));
});

// 4. Update bed metadata (admin only)
export const updateBedStatus = asyncHandler(async (req, res) => {
  const { bedId } = req.params;
  const { room_number, ward, bed_type } = req.body;

  const bed = await Beds.findById(bedId);
  if (!bed) throw new APIError(404, 'Bed not found');

  if (room_number) bed.room_number = room_number;
  if (ward) bed.ward = ward;
  if (bed_type) bed.bed_type = bed_type;

  await bed.save();
  return res.status(200).json(new ApiResponse(200, 'Bed details updated', bed));
});
