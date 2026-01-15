const Floor = require('../models/Floor');
const cloudinary = require('../config/cloudinary');

// Helper function to delete images from Cloudinary
const deleteCloudinaryImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;
  
  const deletePromises = imageUrls.map(url => {
    // Extract public_id from Cloudinary URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = `tower-office/floors/${filename.split('.')[0]}`;
    return cloudinary.uploader.destroy(publicId);
  });
  
  await Promise.all(deletePromises);
};

exports.createFloor = async (req, res) => {
  try {
    const floorData = req.body;
    
    // Handle uploaded images
    if (req.files) {
      if (req.files.images) {
        floorData.images = req.files.images.map(file => file.path);
      }
      if (req.files.floorPlan && req.files.floorPlan[0]) {
        floorData.floorPlan = req.files.floorPlan[0].path;
      }
    }
    
    // Calculate total price if not provided
    if (!floorData.totalPrice && floorData.area && floorData.pricePerSqFt) {
      floorData.totalPrice = floorData.area * floorData.pricePerSqFt;
    }

    const floor = new Floor(floorData);
    await floor.save();

    res.status(201).json({
      message: 'Floor created successfully',
      floor
    });
  } catch (error) {
    // Delete uploaded images if floor creation fails
    if (req.files) {
      const imageUrls = [];
      if (req.files.images) {
        imageUrls.push(...req.files.images.map(file => file.path));
      }
      if (req.files.floorPlan) {
        imageUrls.push(...req.files.floorPlan.map(file => file.path));
      }
      await deleteCloudinaryImages(imageUrls);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getAllFloors = async (req, res) => {
  try {
    const { 
      status, 
      minPrice, 
      maxPrice, 
      minArea, 
      maxArea,
      sortBy = 'floorNumber',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
      featured
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (featured !== undefined) query.isFeatured = featured === 'true';
    if (minPrice || maxPrice) {
      query.totalPrice = {};
      if (minPrice) query.totalPrice.$gte = Number(minPrice);
      if (maxPrice) query.totalPrice.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const [floors, total] = await Promise.all([
      Floor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Floor.countDocuments(query)
    ]);

    // Add virtuals manually
    const floorsWithVirtuals = floors.map(floor => ({
      ...floor,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(floor.totalPrice),
      pricePerMonth: Math.round(floor.totalPrice / 12)
    }));

    res.json({
      floors: floorsWithVirtuals,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFloorById = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id).lean();
    
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    // Add virtuals
    floor.formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(floor.totalPrice);
    floor.pricePerMonth = Math.round(floor.totalPrice / 12);

    res.json({ floor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFloor = async (req, res) => {
  try {
    const updates = req.body;
    const floor = await Floor.findById(req.params.id);
    
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    // Handle new uploaded images
    if (req.files) {
      if (req.files.images) {
        const newImages = req.files.images.map(file => file.path);
        
        // If replacing images, delete old ones
        if (updates.replaceImages === 'true' && floor.images.length > 0) {
          await deleteCloudinaryImages(floor.images);
          updates.images = newImages;
        } else {
          // Append new images to existing ones
          updates.images = [...floor.images, ...newImages];
        }
      }
      
      if (req.files.floorPlan && req.files.floorPlan[0]) {
        // Delete old floor plan if exists
        if (floor.floorPlan) {
          await deleteCloudinaryImages([floor.floorPlan]);
        }
        updates.floorPlan = req.files.floorPlan[0].path;
      }
    }
    
    // Recalculate total price if area or price per sq ft changes
    if ((updates.area || updates.pricePerSqFt) && !updates.totalPrice) {
      const area = updates.area || floor.area;
      const pricePerSqFt = updates.pricePerSqFt || floor.pricePerSqFt;
      updates.totalPrice = area * pricePerSqFt;
    }

    updates.updatedAt = new Date();

    const updatedFloor = await Floor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    res.json({
      message: 'Floor updated successfully',
      floor: updatedFloor
    });
  } catch (error) {
    // Delete uploaded images if update fails
    if (req.files) {
      const imageUrls = [];
      if (req.files.images) {
        imageUrls.push(...req.files.images.map(file => file.path));
      }
      if (req.files.floorPlan) {
        imageUrls.push(...req.files.floorPlan.map(file => file.path));
      }
      await deleteCloudinaryImages(imageUrls);
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    // Delete images from Cloudinary
    const imagesToDelete = [...floor.images];
    if (floor.floorPlan) {
      imagesToDelete.push(floor.floorPlan);
    }
    await deleteCloudinaryImages(imagesToDelete);

    await Floor.findByIdAndDelete(req.params.id);

    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableFloors = async (req, res) => {
  try {
    const floors = await Floor.find({ status: 'available' })
      .sort({ floorNumber: 1 })
      .lean();

    const floorsWithVirtuals = floors.map(floor => ({
      ...floor,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(floor.totalPrice),
      pricePerMonth: Math.round(floor.totalPrice / 12)
    }));

    res.json({ floors: floorsWithVirtuals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeaturedFloors = async (req, res) => {
  try {
    const floors = await Floor.find({ isFeatured: true, status: 'available' })
      .sort({ floorNumber: 1 })
      .limit(6)
      .lean();

    const floorsWithVirtuals = floors.map(floor => ({
      ...floor,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(floor.totalPrice),
      pricePerMonth: Math.round(floor.totalPrice / 12)
    }));

    res.json({ floors: floorsWithVirtuals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New endpoint to delete specific images
exports.deleteFloorImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const floor = await Floor.findById(id);
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    // Remove image from array
    floor.images = floor.images.filter(img => img !== imageUrl);
    await floor.save();

    // Delete from Cloudinary
    await deleteCloudinaryImages([imageUrl]);

    res.json({ message: 'Image deleted successfully', floor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};