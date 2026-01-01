import Inventory from '../models/inventory.model.js';
import {asyncHandler} from '../utils/async_handler.utils.js';
import {APIError} from '../utils/api_error_handler.utils.js';
import ApiResponse from '../utils/api_response.utils.js';

// Add new inventory item
export const addInventoryItem = asyncHandler(async (req, res) => {
  const { name, type, quantity_available, minimum_required, expiry_date, supplier_info } = req.body;
  const item = await Inventory.create({
    name,
    type,
    quantity_available,
    minimum_required,
    expiry_date,
    supplier_info
  });
  return res.status(201).json(new ApiResponse(201, 'Inventory item added successfully', item));
});

// Get all inventory items
export const getInventoryList = asyncHandler(async (req, res) => {
  const items = await Inventory.find();
  return res.status(200).json(new ApiResponse(200, 'Inventory list fetched successfully', items));
});

// Get a single inventory item by ID
export const getInventoryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Inventory.findById(itemId);
  if (!item) throw new APIError(404, 'Inventory item not found');
  return res.status(200).json(new ApiResponse(200, 'Inventory item fetched successfully', item));
});

// Update an inventory item
export const updateInventoryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const update = req.body;
  const item = await Inventory.findByIdAndUpdate(itemId, update, { new: true, runValidators: true });
  if (!item) throw new APIError(404, 'Inventory item not found');
  return res.status(200).json(new ApiResponse(200, 'Inventory item updated successfully', item));
});

// Delete an inventory item
export const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Inventory.findByIdAndDelete(itemId);
  if (!item) throw new APIError(404, 'Inventory item not found');
  return res.status(200).json(new ApiResponse(200, 'Inventory item deleted successfully', {}));
}); 