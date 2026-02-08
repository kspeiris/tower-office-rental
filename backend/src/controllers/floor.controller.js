const Floor = require('../models/Floor');
const cloudinary = require('../config/cloudinary');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = async (fileBuffer, mimetype, folder = 'floor-images') => {
  const fileStr = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: `tower-office/${folder}`,
    resource_type: 'image',
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto:good' }
    ]
  });

  return result.secure_url;
};

// Helper function to delete images from Cloudinary
const deleteCloudinaryImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;

  const deletePromises = imageUrls.map(url => {
    try {
      // Extract public_id from Cloudinary URL
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex === -1) return Promise.resolve();

      // Get everything after 'upload/vX/'
      const publicIdParts = urlParts.slice(uploadIndex + 2);
      const publicIdWithExt = publicIdParts.join('/');
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

      console.log('🗑️ Deleting from Cloudinary:', publicId);
      return cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image:', error);
      return Promise.resolve();
    }
  });

  await Promise.allSettled(deletePromises);
};

// Create Floor
exports.createFloor = async (req, res) => {
  try {
    const floorData = req.body;

    console.log('📝 Creating new floor...');
    console.log('Files received:', req.files ? Object.keys(req.files) : 'none');

    // Handle uploaded images (memory storage - from buffer)
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        console.log(`📤 Uploading ${req.files.images.length} images...`);
        const uploadPromises = req.files.images.map(file =>
          uploadToCloudinary(file.buffer, file.mimetype, 'floor-images')
        );
        floorData.images = await Promise.all(uploadPromises);
        console.log('✅ Images uploaded successfully');
      }

      if (req.files.floorPlan && req.files.floorPlan[0]) {
        console.log('📤 Uploading floor plan...');
        floorData.floorPlan = await uploadToCloudinary(
          req.files.floorPlan[0].buffer,
          req.files.floorPlan[0].mimetype,
          'floor-plans'
        );
        console.log('✅ Floor plan uploaded successfully');
      }
    }

    // Check if floor number already exists
    if (floorData.floorNumber) {
      const existingFloor = await Floor.findOne({ floorNumber: floorData.floorNumber });
      if (existingFloor) {
        return res.status(400).json({ error: `Floor number ${floorData.floorNumber} already exists.` });
      }
    }

    // Calculate total price if not provided
    if (!floorData.totalPrice && floorData.area && floorData.pricePerSqFt) {
      floorData.totalPrice = floorData.area * floorData.pricePerSqFt;
    }

    const floor = new Floor(floorData);
    await floor.save();

    console.log('✅ Floor created successfully');

    res.status(201).json({
      message: 'Floor created successfully',
      floor
    });
  } catch (error) {
    console.error('❌ Create floor error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Floor number must be unique.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get All Floors
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
    console.error('❌ Get all floors error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Floor by ID
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
    console.error('❌ Get floor by ID error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Floor
exports.updateFloor = async (req, res) => {
  try {
    const updates = req.body;
    const floor = await Floor.findById(req.params.id);

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    console.log('📝 Updating floor:', req.params.id);
    console.log('Files received:', req.files ? Object.keys(req.files) : 'none');

    // Handle new uploaded images (from buffer)
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        console.log(`📤 Uploading ${req.files.images.length} new images...`);
        const uploadPromises = req.files.images.map(file =>
          uploadToCloudinary(file.buffer, file.mimetype, 'floor-images')
        );
        const newImages = await Promise.all(uploadPromises);

        // If replacing images, delete old ones
        if (updates.replaceImages === 'true' && floor.images.length > 0) {
          console.log('🗑️ Replacing old images...');
          await deleteCloudinaryImages(floor.images);
          updates.images = newImages;
        } else {
          // Append new images to existing ones
          updates.images = [...floor.images, ...newImages];
        }
        console.log('✅ Images updated successfully');
      }

      if (req.files.floorPlan && req.files.floorPlan[0]) {
        console.log('📤 Uploading new floor plan...');
        // Delete old floor plan if exists
        if (floor.floorPlan) {
          await deleteCloudinaryImages([floor.floorPlan]);
        }
        updates.floorPlan = await uploadToCloudinary(
          req.files.floorPlan[0].buffer,
          req.files.floorPlan[0].mimetype,
          'floor-plans'
        );
        console.log('✅ Floor plan updated successfully');
      }
    }

    // Check for floor number uniqueness if it's being updated
    if (updates.floorNumber && Number(updates.floorNumber) !== floor.floorNumber) {
      const existingFloor = await Floor.findOne({ floorNumber: updates.floorNumber });
      if (existingFloor) {
        return res.status(400).json({ error: `Floor number ${updates.floorNumber} already exists on another floor.` });
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

    console.log('✅ Floor updated successfully');

    res.json({
      message: 'Floor updated successfully',
      floor: updatedFloor
    });
  } catch (error) {
    console.error('❌ Update floor error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Floor number must be unique.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete Floor
exports.deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findById(req.params.id);

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    console.log('🗑️ Deleting floor:', req.params.id);

    // Delete images from Cloudinary
    const imagesToDelete = [...floor.images];
    if (floor.floorPlan) {
      imagesToDelete.push(floor.floorPlan);
    }

    if (imagesToDelete.length > 0) {
      console.log(`🗑️ Deleting ${imagesToDelete.length} images from Cloudinary...`);
      await deleteCloudinaryImages(imagesToDelete);
    }

    await Floor.findByIdAndDelete(req.params.id);

    console.log('✅ Floor deleted successfully');

    res.json({ message: 'Floor deleted successfully' });
  } catch (error) {
    console.error('❌ Delete floor error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Available Floors
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
    console.error('❌ Get available floors error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Featured Floors
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
    console.error('❌ Get featured floors error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Specific Image
exports.deleteFloorImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const floor = await Floor.findById(id);
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    console.log('🗑️ Deleting specific image from floor:', id);

    // Remove image from array
    floor.images = floor.images.filter(img => img !== imageUrl);
    await floor.save();

    // Delete from Cloudinary
    await deleteCloudinaryImages([imageUrl]);

    console.log('✅ Image deleted successfully');

    res.json({ message: 'Image deleted successfully', floor });
  } catch (error) {
    console.error('❌ Delete image error:', error);
    res.status(500).json({ error: error.message });
  }
};