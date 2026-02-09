const TowerInfo = require('../models/TowerInfo');
const Floor = require('../models/Floor');
const cloudinary = require('../config/cloudinary');

// Get basic tower statistics for public display
exports.getPublicStats = async (req, res) => {
  try {
    const [totalFloors, availableFloors] = await Promise.all([
      Floor.countDocuments(),
      Floor.countDocuments({ status: 'available' })
    ]);

    const occupancyRate = totalFloors > 0
      ? Math.round(((totalFloors - availableFloors) / totalFloors) * 100)
      : 0;

    res.json({
      totalFloors,
      availableFloors,
      occupancyRate
    });
  } catch (error) {
    console.error('Get public stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get tower info
exports.getTowerInfo = async (req, res) => {
  try {
    const towerInfo = await TowerInfo.findOne().lean();

    if (!towerInfo) {
      return res.json({
        towerInfo: {
          name: 'JFI Tower 3',
          description: 'Premium office spaces in the city center',
          featureImages: [],
          youtubeVideos: []
        }
      });
    }

    res.json({ towerInfo });
  } catch (error) {
    console.error('Get tower info error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update tower info
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
    console.error('Update tower info error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Upload feature image - Direct to Cloudinary from memory (Cloud-ready)
exports.uploadFeatureImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📤 Uploading image to Cloudinary...');
    console.log('File size:', req.file.size, 'bytes');
    console.log('File type:', req.file.mimetype);

    // Convert buffer to base64 data URI
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: 'tower-feature-images',
      resource_type: 'image',
      transformation: [
        { width: 1920, height: 1080, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });

    console.log('✅ Image uploaded successfully to Cloudinary');
    console.log('URL:', result.secure_url);

    const { title, description, category, order, isHeroImage } = req.body;

    // Add to tower info
    const towerInfo = await TowerInfo.findOneAndUpdate(
      {},
      {
        $push: {
          featureImages: {
            url: result.secure_url,
            publicId: result.public_id,
            title: title || 'Tower Image',
            description: description || '',
            category: category || 'exterior',
            order: parseInt(order) || 0,
            isHeroImage: isHeroImage === 'true'
          }
        }
      },
      { new: true, upsert: true }
    );

    console.log('✅ Image saved to database');

    res.json({
      message: 'Image uploaded successfully',
      image: towerInfo.featureImages[towerInfo.featureImages.length - 1]
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete feature image
exports.deleteFeatureImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID required' });
    }

    console.log('🗑️ Deleting image from Cloudinary:', publicId);

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Remove from database
    await TowerInfo.findOneAndUpdate(
      {},
      { $pull: { featureImages: { publicId } } }
    );

    console.log('✅ Image deleted successfully');

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add YouTube video
exports.addYoutubeVideo = async (req, res) => {
  try {
    const { url, title, description, category, order } = req.body;

    if (!url || !title) {
      return res.status(400).json({ error: 'URL and title are required' });
    }

    // Extract video ID from URL
    const videoId = extractYoutubeId(url);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL. Please provide a valid YouTube video link.' });
    }

    console.log('📺 Adding YouTube video:', videoId);

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const towerInfo = await TowerInfo.findOneAndUpdate(
      {},
      {
        $push: {
          youtubeVideos: {
            url,
            videoId,
            title,
            description: description || '',
            thumbnailUrl,
            category: category || 'tour',
            order: parseInt(order) || 0
          }
        }
      },
      { new: true, upsert: true }
    );

    console.log('✅ Video added successfully');

    res.json({
      message: 'Video added successfully',
      video: towerInfo.youtubeVideos[towerInfo.youtubeVideos.length - 1]
    });
  } catch (error) {
    console.error('❌ Add video error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete YouTube video
exports.deleteYoutubeVideo = async (req, res) => {
  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID required' });
    }

    console.log('🗑️ Deleting YouTube video:', videoId);

    await TowerInfo.findOneAndUpdate(
      {},
      { $pull: { youtubeVideos: { videoId } } }
    );

    console.log('✅ Video deleted successfully');

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('❌ Delete video error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to extract YouTube video ID
function extractYoutubeId(url) {
  // Support multiple YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Toggle hero status of a feature image
exports.toggleHeroImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { isHeroImage } = req.body;

    const towerInfo = await TowerInfo.findOneAndUpdate(
      { 'featureImages.publicId': publicId },
      { $set: { 'featureImages.$.isHeroImage': isHeroImage } },
      { new: true }
    );

    if (!towerInfo) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({
      message: `Image ${isHeroImage ? 'set as hero' : 'removed from hero'} successfully`,
      image: towerInfo.featureImages.find(img => img.publicId === publicId)
    });
  } catch (error) {
    console.error('❌ Toggle hero error:', error);
    res.status(500).json({ error: error.message });
  }
};
