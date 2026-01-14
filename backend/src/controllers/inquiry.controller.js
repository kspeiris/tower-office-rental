const Inquiry = require('../models/Inquiry');
const Floor = require('../models/Floor');
const User = require('../models/User');

exports.createInquiry = async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Check if floor exists
    const floor = await Floor.findById(inquiryData.floorId);
    if (!floor) {
      return res.status(404).json({ error: 'Floor not found' });
    }

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    // Populate floor details in response
    await inquiry.populate('floorId', 'floorNumber name area totalPrice');

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllInquiries = async (req, res) => {
  try {
    const { 
      status, 
      startDate, 
      endDate, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query)
        .populate('floorId', 'floorNumber name area totalPrice')
        .populate('respondedBy', 'username email')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Inquiry.countDocuments(query)
    ]);

    // Add virtuals manually
    const inquiriesWithVirtuals = inquiries.map(inquiry => ({
      ...inquiry,
      formattedDate: new Date(inquiry.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));

    res.json({
      inquiries: inquiriesWithVirtuals,
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

exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('floorId', 'floorNumber name area totalPrice images')
      .populate('respondedBy', 'username email')
      .lean();

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiry.formattedDate = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    res.json({ inquiry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, responseNotes } = req.body;
    const updateData = { status };

    if (status === 'contacted' || status === 'viewing_scheduled' || status === 'offer_sent') {
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.user._id;
      if (responseNotes) {
        updateData.responseNotes = responseNotes;
      }
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('floorId', 'floorNumber name');

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInquiryStats = async (req, res) => {
  try {
    const stats = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          statuses: { $push: { status: '$_id', count: '$count' } }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          statuses: 1
        }
      }
    ]);

    const last30Days = await Inquiry.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    res.json({
      stats: stats[0] || { total: 0, statuses: [] },
      last30Days
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};