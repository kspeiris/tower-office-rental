export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

export const FLOOR_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  UNDER_MAINTENANCE: 'under_maintenance',
  RESERVED: 'reserved'
};

export const INQUIRY_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  VIEWING_SCHEDULED: 'viewing_scheduled',
  OFFER_SENT: 'offer_sent',
  CLOSED: 'closed',
  REJECTED: 'rejected'
};

export const AMENITIES = {
  HIGH_SPEED_INTERNET: 'high_speed_internet',
  CONFERENCE_ROOMS: 'conference_rooms',
  PARKING: 'parking',
  SECURITY: 'security',
  CAFETERIA: 'cafeteria',
  GYM: 'gym',
  ELEVATOR: 'elevator',
  AIR_CONDITIONING: 'air_conditioning',
  CLEANING_SERVICES: 'cleaning_services',
  RECEPTION: 'reception'
};

export const VIEW_TYPES = {
  CITY: 'city',
  RIVER: 'river',
  PARK: 'park',
  OCEAN: 'ocean',
  MOUNTAIN: 'mountain'
};

export const LEASE_TERMS = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const ROUTES = {
  HOME: '/',
  FLOORS: '/floors',
  FLOOR_DETAILS: '/floors/:id',
  INQUIRY: '/inquiry/:floorId',
  AMENITIES: '/amenities',
  CONTACT: '/contact',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_FLOORS: '/admin/floors',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_SETTINGS: '/admin/settings'
};