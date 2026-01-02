import Inventory from '../models/inventory.model.js';
import {asyncHandler} from '../utils/async_handler.utils.js';
import {APIError} from '../utils/api_error_handler.utils.js';
import ApiResponse from '../utils/api_response.utils.js';

// Add new inventory item
export const addInventoryItem = asyncHandler(async (req, res) => {
  const { name, type, category, quantity_available, minimum_required, unit_price, expiry_date, supplier_info } = req.body;
  
  const item = await Inventory.create({
    name,
    type,
    category,
    quantity_available: Number(quantity_available),
    minimum_required: Number(minimum_required),
    unit_price: Number(unit_price),
    expiry_date,
    supplier_info,
    transactions: [{
        type: 'IN',
        quantity: Number(quantity_available),
        performed_by: req.user.id,
        reason: 'Initial Stock'
    }]
  });
  return res.status(201).json(new ApiResponse(201, 'Inventory item added successfully', item));
});

// Update an inventory item
export const updateInventoryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const update = req.body;
  
  // Logic to detect manual quantity adjustment could be complex, for now assuming direct edit doesn't log transaction automatically 
  // unless we explicitly separate "Quantity Adjustment" from "Detail Edit". 
  // For simplicity, we just update details here. To change stock with log, use consumeStock or specific 'stockIn' endpoint (not implemented yet, can use update with manual logic if needed).
  
  const item = await Inventory.findByIdAndUpdate(itemId, update, { new: true, runValidators: true });
  if (!item) throw new APIError(404, 'Inventory item not found');
  
  // Create a transaction log if quantity changed significantly via edit? 
  // Skipping for now to keep 'Edit' simple.
  
  return res.status(200).json(new ApiResponse(200, 'Inventory item updated successfully', item));
});

// Consume stock (OUT transaction)
export const consumeStock = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity, reason } = req.body;
    
    const item = await Inventory.findById(itemId);
    if (!item) throw new APIError(404, 'Inventory item not found');
    
    if (item.quantity_available < quantity) {
        throw new APIError(400, `Insufficient stock. Available: ${item.quantity_available}`);
    }
    
    item.quantity_available -= Number(quantity);
    item.transactions.push({
        type: 'OUT',
        quantity: Number(quantity),
        performed_by: req.user.id,
        reason: reason || 'Consumption'
    });
    
    await item.save(); // Pre-save hook will update status
    
    return res.status(200).json(new ApiResponse(200, 'Stock consumed successfully', item));
});

// Get low stock items
export const getLowStockItems = asyncHandler(async (req, res) => {
    const items = await Inventory.find({ 
        $expr: { $lte: ["$quantity_available", "$minimum_required"] } 
    }).sort({ quantity_available: 1 });
    
    return res.status(200).json(new ApiResponse(200, 'Low stock items fetched', items));
});

// Get all inventory items
export const getInventoryList = asyncHandler(async (req, res) => {
  const items = await Inventory.find().sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, 'Inventory list fetched successfully', items));
});

// Get a single inventory item by ID
export const getInventoryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Inventory.findById(itemId).populate('transactions.performed_by', 'full_name role');
  if (!item) throw new APIError(404, 'Inventory item not found');
  return res.status(200).json(new ApiResponse(200, 'Inventory item fetched successfully', item));
});

// Delete an inventory item
export const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const item = await Inventory.findByIdAndDelete(itemId);
  if (!item) throw new APIError(404, 'Inventory item not found');
  return res.status(200).json(new ApiResponse(200, 'Inventory item deleted successfully', {}));
}); 