require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Floor = require('./src/models/Floor');
const TowerInfo = require('./src/models/TowerInfo');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tower_office_rental';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Floor.deleteMany({});
    await TowerInfo.deleteMany({});

    // Create admin user - LET THE MODEL HASH THE PASSWORD
    const admin = await User.create({
      username: 'admin',
      email: 'admin@towerspace.com',
      password: 'admin123', // Plain password - model will hash it
      role: 'super_admin'
    });

    console.log('✅ Admin user created');

    // Create sample floors
    const floors = [
      {
        floorNumber: 10,
        name: 'Executive Suite',
        description: 'Premium corner office with panoramic city views. Features modern finishes, private conference room, and executive lounge access.',
        area: 2500,
        pricePerSqFt: 35,
        totalPrice: 87500,
        status: 'available',
        amenities: ['high_speed_internet', 'conference_rooms', 'parking', 'security', 'cafeteria'],
        maxCapacity: 20,
        view: 'city',
        leaseTerm: 'yearly',
        isFeatured: true
      },
      {
        floorNumber: 15,
        name: 'Tech Hub',
        description: 'Open concept floor perfect for tech startups. Includes collaboration spaces, phone booths, and high-speed fiber internet.',
        area: 5000,
        pricePerSqFt: 28,
        totalPrice: 140000,
        status: 'available',
        amenities: ['high_speed_internet', 'conference_rooms', 'parking', 'security', 'gym'],
        maxCapacity: 50,
        view: 'city',
        leaseTerm: 'yearly',
        isFeatured: true
      },
      {
        floorNumber: 20,
        name: 'Corner Office',
        description: 'Luxury corner office with floor-to-ceiling windows and private balcony. Ideal for law firms or financial services.',
        area: 1800,
        pricePerSqFt: 42,
        totalPrice: 75600,
        status: 'occupied',
        amenities: ['high_speed_internet', 'conference_rooms', 'parking', 'security', 'reception'],
        maxCapacity: 12,
        view: 'river',
        leaseTerm: 'yearly',
        isFeatured: false
      }
    ];

    await Floor.insertMany(floors);
    console.log('✅ Floors created');

    // Create tower information
    await TowerInfo.create({
      name: 'TowerSpace Premium Office Tower',
      description: 'A landmark office tower offering premium workspace solutions in the heart of the financial district. Featuring state-of-the-art facilities and unparalleled amenities.',
      address: {
        street: '123 Business Avenue',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      totalFloors: 40,
      yearBuilt: 2020,
      amenities: [
        {
          name: '24/7 Security',
          description: 'Round-the-clock security with CCTV surveillance',
          icon: 'shield',
          category: 'security'
        },
        {
          name: 'High-speed Internet',
          description: 'Enterprise-grade fiber optic internet',
          icon: 'wifi',
          category: 'convenience'
        },
        {
          name: 'Fitness Center',
          description: 'Fully equipped gym with personal trainers',
          icon: 'dumbbell',
          category: 'recreation'
        },
        {
          name: 'Conference Facilities',
          description: 'Multiple meeting rooms and boardrooms',
          icon: 'users',
          category: 'business'
        }
      ],
      contactInfo: {
        phone: '+1 (555) 123-4567',
        email: 'info@towerspace.com',
        website: 'www.towerspace.com',
        officeHours: 'Mon-Fri 9:00 AM - 6:00 PM'
      }
    });

    console.log('✅ Tower info created');
    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin login: admin@towerspace.com');
    console.log('🔑 Password: admin123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();