module.exports = {
  FLOOR_STATUS: {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    UNDER_MAINTENANCE: 'under_maintenance',
    RESERVED: 'reserved'
  },

  INQUIRY_STATUS: {
    NEW: 'new',
    CONTACTED: 'contacted',
    VIEWING_SCHEDULED: 'viewing_scheduled',
    OFFER_SENT: 'offer_sent',
    CLOSED: 'closed',
    REJECTED: 'rejected'
  },

  USER_ROLES: {
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  },

  AMENITIES: [
    'high_speed_internet',
    'conference_rooms',
    'parking',
    'security',
    'cafeteria',
    'gym',
    'elevator',
    'air_conditioning',
    'cleaning_services',
    'reception'
  ],

  VIEW_TYPES: ['city', 'river', 'park', 'ocean', 'mountain'],

  LEASE_TERMS: ['monthly', 'quarterly', 'yearly', 'custom'],

  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  }
};