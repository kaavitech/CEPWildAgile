// Mock data for the Child Education Program

export interface EcoCentre {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
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
  schoolId: string;
  ecoCentreId: string;
  date: string;
  students_count: number;
  consentFormsSubmitted: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
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
      address: 'Seminary Hills, Nagpur, Maharashtra 440006'
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
    youtubeVideoUrl: ['https://youtu.be/vjH8YEbhxSw','https://youtu.be/txle6x-rnFA','https://youtu.be/ao1tTo7iZ10']
  },
  {
    id: 'ec2',
    name: 'Mogarkasa-Mangarli Conservation Reserve',
    officialWebsiteUrl: 'https://www.mogarkasatourism.in/index.html',
    location: {
      lat: 21.4987,
      lng: 79.4730,
      address: 'Paoni town, Nagpur District, Maharashtra 441401'
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
    youtubeVideoUrl: ['https://youtu.be/oIC68RLrVnA','https://www.youtube.com/watch?v=ww2PEAZSpes','https://www.youtube.com/watch?v=el9YM25WBmM']
  },
  {
    id: 'ec3',
    name: 'Gorewada Biodiversity Park',
    officialWebsiteUrl : 'https://wildgorewada.com/',
    location: {
      lat: 21.1970,
      lng: 79.0387,
      address: 'Gorewada Bio Park, Mankapur Ring Road, Nagpur, Maharashtra, India'
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
    description: 'Gorewada Biodiversity Park is a nature-trail and lake-fringe bio-park located within the Gorewada Reserve Forest. It offers a peaceful walking trail, birdwatching opportunities, and a scenic lakeside environment in the midst of Nagpur’s green belt',
    features: ['Gorewada Lake', 'Bird Watching', 'Nature Trail', 'Yoga Machans & Pagodas', 'Wellness / Education'],
    youtubeVideoUrl : ['https://youtu.be/GPH7AHuyvAY']
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
  }
];
