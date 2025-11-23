// Mock data for the Child Education Program

export interface Activity {
  id: string;
  name: string;
  estimatedTime: string; // e.g., "2 hours", "30 minutes"
  cost: number; // in INR
  description?: string;
  photos?: string[]; // Photo references for tooltip display
}

// Booking-related interfaces
export interface ActivitySlot {
  id: string;
  startTime: string; // e.g., "09:00", "14:00"
  endTime: string;
  maxCapacity: number;
  availableCapacity: number;
}

export interface BookingActivity {
  id: string;
  ecoCentreId: string;
  name: string;
  type: 'FREE' | 'PAID';
  isSlotBased: boolean;
  price?: number; // per person or per slot
  capacity: number; // daily or slot-wise
  ageRestrictions?: string; // e.g., "12+ years"
  description?: string;
  slots?: ActivitySlot[]; // For slot-based activities
  requiresVehicles?: boolean; // For safari
  vehicleCapacity?: number; // People per vehicle (default 6 for safari)
  photos?: string[];
}

export interface Booking {
  id: string;
  bookingId: string; // Display ID like "BK-2025-001"
  ecoCentreId: string;
  activityId: string;
  date: string; // ISO date string
  slotId?: string; // For slot-based activities
  name: string;
  mobile: string;
  participants: number;
  vehicles?: number; // For safari
  totalAmount: number;
  paymentStatus: 'pending' | 'completed';
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface WholeDayPackage {
  id: string;
  name: string;
  description: string;
  cost: number; // in INR
  includedActivities: string[]; // Activity IDs
}

export interface OvernightRoom {
  id: string;
  type: string; // e.g., "Dormitory", "Cottage", "Tent"
  capacity: number; // number of people
  rent: number; // per night in INR
  description?: string;
  photos?: string[]; // Photo references for tooltip display
}

export interface EcoCentre {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    district?: string;
    state?: string;
  };
  capacity: number;
  trailDifficulty: 'Easy' | 'Moderate' | 'Difficult';
  nearestHospital: {
    name: string;
    phone: string;
    coords: { lat: number; lng: number };
    distance_km: number;
  };
  images: string[];
  description: string;
  features: string[];
  youtubeVideoUrl?: string[];
  officialWebsiteUrl?: string;
  activities?: Activity[];
  wholeDayPackage?: WholeDayPackage;
  overnightStay?: {
    available: boolean;
    rooms?: OvernightRoom[];
  };
  // Booking-related fields
  openingTime?: string; // e.g., "08:00"
  closingTime?: string; // e.g., "18:00"
  weeklyOffDays?: string[]; // e.g., ["Monday", "Tuesday"]
  contactInfo?: {
    phone: string;
    email: string;
  };
  bookingActivities?: BookingActivity[]; // Activities for booking system
}

export interface Coordinator {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
}

export interface Lecturer {
  id: string;
  name: string;
  expertise: string;
  phone: string;
  bio: string;
  availability: string[];
  image: string;
}

export interface ParentContact {
  name: string;
  phone: string;
  studentName: string;
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string; // e.g., "Class Teacher", "Science Teacher"
}

export interface BusDriver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleNumber: string;
  vehicleType: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
  type: 'hospital' | 'petrol_station' | 'waypoint';
}

export interface EventDocument {
  id: string;
  name: string;
  type: 'parent_consent' | 'permission' | 'approval' | 'other';
  url: string;
  uploadedAt: string;
}

export interface School {
  id: string;
  name: string;
  contact_person: string;
  contact_phone: string;
  email: string;
  address: string;
  registered_events: string[];
  documents: {
    parent_consent_url: string;
  };
}

export interface Event {
  id: string;
  code: string;
  schoolId?: string; // Optional for guest lectures
  ecoCentreId: string;
  date: string;
  students_count: number;
  consentFormsSubmitted: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  eventType?: 'school' | 'guest_lecture'; // Type of event
  availableSeats?: number; // For guest lectures - seats available for booking
  bookedActivities?: string[]; // Activity IDs that are booked (for partial activity bookings)
  isFullyBooked?: boolean; // Whether the eco centre is fully booked
  isPartiallyBooked?: boolean; // Whether the eco centre is partially booked
  busDetails?: string;
  assignedCoordinators: string[];
  assignedDriverId?: string;
  lecturerIds: string[];
  parentContacts: ParentContact[];
  teachers: Teacher[];
  emergencyContacts: ParentContact[];
  route?: {
    startPoint: { lat: number; lng: number; name: string };
    endPoint: { lat: number; lng: number; name: string };
    waypoints: RoutePoint[];
  };
  documents: EventDocument[];
  photos: string[];
  feedbackSummary?: string;
}

export const mockEcoCentres: EcoCentre[] = [
  {
    id: 'ec1',
    name: 'Seminary Hills',
    officialWebsiteUrl: 'https://www.nagpurcitytourism.com/ecotourism/seminary-hills',
    location: {
      lat: 21.19931,
      lng: 79.0902,
      address: 'Seminary Hills, Nagpur, Maharashtra 440006',
      district: 'Nagpur',
      state: 'Maharashtra'
    },
    openingTime: '08:00',
    closingTime: '18:00',
    weeklyOffDays: ['Monday'],
    contactInfo: {
      phone: '+91-712-2541234',
      email: 'seminaryhills@forest.maharashtra.gov.in'
    },
    capacity: 150,
    trailDifficulty: 'Easy',
    nearestHospital: {
      name: 'Narayani Hospital',
      phone: '+91-9420000000',
      coords: { lat: 21.19931, lng: 79.0902 },
      distance_km: 1.5
    },
    images: ['seminary-hills-1.jpg'],
    description: 'Experience lungs of Nagpur with dense tree cover and urban forest feel. Great for panoramic views of Nagpur, especially around sunrise/sunset. Popular spot for health-conscious people — walkers, joggers, meditation enthusiasts. ',
    features: ['Birdwatching & Nature Study', 'Nature Trails', 'Temples & Pilgrimage', 'Social / Cultural Events', "Photography"],
    youtubeVideoUrl: ['https://youtu.be/vjH8YEbhxSw','https://youtu.be/txle6x-rnFA','https://youtu.be/ao1tTo7iZ10'],
    activities: [
      { id: 'act1-1', name: 'Nature Walk & Bird Watching', estimatedTime: '2 hours', cost: 200, description: 'Guided nature walk with bird identification', photos: ['seminary-hills-1.jpg'] },
      { id: 'act1-2', name: 'Forest Education Session', estimatedTime: '1.5 hours', cost: 300, description: 'Interactive session about forest ecosystem', photos: ['seminary-hills-1.jpg'] },
      { id: 'act1-3', name: 'Photography Workshop', estimatedTime: '1 hour', cost: 250, description: 'Learn nature photography techniques', photos: ['seminary-hills-1.jpg'] },
      { id: 'act1-4', name: 'Meditation & Yoga', estimatedTime: '1 hour', cost: 150, description: 'Peaceful meditation session in nature', photos: ['seminary-hills-1.jpg'] },
      { id: 'act1-5', name: 'Temple Visit & Cultural Learning', estimatedTime: '45 minutes', cost: 100, description: 'Visit local temples and learn about culture', photos: ['seminary-hills-1.jpg'] }
    ],
    wholeDayPackage: {
      id: 'pkg1',
      name: 'Complete Nature Experience',
      description: 'Full day package including all activities, lunch, and educational materials',
      cost: 800,
      includedActivities: ['act1-1', 'act1-2', 'act1-3', 'act1-4', 'act1-5']
    },
    overnightStay: {
      available: false
    }
  },
  {
    id: 'ec2',
    name: 'Mogarkasa-Mangarli Conservation Reserve',
    officialWebsiteUrl: 'https://www.mogarkasatourism.in/index.html',
    location: {
      lat: 21.4987,
      lng: 79.4730,
      address: 'Paoni town, Nagpur District, Maharashtra 441401',
      district: 'Nagpur',
      state: 'Maharashtra'
    },
    openingTime: '06:00',
    closingTime: '19:00',
    weeklyOffDays: ['Tuesday'],
    contactInfo: {
      phone: '+91-8222-252777',
      email: 'mogarkasa@forest.maharashtra.gov.in'
    },
    capacity: 120,
    trailDifficulty: 'Moderate',
    nearestHospital: {
      name: 'Indira Gandhi Government Medical College & Hospital (IGGMCH), Nagpur',
      phone: '+91-8222-252777',
      coords: { lat: 12.2981, lng: 76.2921 },
      distance_km: 8.2
    },
    images: ['welcome-about.jpg', 'bear.webp', 'chausie.webp', 'gaur.webp', 'leopard.webp', 'panther.webp'],
    description: 'The Mogarkasa–Mangarli area features dense deciduous forest, a perennial lake and forms part of the wildlife corridor connecting to nearby tiger habitats. Mogarkasa is rich in biodiversity and offers sightings of a wide range of wild animals during jungle safaris.',
    features: ['Black Panther Spotting','Tiger Spotting', 'Leopard Spotting', 'Bird Watching', 'Forest Trails', 'Safari', 'Staying in eco-huts'],
    youtubeVideoUrl: ['https://youtu.be/oIC68RLrVnA','https://www.youtube.com/watch?v=ww2PEAZSpes','https://www.youtube.com/watch?v=el9YM25WBmM'],
    activities: [
      { id: 'act2-1', name: 'Jungle Safari (Morning)', estimatedTime: '3 hours', cost: 500, description: 'Early morning safari for wildlife spotting', photos: ['welcome-about.jpg'] },
      { id: 'act2-2', name: 'Jungle Safari (Evening)', estimatedTime: '3 hours', cost: 500, description: 'Evening safari for nocturnal wildlife', photos: ['welcome-about.jpg'] },
      { id: 'act2-3', name: 'Forest Trail Trekking', estimatedTime: '2.5 hours', cost: 300, description: 'Guided trekking through forest trails', photos: ['welcome-about.jpg'] },
      { id: 'act2-4', name: 'Wildlife Photography', estimatedTime: '2 hours', cost: 400, description: 'Photography session with wildlife experts', photos: ['welcome-about.jpg'] },
      { id: 'act2-5', name: 'Bird Watching Session', estimatedTime: '1.5 hours', cost: 250, description: 'Identify and learn about local bird species', photos: ['welcome-about.jpg'] },
      { id: 'act2-6', name: 'Conservation Education', estimatedTime: '1.5 hours', cost: 200, description: 'Learn about wildlife conservation efforts', photos: ['welcome-about.jpg'] },
      { id: 'act2-7', name: 'Lake Activities', estimatedTime: '1 hour', cost: 150, description: 'Boating and lake exploration', photos: ['welcome-about.jpg'] }
    ],
    wholeDayPackage: {
      id: 'pkg2',
      name: 'Wildlife Adventure Package',
      description: 'Complete wildlife experience with morning safari, forest trail, education session, and all meals',
      cost: 1500,
      includedActivities: ['act2-1', 'act2-3', 'act2-5', 'act2-6']
    },
    overnightStay: {
      available: true,
      rooms: [
        { id: 'room2-1', type: 'Eco-Hut (Dormitory)', capacity: 20, rent: 2000, description: 'Shared accommodation with basic amenities', photos: ['welcome-about.jpg'] },
        { id: 'room2-2', type: 'Forest Cottage (4 beds)', capacity: 4, rent: 1500, description: 'Private cottage with attached bathroom', photos: ['welcome-about.jpg'] },
        { id: 'room2-3', type: 'Tent Camping (2 beds)', capacity: 2, rent: 800, description: 'Camping tent with sleeping bags provided', photos: ['welcome-about.jpg'] },
        { id: 'room2-4', type: 'Deluxe Cottage (6 beds)', capacity: 6, rent: 3000, description: 'Luxury cottage with modern amenities', photos: ['welcome-about.jpg'] }
      ]
    }
  },
  {
    id: 'ec3',
    name: 'Gorewada Biodiversity Park',
    officialWebsiteUrl : 'https://wildgorewada.com/',
    location: {
      lat: 21.1970,
      lng: 79.0387,
      address: 'Gorewada Bio Park, Mankapur Ring Road, Nagpur, Maharashtra, India',
      district: 'Nagpur',
      state: 'Maharashtra'
    },
    openingTime: '07:00',
    closingTime: '18:00',
    weeklyOffDays: ['Wednesday'],
    contactInfo: {
      phone: '+91-8284-231234',
      email: 'gorewada@forest.maharashtra.gov.in'
    },
    capacity: 100,
    trailDifficulty: 'Moderate',
    nearestHospital: {
      name: 'IGGMC, Nagpur',
      phone: '+91-8284-231234',
      coords: { lat: 15.2692, lng: 74.6205 },
      distance_km: 5.0
    },
    images: ['gorewada1.jpg','gorewada2.jpg','gorewada3.jpg','gorewada4.jpg'],
    description: 'Gorewada Biodiversity Park is a nature-trail and lake-fringe bio-park located within the Gorewada Reserve Forest. It offers a peaceful walking trail, birdwatching opportunities, and a scenic lakeside environment in the midst of Nagpur\'s green belt',
    features: ['Gorewada Lake', 'Bird Watching', 'Nature Trail', 'Yoga Machans & Pagodas', 'Wellness / Education'],
    youtubeVideoUrl : ['https://youtu.be/GPH7AHuyvAY'],
    activities: [
      { id: 'act3-1', name: 'Lakeside Nature Walk', estimatedTime: '2 hours', cost: 200, description: 'Guided walk around Gorewada Lake', photos: ['gorewada1.jpg'] },
      { id: 'act3-2', name: 'Bird Watching Tour', estimatedTime: '1.5 hours', cost: 250, description: 'Expert-guided bird watching session', photos: ['gorewada2.jpg'] },
      { id: 'act3-3', name: 'Yoga & Meditation at Pagoda', estimatedTime: '1 hour', cost: 150, description: 'Yoga session at scenic pagoda location', photos: ['gorewada3.jpg'] },
      { id: 'act3-4', name: 'Biodiversity Education', estimatedTime: '1.5 hours', cost: 300, description: 'Learn about local biodiversity and ecosystems', photos: ['gorewada4.jpg'] },
      { id: 'act3-5', name: 'Nature Photography', estimatedTime: '1 hour', cost: 200, description: 'Capture the beauty of the park', photos: ['gorewada1.jpg'] },
      { id: 'act3-6', name: 'Wellness Workshop', estimatedTime: '1 hour', cost: 180, description: 'Wellness and mindfulness activities', photos: ['gorewada2.jpg'] }
    ],
    wholeDayPackage: {
      id: 'pkg3',
      name: 'Biodiversity Discovery Package',
      description: 'Full day experience with nature walk, bird watching, yoga, education session, and lunch',
      cost: 900,
      includedActivities: ['act3-1', 'act3-2', 'act3-3', 'act3-4']
    },
    overnightStay: {
      available: true,
      rooms: [
        { id: 'room3-1', type: 'Guest House (Dormitory)', capacity: 15, rent: 1800, description: 'Shared accommodation near the lake', photos: ['gorewada1.jpg'] },
        { id: 'room3-2', type: 'Lake View Cottage (4 beds)', capacity: 4, rent: 2000, description: 'Cottage with beautiful lake view', photos: ['gorewada2.jpg'] },
        { id: 'room3-3', type: 'Standard Room (2 beds)', capacity: 2, rent: 1200, description: 'Comfortable room with basic amenities', photos: ['gorewada3.jpg'] }
      ]
    }
  }
];

export const mockCoordinators: Coordinator[] = [
  {
    id: 'coord1',
    name: 'Ramesh Kumar',
    phone: '+91-9876543210',
    email: 'ramesh.kumar@wildagile.org',
    role: 'Senior Coordinator'
  },
  {
    id: 'coord2',
    name: 'Priya Sharma',
    phone: '+91-9876543211',
    email: 'priya.sharma@wildagile.org',
    role: 'Field Coordinator'
  },
  {
    id: 'coord3',
    name: 'Arun Patel',
    phone: '+91-9876543212',
    email: 'arun.patel@wildagile.org',
    role: 'Logistics Coordinator'
  },
  {
    id: 'coord4',
    name: 'Meena Reddy',
    phone: '+91-9876543213',
    email: 'meena.reddy@wildagile.org',
    role: 'Safety Coordinator'
  }
];

export const mockBusDrivers: BusDriver[] = [
  {
    id: 'driver1',
    name: 'Mohan Singh',
    phone: '+91-9900112233',
    licenseNumber: 'MH-31-2020-12345',
    vehicleNumber: 'MH-31-AB-1234',
    vehicleType: 'School Bus (45 seater)'
  },
  {
    id: 'driver2',
    name: 'Suresh Kumar',
    phone: '+91-9900223344',
    licenseNumber: 'MH-31-2019-23456',
    vehicleNumber: 'MH-31-CD-5678',
    vehicleType: 'School Bus (50 seater)'
  },
  {
    id: 'driver3',
    name: 'Ramesh Patel',
    phone: '+91-9900334455',
    licenseNumber: 'MH-31-2021-34567',
    vehicleNumber: 'MH-31-EF-9012',
    vehicleType: 'Mini Bus (30 seater)'
  },
  {
    id: 'driver4',
    name: 'Kumar Prasad',
    phone: '+91-9900445566',
    licenseNumber: 'MH-31-2020-45678',
    vehicleNumber: 'MH-31-GH-3456',
    vehicleType: 'School Bus (55 seater)'
  }
];

export const mockLecturers: Lecturer[] = [
  {
    id: 'lec1',
    name: 'Dr. Suresh Babu',
    expertise: 'Wildlife Biology',
    phone: '+91-9988776655',
    bio: 'Wildlife biologist with 15 years of field experience in tiger conservation.',
    availability: ['Weekdays', 'Weekends'],
    image: '/images/lecturer-1.jpg'
  },
  {
    id: 'lec2',
    name: 'Prof. Lakshmi Devi',
    expertise: 'Forest Ecology',
    phone: '+91-9988776656',
    bio: 'Professor of Ecology specializing in Western Ghats biodiversity.',
    availability: ['Weekdays'],
    image: '/images/lecturer-2.jpg'
  },
  {
    id: 'lec3',
    name: 'Ravi Shankar',
    expertise: 'Conservation Photography',
    phone: '+91-9988776657',
    bio: 'Award-winning wildlife photographer and environmental educator.',
    availability: ['Weekends'],
    image: '/images/lecturer-3.jpg'
  },
  {
    id: 'lec4',
    name: 'Dr. Anjali Nair',
    expertise: 'Ornithology',
    phone: '+91-9988776658',
    bio: 'Bird conservation expert with extensive knowledge of South Indian avifauna.',
    availability: ['Weekdays', 'Weekends'],
    image: '/images/lecturer-4.jpg'
  }
];

export const mockSchools: School[] = [
  {
    id: 'sch1',
    name: 'St. Mary\'s High School',
    contact_person: 'Principal John D\'Souza',
    contact_phone: '+91-712-2541234',
    email: 'principal@stmarysnagpur.edu',
    address: 'Civil Lines, Nagpur, Maharashtra 440001',
    registered_events: ['evt1'],
    documents: {
      parent_consent_url: '/documents/stmarys-consent.pdf'
    }
  },
  {
    id: 'sch2',
    name: 'Vidya Niketan School',
    contact_person: 'Mrs. Savita Rao',
    contact_phone: '+91-712-2541235',
    email: 'savita@vidyaniketan.edu',
    address: 'Dharampeth, Nagpur, Maharashtra 440010',
    registered_events: ['evt2'],
    documents: {
      parent_consent_url: '/documents/vidyaniketan-consent.pdf'
    }
  },
  {
    id: 'sch3',
    name: 'Green Valley International',
    contact_person: 'Dr. Prakash Murthy',
    contact_phone: '+91-712-2541236',
    email: 'principal@greenvalleynagpur.edu',
    address: 'Wardha Road, Nagpur, Maharashtra 440015',
    registered_events: [],
    documents: {
      parent_consent_url: '/documents/greenvalley-consent.pdf'
    }
  },
  {
    id: 'sch4',
    name: 'Delhi Public School',
    contact_person: 'Mr. Rajesh Kumar',
    contact_phone: '+91-712-2541237',
    email: 'rajesh@dpsnagpur.edu',
    address: 'Kamptee Road, Nagpur, Maharashtra 440017',
    registered_events: ['evt3'],
    documents: {
      parent_consent_url: '/documents/dps-consent.pdf'
    }
  }
];

// Helper function to get date string N days from today
const getDateNDaysFromToday = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    code: 'CED-2025-001',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(2), // 2 days from today
    students_count: 45,
    consentFormsSubmitted: 42,
    status: 'approved',
    busDetails: 'Maharashtra SRTC - MH-31-AB-1234',
    assignedCoordinators: ['coord1', 'coord2'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec1', 'lec2'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' },
      { id: 't2', name: 'Mr. Ravi Kumar', phone: '+91-712-2545002', email: 'ravi@stmarysnagpur.edu', role: 'Science Teacher' }
    ],
    parentContacts: [
      { name: 'Rajesh Kumar', phone: '+91-9876111111', studentName: 'Aarav Kumar' },
      { name: 'Sunita Sharma', phone: '+91-9876111112', studentName: 'Diya Sharma' },
      { name: 'Mohan Reddy', phone: '+91-9876111113', studentName: 'Vivek Reddy' }
    ],
    emergencyContacts: [
      { name: 'Rajesh Kumar', phone: '+91-9876111111', studentName: 'Aarav Kumar' },
      { name: 'Sunita Sharma', phone: '+91-9876111112', studentName: 'Diya Sharma' }
    ],
    route: {
      startPoint: { lat: 21.1458, lng: 79.0882, name: 'St. Mary\'s High School, Civil Lines, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: [
        { lat: 21.1500, lng: 79.0900, name: 'Government Medical College, Nagpur', type: 'hospital' },
        { lat: 21.1600, lng: 79.0950, name: 'BP Petrol Station, Wardha Road', type: 'petrol_station' },
        { lat: 21.1950, lng: 79.0890, name: 'Narayani Hospital', type: 'hospital' }
      ]
    },
    documents: [
      { id: 'doc1', name: 'Parent Consent Forms', type: 'parent_consent', url: '/documents/evt1-consent.pdf', uploadedAt: getDateNDaysFromToday(-5) },
      { id: 'doc2', name: 'Forest Department Permission', type: 'permission', url: '/documents/evt1-permission.pdf', uploadedAt: getDateNDaysFromToday(-3) },
      { id: 'doc3', name: 'School Approval Letter', type: 'approval', url: '/documents/evt1-approval.pdf', uploadedAt: getDateNDaysFromToday(-2) }
    ],
    photos: [],
    feedbackSummary: 'Excellent experience, students loved the nature walk.'
  },
  {
    id: 'evt4',
    code: 'CED-2025-004',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(5), // 5 days from today
    students_count: 52,
    consentFormsSubmitted: 50,
    status: 'approved',
    busDetails: 'Private Bus - MH-31-CD-5678',
    assignedCoordinators: ['coord2', 'coord3'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec1', 'lec3'],
    teachers: [
      { id: 't3', name: 'Mrs. Priya Desai', phone: '+91-712-2545003', email: 'priya@stmarysnagpur.edu', role: 'Class Teacher' }
    ],
    parentContacts: [
      { name: 'Priya Patel', phone: '+91-9876444441', studentName: 'Rohan Patel' },
      { name: 'Vikram Singh', phone: '+91-9876444442', studentName: 'Ananya Singh' }
    ],
    emergencyContacts: [
      { name: 'Priya Patel', phone: '+91-9876444441', studentName: 'Rohan Patel' }
    ],
    route: {
      startPoint: { lat: 21.1458, lng: 79.0882, name: 'St. Mary\'s High School, Civil Lines, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: [
        { lat: 21.1500, lng: 79.0900, name: 'Government Medical College, Nagpur', type: 'hospital' },
        { lat: 21.1600, lng: 79.0950, name: 'HP Petrol Station, Wardha Road', type: 'petrol_station' }
      ]
    },
    documents: [
      { id: 'doc4', name: 'Parent Consent Forms', type: 'parent_consent', url: '/documents/evt4-consent.pdf', uploadedAt: getDateNDaysFromToday(-4) },
      { id: 'doc5', name: 'Forest Department Permission', type: 'permission', url: '/documents/evt4-permission.pdf', uploadedAt: getDateNDaysFromToday(-2) }
    ],
    photos: []
  },
  {
    id: 'evt5',
    code: 'CED-2025-005',
    schoolId: 'sch3',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(9), // 9 days from today
    students_count: 40,
    consentFormsSubmitted: 38,
    status: 'approved',
    busDetails: 'School Bus - MH-31-EF-9012',
    assignedCoordinators: ['coord1'],
    assignedDriverId: 'driver3',
    lecturerIds: ['lec2', 'lec4'],
    teachers: [
      { id: 't4', name: 'Dr. Prakash Murthy', phone: '+91-712-2545004', email: 'prakash@greenvalleynagpur.edu', role: 'Principal' },
      { id: 't5', name: 'Mrs. Kavita Nair', phone: '+91-712-2545005', email: 'kavita@greenvalleynagpur.edu', role: 'Science Teacher' }
    ],
    parentContacts: [
      { name: 'Amit Desai', phone: '+91-9876555551', studentName: 'Sneha Desai' },
      { name: 'Kavita Rao', phone: '+91-9876555552', studentName: 'Arjun Rao' }
    ],
    emergencyContacts: [
      { name: 'Amit Desai', phone: '+91-9876555551', studentName: 'Sneha Desai' },
      { name: 'Kavita Rao', phone: '+91-9876555552', studentName: 'Arjun Rao' }
    ],
    route: {
      startPoint: { lat: 21.1200, lng: 79.0500, name: 'Green Valley International, Wardha Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: [
        { lat: 21.1300, lng: 79.0600, name: 'Indira Gandhi Government Medical College, Nagpur', type: 'hospital' },
        { lat: 21.1400, lng: 79.0700, name: 'Indian Oil Petrol Station, Wardha Road', type: 'petrol_station' }
      ]
    },
    documents: [
      { id: 'doc6', name: 'Parent Consent Forms', type: 'parent_consent', url: '/documents/evt5-consent.pdf', uploadedAt: getDateNDaysFromToday(-7) }
    ],
    photos: []
  },
  {
    id: 'evt6',
    code: 'CED-2025-006',
    schoolId: 'sch2',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(14), // 14 days from today
    students_count: 48,
    consentFormsSubmitted: 46,
    status: 'approved',
    busDetails: 'Maharashtra SRTC - MH-31-GH-3456',
    assignedCoordinators: ['coord3', 'coord4'],
    assignedDriverId: 'driver4',
    lecturerIds: ['lec1', 'lec2', 'lec3'],
    teachers: [
      { id: 't6', name: 'Mrs. Savita Rao', phone: '+91-712-2545006', email: 'savita@vidyaniketan.edu', role: 'Principal' }
    ],
    parentContacts: [
      { name: 'Ravi Joshi', phone: '+91-9876666661', studentName: 'Meera Joshi' },
      { name: 'Sita Nair', phone: '+91-9876666662', studentName: 'Kiran Nair' }
    ],
    emergencyContacts: [
      { name: 'Ravi Joshi', phone: '+91-9876666661', studentName: 'Meera Joshi' }
    ],
    route: {
      startPoint: { lat: 21.1550, lng: 79.0850, name: 'Vidya Niketan School, Dharampeth, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: [
        { lat: 21.1600, lng: 79.0900, name: 'Government Medical College, Nagpur', type: 'hospital' },
        { lat: 21.1700, lng: 79.0920, name: 'Shell Petrol Station, Dharampeth', type: 'petrol_station' }
      ]
    },
    documents: [
      { id: 'doc7', name: 'Parent Consent Forms', type: 'parent_consent', url: '/documents/evt6-consent.pdf', uploadedAt: getDateNDaysFromToday(-10) },
      { id: 'doc8', name: 'Forest Department Permission', type: 'permission', url: '/documents/evt6-permission.pdf', uploadedAt: getDateNDaysFromToday(-8) }
    ],
    photos: []
  },
  {
    id: 'evt7',
    code: 'CED-2025-007',
    schoolId: 'sch4',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(19), // 19 days from today
    students_count: 55,
    consentFormsSubmitted: 52,
    status: 'approved',
    busDetails: 'Private Bus - MH-31-IJ-7890',
    assignedCoordinators: ['coord1', 'coord2', 'coord4'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec2', 'lec4'],
    teachers: [
      { id: 't7', name: 'Mr. Rajesh Kumar', phone: '+91-712-2545007', email: 'rajesh@dpsnagpur.edu', role: 'Principal' },
      { id: 't8', name: 'Mrs. Anjali Verma', phone: '+91-712-2545008', email: 'anjali@dpsnagpur.edu', role: 'Science Teacher' }
    ],
    parentContacts: [
      { name: 'Deepak Verma', phone: '+91-9876777771', studentName: 'Isha Verma' },
      { name: 'Neha Gupta', phone: '+91-9876777772', studentName: 'Rahul Gupta' }
    ],
    emergencyContacts: [
      { name: 'Deepak Verma', phone: '+91-9876777771', studentName: 'Isha Verma' },
      { name: 'Neha Gupta', phone: '+91-9876777772', studentName: 'Rahul Gupta' }
    ],
    route: {
      startPoint: { lat: 21.1350, lng: 79.0400, name: 'Delhi Public School, Kamptee Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: [
        { lat: 21.1400, lng: 79.0450, name: 'Indira Gandhi Government Medical College, Nagpur', type: 'hospital' },
        { lat: 21.1500, lng: 79.0500, name: 'Reliance Petrol Station, Kamptee Road', type: 'petrol_station' }
      ]
    },
    documents: [
      { id: 'doc9', name: 'Parent Consent Forms', type: 'parent_consent', url: '/documents/evt7-consent.pdf', uploadedAt: getDateNDaysFromToday(-15) }
    ],
    photos: []
  },
  {
    id: 'evt2',
    code: 'CED-2025-002',
    schoolId: 'sch2',
    ecoCentreId: 'ec2',
    date: '2025-04-10',
    students_count: 38,
    consentFormsSubmitted: 0,
    status: 'pending',
    assignedCoordinators: [],
    lecturerIds: ['lec3'],
    teachers: [],
    parentContacts: [
      { name: 'Amit Patel', phone: '+91-9876222221', studentName: 'Riya Patel' },
      { name: 'Kavita Desai', phone: '+91-9876222222', studentName: 'Arjun Desai' }
    ],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  {
    id: 'evt3',
    code: 'CED-2025-003',
    schoolId: 'sch4',
    ecoCentreId: 'ec3',
    date: '2025-02-20',
    students_count: 50,
    consentFormsSubmitted: 50,
    status: 'completed',
    busDetails: 'Private Bus - KA-02-CD-5678',
    assignedCoordinators: ['coord1', 'coord4'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec2', 'lec4'],
    teachers: [
      { id: 't9', name: 'Mr. Rajesh Kumar', phone: '+91-712-2545009', email: 'rajesh@dpsnagpur.edu', role: 'Principal' }
    ],
    parentContacts: [
      { name: 'Pradeep Singh', phone: '+91-9876333331', studentName: 'Karan Singh' },
      { name: 'Anita Joshi', phone: '+91-9876333332', studentName: 'Sneha Joshi' }
    ],
    emergencyContacts: [
      { name: 'Pradeep Singh', phone: '+91-9876333331', studentName: 'Karan Singh' }
    ],
    route: {
      startPoint: { lat: 21.1350, lng: 79.0400, name: 'Delhi Public School, Kamptee Road, Nagpur' },
      endPoint: { lat: 21.1970, lng: 79.0387, name: 'Gorewada Biodiversity Park' },
      waypoints: [
        { lat: 21.1400, lng: 79.0450, name: 'Indira Gandhi Government Medical College, Nagpur', type: 'hospital' },
        { lat: 21.1500, lng: 79.0500, name: 'BP Petrol Station, Kamptee Road', type: 'petrol_station' }
      ]
    },
    documents: [
      { id: 'doc10', name: 'Parent Consent Forms', type: 'parent_consent', url: '/documents/evt3-consent.pdf', uploadedAt: '2025-02-15' },
      { id: 'doc11', name: 'Event Completion Report', type: 'other', url: '/documents/evt3-report.pdf', uploadedAt: '2025-02-21' }
    ],
    photos: ['/images/event-3-photo1.jpg'],
    feedbackSummary: 'Amazing trekking experience for children.'
  },
  // Historical events (past dates)
  {
    id: 'evt-hist1',
    code: 'CED-2024-101',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(-15), // 15 days ago
    students_count: 60,
    consentFormsSubmitted: 60,
    status: 'completed',
    eventType: 'school',
    isFullyBooked: true,
    busDetails: 'Maharashtra SRTC - MH-31-AB-1111',
    assignedCoordinators: ['coord1', 'coord2'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec1', 'lec2'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['/images/hist-event-1.jpg'],
    feedbackSummary: 'Students thoroughly enjoyed the nature walk and bird watching session.'
  },
  {
    id: 'evt-hist2',
    code: 'CED-2024-102',
    schoolId: 'sch2',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(-10), // 10 days ago
    students_count: 80,
    consentFormsSubmitted: 78,
    status: 'completed',
    eventType: 'school',
    isFullyBooked: true,
    busDetails: 'Private Bus - MH-31-CD-2222',
    assignedCoordinators: ['coord2', 'coord3'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec2', 'lec3', 'lec4'],
    teachers: [
      { id: 't6', name: 'Mrs. Savita Rao', phone: '+91-712-2545006', email: 'savita@vidyaniketan.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['/images/hist-event-2.jpg'],
    feedbackSummary: 'Excellent wildlife education program. Students learned about forest conservation.'
  },
  {
    id: 'evt-hist3',
    code: 'CED-2024-103',
    schoolId: 'sch3',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(-5), // 5 days ago
    students_count: 30,
    consentFormsSubmitted: 30,
    status: 'completed',
    eventType: 'school',
    isPartiallyBooked: true,
    bookedActivities: ['act1-1', 'act1-2'], // Only booked nature walk and education session
    busDetails: 'School Bus - MH-31-EF-3333',
    assignedCoordinators: ['coord1'],
    assignedDriverId: 'driver3',
    lecturerIds: ['lec1'],
    teachers: [
      { id: 't4', name: 'Dr. Prakash Murthy', phone: '+91-712-2545004', email: 'prakash@greenvalleynagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['/images/hist-event-3.jpg'],
    feedbackSummary: 'Small group session was very interactive and engaging.'
  },
  // Guest lecture events (future)
  {
    id: 'evt-guest1',
    code: 'GL-2025-001',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(7), // 7 days from today
    students_count: 0,
    consentFormsSubmitted: 0,
    status: 'approved',
    eventType: 'guest_lecture',
    availableSeats: 120, // 120 seats available for booking
    lecturerIds: ['lec1', 'lec2'],
    assignedCoordinators: ['coord1'],
    teachers: [],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  {
    id: 'evt-guest2',
    code: 'GL-2025-002',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(12), // 12 days from today
    students_count: 0,
    consentFormsSubmitted: 0,
    status: 'approved',
    eventType: 'guest_lecture',
    availableSeats: 85, // 85 seats available (some already booked)
    lecturerIds: ['lec3', 'lec4'],
    assignedCoordinators: ['coord2'],
    teachers: [],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  {
    id: 'evt-guest3',
    code: 'GL-2025-003',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(20), // 20 days from today
    students_count: 0,
    consentFormsSubmitted: 0,
    status: 'approved',
    eventType: 'guest_lecture',
    availableSeats: 150, // Full capacity available
    lecturerIds: ['lec1', 'lec2', 'lec3'],
    assignedCoordinators: ['coord1', 'coord3'],
    teachers: [],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  // Fully booked school events (future)
  {
    id: 'evt-full1',
    code: 'CED-2025-008',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(8), // 8 days from today
    students_count: 150, // Full capacity
    consentFormsSubmitted: 148,
    status: 'approved',
    eventType: 'school',
    isFullyBooked: true,
    busDetails: 'Maharashtra SRTC - MH-31-KL-1111',
    assignedCoordinators: ['coord1', 'coord2', 'coord3'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec1', 'lec2', 'lec3', 'lec4'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' },
      { id: 't2', name: 'Mr. Ravi Kumar', phone: '+91-712-2545002', email: 'ravi@stmarysnagpur.edu', role: 'Science Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1458, lng: 79.0882, name: 'St. Mary\'s High School, Civil Lines, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: []
  },
  {
    id: 'evt-full2',
    code: 'CED-2025-009',
    schoolId: 'sch4',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(15), // 15 days from today
    students_count: 150, // Full capacity
    consentFormsSubmitted: 150,
    status: 'approved',
    eventType: 'school',
    isFullyBooked: true,
    busDetails: 'Private Bus - MH-31-MN-2222',
    assignedCoordinators: ['coord2', 'coord4'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec1', 'lec2'],
    teachers: [
      { id: 't7', name: 'Mr. Rajesh Kumar', phone: '+91-712-2545007', email: 'rajesh@dpsnagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1350, lng: 79.0400, name: 'Delhi Public School, Kamptee Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: []
  },
  // Partially booked school events (future)
  {
    id: 'evt-partial1',
    code: 'CED-2025-010',
    schoolId: 'sch2',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(10), // 10 days from today
    students_count: 90, // 90 out of 150 capacity
    consentFormsSubmitted: 88,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    busDetails: 'Maharashtra SRTC - MH-31-OP-3333',
    assignedCoordinators: ['coord3'],
    assignedDriverId: 'driver3',
    lecturerIds: ['lec2', 'lec4'],
    teachers: [
      { id: 't6', name: 'Mrs. Savita Rao', phone: '+91-712-2545006', email: 'savita@vidyaniketan.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1550, lng: 79.0850, name: 'Vidya Niketan School, Dharampeth, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: []
  },
  {
    id: 'evt-partial2',
    code: 'CED-2025-011',
    schoolId: 'sch3',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(18), // 18 days from today
    students_count: 75, // 75 out of 150 capacity
    consentFormsSubmitted: 72,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    busDetails: 'School Bus - MH-31-QR-4444',
    assignedCoordinators: ['coord1', 'coord4'],
    assignedDriverId: 'driver4',
    lecturerIds: ['lec1', 'lec3'],
    teachers: [
      { id: 't4', name: 'Dr. Prakash Murthy', phone: '+91-712-2545004', email: 'prakash@greenvalleynagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1200, lng: 79.0500, name: 'Green Valley International, Wardha Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: []
  },
  // Partial activity bookings (future)
  {
    id: 'evt-act1',
    code: 'CED-2025-012',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(11), // 11 days from today
    students_count: 35,
    consentFormsSubmitted: 33,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    bookedActivities: ['act1-1', 'act1-3'], // Only booked nature walk and photography
    busDetails: 'Private Bus - MH-31-ST-5555',
    assignedCoordinators: ['coord2'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec3'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1458, lng: 79.0882, name: 'St. Mary\'s High School, Civil Lines, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: []
  },
  {
    id: 'evt-act2',
    code: 'CED-2025-013',
    schoolId: 'sch4',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(16), // 16 days from today
    students_count: 25,
    consentFormsSubmitted: 24,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    bookedActivities: ['act1-4'], // Only booked meditation & yoga
    busDetails: 'School Bus - MH-31-UV-6666',
    assignedCoordinators: ['coord3'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec4'],
    teachers: [
      { id: 't8', name: 'Mrs. Anjali Verma', phone: '+91-712-2545008', email: 'anjali@dpsnagpur.edu', role: 'Science Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1350, lng: 79.0400, name: 'Delhi Public School, Kamptee Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: []
  },
  // Additional demo events for current month visibility with photos
  {
    id: 'evt-demo1',
    code: 'CED-2025-014',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(-3), // 3 days ago
    students_count: 65,
    consentFormsSubmitted: 63,
    status: 'completed',
    eventType: 'school',
    isFullyBooked: false,
    busDetails: 'Maharashtra SRTC - MH-31-DEMO-001',
    assignedCoordinators: ['coord1'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec1', 'lec2'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['seminary-hills-1.jpg'],
    feedbackSummary: 'Wonderful experience! Students learned about local bird species and forest conservation.'
  },
  {
    id: 'evt-demo2',
    code: 'GL-2025-004',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(3), // 3 days from today
    students_count: 0,
    consentFormsSubmitted: 0,
    status: 'approved',
    eventType: 'guest_lecture',
    availableSeats: 95,
    lecturerIds: ['lec1', 'lec3'],
    assignedCoordinators: ['coord2'],
    teachers: [],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  {
    id: 'evt-demo3',
    code: 'CED-2025-015',
    schoolId: 'sch2',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(6), // 6 days from today
    students_count: 150,
    consentFormsSubmitted: 148,
    status: 'approved',
    eventType: 'school',
    isFullyBooked: true,
    busDetails: 'Private Bus - MH-31-DEMO-002',
    assignedCoordinators: ['coord1', 'coord2', 'coord3'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec1', 'lec2', 'lec3', 'lec4'],
    teachers: [
      { id: 't6', name: 'Mrs. Savita Rao', phone: '+91-712-2545006', email: 'savita@vidyaniketan.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1550, lng: 79.0850, name: 'Vidya Niketan School, Dharampeth, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: ['welcome-about.jpg']
  },
  {
    id: 'evt-demo4',
    code: 'CED-2025-016',
    schoolId: 'sch3',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(13), // 13 days from today
    students_count: 110,
    consentFormsSubmitted: 108,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    busDetails: 'School Bus - MH-31-DEMO-003',
    assignedCoordinators: ['coord2', 'coord4'],
    assignedDriverId: 'driver3',
    lecturerIds: ['lec2', 'lec4'],
    teachers: [
      { id: 't4', name: 'Dr. Prakash Murthy', phone: '+91-712-2545004', email: 'prakash@greenvalleynagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1200, lng: 79.0500, name: 'Green Valley International, Wardha Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: ['gorewada1.jpg']
  },
  {
    id: 'evt-demo5',
    code: 'CED-2025-017',
    schoolId: 'sch4',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(17), // 17 days from today
    students_count: 40,
    consentFormsSubmitted: 38,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    bookedActivities: ['act1-1', 'act1-2', 'act1-4'], // Booked nature walk, education session, and meditation
    busDetails: 'Private Bus - MH-31-DEMO-004',
    assignedCoordinators: ['coord3'],
    assignedDriverId: 'driver4',
    lecturerIds: ['lec1'],
    teachers: [
      { id: 't7', name: 'Mr. Rajesh Kumar', phone: '+91-712-2545007', email: 'rajesh@dpsnagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    route: {
      startPoint: { lat: 21.1350, lng: 79.0400, name: 'Delhi Public School, Kamptee Road, Nagpur' },
      endPoint: { lat: 21.19931, lng: 79.0902, name: 'Seminary Hills' },
      waypoints: []
    },
    documents: [],
    photos: ['gorewada2.jpg', 'gorewada3.jpg']
  },
  {
    id: 'evt-demo6',
    code: 'GL-2025-005',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(21), // 21 days from today
    students_count: 0,
    consentFormsSubmitted: 0,
    status: 'approved',
    eventType: 'guest_lecture',
    availableSeats: 130,
    lecturerIds: ['lec2', 'lec3', 'lec4'],
    assignedCoordinators: ['coord1', 'coord3'],
    teachers: [],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  {
    id: 'evt-demo7',
    code: 'CED-2025-018',
    schoolId: 'sch1',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(-7), // 7 days ago
    students_count: 45,
    consentFormsSubmitted: 45,
    status: 'completed',
    eventType: 'school',
    isPartiallyBooked: true,
    bookedActivities: ['act1-3'], // Only booked photography
    busDetails: 'Maharashtra SRTC - MH-31-DEMO-005',
    assignedCoordinators: ['coord2'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec3'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['seminary-hills-1.jpg'],
    feedbackSummary: 'Photography workshop was excellent. Students captured beautiful nature shots.'
  },
  {
    id: 'evt-demo8',
    code: 'CED-2025-019',
    schoolId: 'sch2',
    ecoCentreId: 'ec1',
    date: getDateNDaysFromToday(-1), // Yesterday
    students_count: 70,
    consentFormsSubmitted: 68,
    status: 'completed',
    eventType: 'school',
    isFullyBooked: false,
    busDetails: 'Private Bus - MH-31-DEMO-006',
    assignedCoordinators: ['coord1', 'coord3'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec1', 'lec2'],
    teachers: [
      { id: 't6', name: 'Mrs. Savita Rao', phone: '+91-712-2545006', email: 'savita@vidyaniketan.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['welcome-about.jpg'],
    feedbackSummary: 'Great day at the eco centre. Students enjoyed the nature walk and bird watching.'
  },
  // Events for ec2 (Mogarkasa)
  {
    id: 'evt-ec2-1',
    code: 'CED-2025-020',
    schoolId: 'sch1',
    ecoCentreId: 'ec2',
    date: getDateNDaysFromToday(4), // 4 days from today
    students_count: 120,
    consentFormsSubmitted: 118,
    status: 'approved',
    eventType: 'school',
    isFullyBooked: true,
    busDetails: 'Maharashtra SRTC - MH-31-EC2-001',
    assignedCoordinators: ['coord1', 'coord2'],
    assignedDriverId: 'driver1',
    lecturerIds: ['lec1', 'lec2'],
    teachers: [
      { id: 't1', name: 'Mrs. Geeta Sharma', phone: '+91-712-2545001', email: 'geeta@stmarysnagpur.edu', role: 'Class Teacher' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['welcome-about.jpg']
  },
  {
    id: 'evt-ec2-2',
    code: 'GL-2025-006',
    ecoCentreId: 'ec2',
    date: getDateNDaysFromToday(9), // 9 days from today
    students_count: 0,
    consentFormsSubmitted: 0,
    status: 'approved',
    eventType: 'guest_lecture',
    availableSeats: 100,
    lecturerIds: ['lec3', 'lec4'],
    assignedCoordinators: ['coord2'],
    teachers: [],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: []
  },
  // Events for ec3 (Gorewada)
  {
    id: 'evt-ec3-1',
    code: 'CED-2025-021',
    schoolId: 'sch3',
    ecoCentreId: 'ec3',
    date: getDateNDaysFromToday(5), // 5 days from today
    students_count: 80,
    consentFormsSubmitted: 78,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    busDetails: 'School Bus - MH-31-EC3-001',
    assignedCoordinators: ['coord1'],
    assignedDriverId: 'driver3',
    lecturerIds: ['lec2', 'lec4'],
    teachers: [
      { id: 't4', name: 'Dr. Prakash Murthy', phone: '+91-712-2545004', email: 'prakash@greenvalleynagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['gorewada1.jpg', 'gorewada2.jpg']
  },
  {
    id: 'evt-ec3-2',
    code: 'CED-2025-022',
    schoolId: 'sch4',
    ecoCentreId: 'ec3',
    date: getDateNDaysFromToday(14), // 14 days from today
    students_count: 50,
    consentFormsSubmitted: 48,
    status: 'approved',
    eventType: 'school',
    isPartiallyBooked: true,
    bookedActivities: ['act3-1', 'act3-3'], // Booked lakeside walk and yoga
    busDetails: 'Private Bus - MH-31-EC3-002',
    assignedCoordinators: ['coord3'],
    assignedDriverId: 'driver2',
    lecturerIds: ['lec1'],
    teachers: [
      { id: 't7', name: 'Mr. Rajesh Kumar', phone: '+91-712-2545007', email: 'rajesh@dpsnagpur.edu', role: 'Principal' }
    ],
    parentContacts: [],
    emergencyContacts: [],
    documents: [],
    photos: ['gorewada3.jpg', 'gorewada4.jpg']
  }
];

// Booking Activities for Eco Centres
export const mockBookingActivities: BookingActivity[] = [
  // Seminary Hills (ec1) activities
  {
    id: 'bact-ec1-1',
    ecoCentreId: 'ec1',
    name: 'Nature Trail',
    type: 'PAID',
    isSlotBased: true,
    price: 200,
    capacity: 30,
    description: 'Guided nature walk through scenic trails',
    slots: [
      { id: 'slot-ec1-1-1', startTime: '08:00', endTime: '10:00', maxCapacity: 30, availableCapacity: 25 },
      { id: 'slot-ec1-1-2', startTime: '10:00', endTime: '12:00', maxCapacity: 30, availableCapacity: 30 },
      { id: 'slot-ec1-1-3', startTime: '14:00', endTime: '16:00', maxCapacity: 30, availableCapacity: 28 },
      { id: 'slot-ec1-1-4', startTime: '16:00', endTime: '18:00', maxCapacity: 30, availableCapacity: 30 }
    ],
    photos: ['seminary-hills-1.jpg']
  },
  {
    id: 'bact-ec1-2',
    ecoCentreId: 'ec1',
    name: 'Bird Watching',
    type: 'FREE',
    isSlotBased: false,
    capacity: 50,
    description: 'Free bird watching session with expert guides',
    photos: ['seminary-hills-1.jpg']
  },
  {
    id: 'bact-ec1-3',
    ecoCentreId: 'ec1',
    name: 'Boating',
    type: 'PAID',
    isSlotBased: false,
    price: 150,
    capacity: 40,
    description: 'Per person boating on the lake',
    photos: ['seminary-hills-1.jpg']
  },
  {
    id: 'bact-ec1-4',
    ecoCentreId: 'ec1',
    name: 'Nature Conservation Seminar',
    type: 'FREE',
    isSlotBased: true,
    capacity: 100,
    description: 'Educational seminar on forest conservation',
    slots: [
      { id: 'slot-ec1-4-1', startTime: '11:00', endTime: '13:00', maxCapacity: 100, availableCapacity: 85 },
      { id: 'slot-ec1-4-2', startTime: '15:00', endTime: '17:00', maxCapacity: 100, availableCapacity: 100 }
    ],
    photos: ['seminary-hills-1.jpg']
  },
  
  // Mogarkasa (ec2) activities
  {
    id: 'bact-ec2-1',
    ecoCentreId: 'ec2',
    name: 'Safari',
    type: 'PAID',
    isSlotBased: true,
    price: 500,
    capacity: 36, // 6 vehicles * 6 people
    requiresVehicles: true,
    vehicleCapacity: 6,
    description: 'Jungle safari with wildlife spotting opportunities',
    slots: [
      { id: 'slot-ec2-1-1', startTime: '06:00', endTime: '09:00', maxCapacity: 36, availableCapacity: 24 },
      { id: 'slot-ec2-1-2', startTime: '15:00', endTime: '18:00', maxCapacity: 36, availableCapacity: 30 }
    ],
    photos: ['welcome-about.jpg']
  },
  {
    id: 'bact-ec2-2',
    ecoCentreId: 'ec2',
    name: 'Nature Trail',
    type: 'PAID',
    isSlotBased: true,
    price: 300,
    capacity: 25,
    description: 'Forest trail trekking adventure',
    slots: [
      { id: 'slot-ec2-2-1', startTime: '07:00', endTime: '09:30', maxCapacity: 25, availableCapacity: 20 },
      { id: 'slot-ec2-2-2', startTime: '10:00', endTime: '12:30', maxCapacity: 25, availableCapacity: 25 },
      { id: 'slot-ec2-2-3', startTime: '14:00', endTime: '16:30', maxCapacity: 25, availableCapacity: 18 }
    ],
    photos: ['welcome-about.jpg']
  },
  {
    id: 'bact-ec2-3',
    ecoCentreId: 'ec2',
    name: 'Bird Watching',
    type: 'PAID',
    isSlotBased: false,
    price: 250,
    capacity: 20,
    description: 'Expert-guided bird watching session',
    photos: ['welcome-about.jpg']
  },
  {
    id: 'bact-ec2-4',
    ecoCentreId: 'ec2',
    name: 'Wildlife Photography Workshop',
    type: 'PAID',
    isSlotBased: true,
    price: 400,
    capacity: 15,
    description: 'Learn wildlife photography techniques',
    slots: [
      { id: 'slot-ec2-4-1', startTime: '08:00', endTime: '11:00', maxCapacity: 15, availableCapacity: 10 },
      { id: 'slot-ec2-4-2', startTime: '13:00', endTime: '16:00', maxCapacity: 15, availableCapacity: 15 }
    ],
    photos: ['welcome-about.jpg']
  },
  {
    id: 'bact-ec2-5',
    ecoCentreId: 'ec2',
    name: 'Conservation Awareness Event',
    type: 'FREE',
    isSlotBased: true,
    capacity: 80,
    description: 'Special event on wildlife conservation',
    slots: [
      { id: 'slot-ec2-5-1', startTime: '10:00', endTime: '13:00', maxCapacity: 80, availableCapacity: 65 }
    ],
    photos: ['welcome-about.jpg']
  },
  
  // Gorewada (ec3) activities
  {
    id: 'bact-ec3-1',
    ecoCentreId: 'ec3',
    name: 'Lakeside Nature Walk',
    type: 'PAID',
    isSlotBased: true,
    price: 200,
    capacity: 30,
    description: 'Guided walk around Gorewada Lake',
    slots: [
      { id: 'slot-ec3-1-1', startTime: '07:00', endTime: '09:00', maxCapacity: 30, availableCapacity: 25 },
      { id: 'slot-ec3-1-2', startTime: '09:00', endTime: '11:00', maxCapacity: 30, availableCapacity: 30 },
      { id: 'slot-ec3-1-3', startTime: '16:00', endTime: '18:00', maxCapacity: 30, availableCapacity: 28 }
    ],
    photos: ['gorewada1.jpg']
  },
  {
    id: 'bact-ec3-2',
    ecoCentreId: 'ec3',
    name: 'Boating',
    type: 'PAID',
    isSlotBased: false,
    price: 200,
    capacity: 50,
    description: 'Per person boating on Gorewada Lake',
    photos: ['gorewada2.jpg']
  },
  {
    id: 'bact-ec3-3',
    ecoCentreId: 'ec3',
    name: 'Bird Watching Tour',
    type: 'FREE',
    isSlotBased: false,
    capacity: 25,
    description: 'Free bird watching tour around the lake',
    photos: ['gorewada3.jpg']
  },
  {
    id: 'bact-ec3-4',
    ecoCentreId: 'ec3',
    name: 'Biodiversity Education Seminar',
    type: 'FREE',
    isSlotBased: true,
    capacity: 60,
    description: 'Educational seminar on biodiversity conservation',
    slots: [
      { id: 'slot-ec3-4-1', startTime: '10:00', endTime: '12:00', maxCapacity: 60, availableCapacity: 45 },
      { id: 'slot-ec3-4-2', startTime: '14:00', endTime: '16:00', maxCapacity: 60, availableCapacity: 60 }
    ],
    photos: ['gorewada4.jpg']
  }
];

// Mock Bookings
let bookingCounter = 1;
const generateBookingId = () => `BK-2025-${(bookingCounter++).toString().padStart(4, '0')}`;

export const mockBookings: Booking[] = [
  {
    id: 'book1',
    bookingId: generateBookingId(),
    ecoCentreId: 'ec1',
    activityId: 'bact-ec1-1',
    date: getDateNDaysFromToday(2),
    slotId: 'slot-ec1-1-1',
    name: 'Rajesh Kumar',
    mobile: '+91-9876543210',
    participants: 4,
    totalAmount: 800,
    paymentStatus: 'completed',
    status: 'confirmed',
    createdAt: getDateNDaysFromToday(-1)
  },
  {
    id: 'book2',
    bookingId: generateBookingId(),
    ecoCentreId: 'ec2',
    activityId: 'bact-ec2-1',
    date: getDateNDaysFromToday(3),
    slotId: 'slot-ec2-1-1',
    name: 'Priya Sharma',
    mobile: '+91-9876543211',
    participants: 6,
    vehicles: 1,
    totalAmount: 500,
    paymentStatus: 'completed',
    status: 'confirmed',
    createdAt: getDateNDaysFromToday(-2)
  }
];

// Helper function to get booking activities for an eco centre
export const getBookingActivitiesForCentre = (ecoCentreId: string): BookingActivity[] => {
  return mockBookingActivities.filter(activity => activity.ecoCentreId === ecoCentreId);
};

// Helper function to check slot availability for a date
export const getAvailableSlotsForDate = (
  activityId: string,
  date: string
): ActivitySlot[] => {
  const activity = mockBookingActivities.find(a => a.id === activityId);
  if (!activity || !activity.isSlotBased || !activity.slots) {
    return [];
  }
  
  // Get bookings for this activity and date
  const bookingsForDate = mockBookings.filter(
    b => b.activityId === activityId && b.date === date && b.status === 'confirmed'
  );
  
  // Calculate available capacity for each slot
  return activity.slots.map(slot => {
    const bookingsForSlot = bookingsForDate.filter(b => b.slotId === slot.id);
    let bookedCapacity = 0;
    
    bookingsForSlot.forEach(booking => {
      if (activity.requiresVehicles && booking.vehicles) {
        // For safari: vehicles * vehicleCapacity
        bookedCapacity += booking.vehicles * (activity.vehicleCapacity || 6);
      } else {
        // For regular activities: participants
        bookedCapacity += booking.participants;
      }
    });
    
    return {
      ...slot,
      availableCapacity: Math.max(0, slot.maxCapacity - bookedCapacity)
    };
  });
};

// Helper function to create a booking
export const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingId' | 'createdAt' | 'status'>): Booking => {
  const booking: Booking = {
    id: `book-${Date.now()}`,
    bookingId: generateBookingId(),
    ...bookingData,
    status: 'confirmed',
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  mockBookings.push(booking);
  return booking;
};

// Admin helper functions for booking management
export const updateBookingStatus = (bookingId: string, status: 'confirmed' | 'cancelled'): boolean => {
  const booking = mockBookings.find(b => b.id === bookingId || b.bookingId === bookingId);
  if (booking) {
    booking.status = status;
    return true;
  }
  return false;
};

export const updateBookingPaymentStatus = (bookingId: string, paymentStatus: 'pending' | 'completed'): boolean => {
  const booking = mockBookings.find(b => b.id === bookingId || b.bookingId === bookingId);
  if (booking) {
    booking.paymentStatus = paymentStatus;
    return true;
  }
  return false;
};

export const deleteBooking = (bookingId: string): boolean => {
  const index = mockBookings.findIndex(b => b.id === bookingId || b.bookingId === bookingId);
  if (index > -1) {
    mockBookings.splice(index, 1);
    return true;
  }
  return false;
};

export const getBookingById = (bookingId: string): Booking | undefined => {
  return mockBookings.find(b => b.id === bookingId || b.bookingId === bookingId);
};

export const getBookingsByDateRange = (startDate: string, endDate: string): Booking[] => {
  return mockBookings.filter(b => b.date >= startDate && b.date <= endDate);
};

export const getBookingsByEcoCentre = (ecoCentreId: string): Booking[] => {
  return mockBookings.filter(b => b.ecoCentreId === ecoCentreId);
};

export const getBookingsByActivity = (activityId: string): Booking[] => {
  return mockBookings.filter(b => b.activityId === activityId);
};

export const getTotalRevenue = (): number => {
  return mockBookings
    .filter(b => b.status === 'confirmed' && b.paymentStatus === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);
};

export const getRevenueByDateRange = (startDate: string, endDate: string): number => {
  return mockBookings
    .filter(b => 
      b.status === 'confirmed' && 
      b.paymentStatus === 'completed' &&
      b.date >= startDate && 
      b.date <= endDate
    )
    .reduce((sum, b) => sum + b.totalAmount, 0);
};

export const getPendingPayments = (): Booking[] => {
  return mockBookings.filter(b => b.paymentStatus === 'pending' && b.status === 'confirmed');
};

export const getPendingPaymentsTotal = (): number => {
  return getPendingPayments().reduce((sum, b) => sum + b.totalAmount, 0);
};

// Helper function to update activity
export const updateBookingActivity = (activityId: string, updates: Partial<BookingActivity>): boolean => {
  const activity = mockBookingActivities.find(a => a.id === activityId);
  if (activity) {
    Object.assign(activity, updates);
    return true;
  }
  return false;
};

// Helper function to delete activity
export const deleteBookingActivity = (activityId: string): boolean => {
  const index = mockBookingActivities.findIndex(a => a.id === activityId);
  if (index > -1) {
    mockBookingActivities.splice(index, 1);
    return true;
  }
  return false;
};

// Helper function to add activity
export const addBookingActivity = (activity: BookingActivity): boolean => {
  if (!mockBookingActivities.find(a => a.id === activity.id)) {
    mockBookingActivities.push(activity);
    return true;
  }
  return false;
};

// Helper function to update slot
export const updateActivitySlot = (
  activityId: string, 
  slotId: string, 
  updates: Partial<ActivitySlot>
): boolean => {
  const activity = mockBookingActivities.find(a => a.id === activityId);
  if (activity && activity.slots) {
    const slot = activity.slots.find(s => s.id === slotId);
    if (slot) {
      Object.assign(slot, updates);
      // Recalculate availableCapacity if maxCapacity changed
      if (updates.maxCapacity !== undefined) {
        const bookings = mockBookings.filter(
          b => b.activityId === activityId && 
          b.slotId === slotId && 
          b.status === 'confirmed'
        );
        let bookedCapacity = 0;
        bookings.forEach(booking => {
          if (activity.requiresVehicles && booking.vehicles) {
            bookedCapacity += booking.vehicles * (activity.vehicleCapacity || 6);
          } else {
            bookedCapacity += booking.participants;
          }
        });
        slot.availableCapacity = Math.max(0, slot.maxCapacity - bookedCapacity);
      }
      return true;
    }
  }
  return false;
};

// Helper function to add slot to activity
export const addActivitySlot = (activityId: string, slot: ActivitySlot): boolean => {
  const activity = mockBookingActivities.find(a => a.id === activityId);
  if (activity && activity.slots) {
    if (!activity.slots.find(s => s.id === slot.id)) {
      activity.slots.push(slot);
      return true;
    }
  }
  return false;
};

// Helper function to delete slot
export const deleteActivitySlot = (activityId: string, slotId: string): boolean => {
  const activity = mockBookingActivities.find(a => a.id === activityId);
  if (activity && activity.slots) {
    const index = activity.slots.findIndex(s => s.id === slotId);
    if (index > -1) {
      activity.slots.splice(index, 1);
      return true;
    }
  }
  return false;
};

// Helper functions for Eco Centre management
export const addEcoCentre = (centreData: Omit<EcoCentre, 'id'>): EcoCentre => {
  const newCentre: EcoCentre = {
    id: `ec${Date.now()}`,
    ...centreData
  };
  mockEcoCentres.push(newCentre);
  return newCentre;
};

export const updateEcoCentre = (centreId: string, updates: Partial<EcoCentre>): boolean => {
  const centre = mockEcoCentres.find(c => c.id === centreId);
  if (centre) {
    Object.assign(centre, updates);
    return true;
  }
  return false;
};

export const deleteEcoCentre = (centreId: string): boolean => {
  const index = mockEcoCentres.findIndex(c => c.id === centreId);
  if (index > -1) {
    mockEcoCentres.splice(index, 1);
    return true;
  }
  return false;
};

export const getEcoCentreById = (centreId: string): EcoCentre | undefined => {
  return mockEcoCentres.find(c => c.id === centreId);
};
