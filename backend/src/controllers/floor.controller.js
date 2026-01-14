const Floor = require('../models/Floor');

exports.createFloor = async (req, res) => {
  try {
    const floorData = req.body;
    
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
    
    // Recalculate total price if area or price per sq ft changes
    if ((updates.area || updates.pricePerSqFt) && !updates.totalPrice) {
      const floor = await Floor.findById(req.params.id);
      const area = updates.area || floor.area;
      const pricePerSqFt = updates.pricePerSqFt || floor.pricePerSqFt;
      updates.totalPrice = area * pricePerSqFt;
    }

    updates.updatedAt = new Date();

    const floor = await Floor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    res.json({
      message: 'Floor updated successfully',
      floor
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFloor = async (req, res) => {
  try {
    const floor = await Floor.findByIdAndDelete(req.params.id);

    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

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