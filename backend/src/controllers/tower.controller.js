const TowerInfo = require('../models/TowerInfo');

exports.getTowerInfo = async (req, res) => {
  try {
    const towerInfo = await TowerInfo.findOne().lean();
    
    if (!towerInfo) {
      // Return default structure if not found
      return res.json({
        name: 'TowerSpace Office Tower',
        description: 'Premium office spaces in the city center',
        address: {
          street: '123 Business District',
          city: 'City Center',
          state: 'State',
          country: 'Country'
        },
        amenities: [],
        contactInfo: {
          phone: '+1 (555) 123-4567',
          email: 'info@towerspace.com'
        }
      });
    }

    res.json({ towerInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTowerInfo = async (req, res) => {
  try {
    const updates = req.body;
    updates.lastUpdated = new Date();

    const towerInfo = await TowerInfo.findOneAndUpdate(
      {},
      updates,
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    ).lean();

    res.json({
      message: 'Tower information updated successfully',
      towerInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadTowerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Add to tower images
    await TowerInfo.findOneAndUpdate(
      {},
      { $push: { images: { url: imageUrl, caption: req.body.caption || '' } } },
      { upsert: true }
    );

    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};