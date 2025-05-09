/**
 * Seed data for the Contest App
 * This file provides real data for testing the application
 */

// Users data
const users = [
  {
    _id: '60f1a5c5e98f4a001c9b1234',
    username: 'abhishek_photo',
    email: 'abhishek@example.com',
    phone: '+919876543210',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Professional photographer specializing in landscapes and wildlife',
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    password: 'password123',
  },
  {
    _id: '60f1a5c5e98f4a001c9b1235',
    username: 'priya_captures',
    email: 'priya@example.com',
    phone: '+919876543211',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Portrait and wedding photographer based in Mumbai',
    isVerified: true,
    createdAt: new Date('2023-02-10'),
    password: 'password123',
  },
  {
    _id: '60f1a5c5e98f4a001c9b1236',
    username: 'arjun_lens',
    email: 'arjun@example.com',
    phone: '+919876543212',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Street photography enthusiast. Love capturing life as it happens',
    isVerified: true,
    createdAt: new Date('2023-03-05'),
    password: 'password123',
  },
  {
    _id: '60f1a5c5e98f4a001c9b1237',
    username: 'neha_creative',
    email: 'neha@example.com',
    phone: '+919876543213',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    bio: 'Creative photographer exploring new techniques and styles',
    isVerified: true,
    createdAt: new Date('2023-01-25'),
    password: 'password123',
  },
  {
    _id: '60f1a5c5e98f4a001c9b1238',
    username: 'rajesh_moments',
    email: 'rajesh@example.com',
    phone: '+919876543214',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    bio: 'Capturing moments that last forever',
    isVerified: true,
    createdAt: new Date('2023-02-20'),
    password: 'password123',
  },
];

// Contests data
const contests = [
  {
    _id: '61f1a5c5e98f4a001c9b1111',
    title: 'Incredible India Landscapes',
    description:
      'Share your best landscape photographs capturing the diverse natural beauty of India. From the Himalayas to the beaches of Kerala, show us the incredible landscapes that make India special.',
    images: [
      'https://images.unsplash.com/photo-1506461883276-594a5682479a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593181629974-e21a6cbf6edf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'abhishek_photo',
    votingDuration: '72h',
    startDate: new Date('2023-05-01'),
    status: 'active',
    participants: ['priya_captures', 'arjun_lens'],
    createdAt: new Date('2023-04-25'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1112',
    title: 'Street Life of Mumbai',
    description:
      'Capture the vibrant street life of Mumbai. Looking for authentic moments that tell stories of everyday life in this bustling metropolis.',
    images: [
      'https://images.unsplash.com/photo-1566552881553-c5d0cb7b4532?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'arjun_lens',
    votingDuration: '48h',
    startDate: new Date('2023-05-10'),
    status: 'active',
    participants: ['abhishek_photo', 'rajesh_moments'],
    createdAt: new Date('2023-05-05'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1113',
    title: 'Portraits of India',
    description:
      'Share your best portrait photography showcasing the diverse people of India. Looking for portraits that capture emotion and tell a story.',
    images: [
      'https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627054715513-c2132dff1d65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'priya_captures',
    votingDuration: '24h',
    startDate: new Date('2023-05-15'),
    status: 'active',
    participants: ['neha_creative', 'rajesh_moments'],
    createdAt: new Date('2023-05-12'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1114',
    title: 'Festivals of India',
    description: 'Capture the vibrant colors and celebrations of Indian festivals. From Holi to Diwali, show us the joy and traditions that make our festivals special.',
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'neha_creative',
    votingDuration: '48h',
    startDate: new Date('2023-05-20'),
    status: 'active',
    participants: ['abhishek_photo', 'priya_captures'],
    createdAt: new Date('2023-05-18'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1115',
    title: 'Architectural Marvels',
    description: 'Showcase the stunning architecture of India. From ancient temples to modern skyscrapers, capture the beauty of our built heritage.',
    images: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'rajesh_moments',
    votingDuration: '72h',
    startDate: new Date('2023-05-25'),
    status: 'active',
    participants: ['arjun_lens', 'neha_creative'],
    createdAt: new Date('2023-05-22'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1116',
    title: 'Wildlife Wonders',
    description: 'Capture the incredible wildlife of India. From majestic tigers to colorful birds, show us the beauty of our natural world.',
    images: [
      'https://images.unsplash.com/photo-1534567110353-1f291fbe78d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'abhishek_photo',
    votingDuration: '48h',
    startDate: new Date('2023-06-01'),
    status: 'active',
    participants: ['priya_captures', 'rajesh_moments'],
    createdAt: new Date('2023-05-28'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1117',
    title: 'Food Photography',
    description: 'Showcase the diverse and delicious cuisine of India. From street food to fine dining, capture the art of Indian cooking.',
    images: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'priya_captures',
    votingDuration: '24h',
    startDate: new Date('2023-06-05'),
    status: 'active',
    participants: ['neha_creative', 'abhishek_photo'],
    createdAt: new Date('2023-06-02'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1118',
    title: 'Urban Exploration',
    description: 'Discover and capture the hidden gems of Indian cities. From abandoned buildings to secret gardens, show us the unseen side of urban life.',
    images: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'arjun_lens',
    votingDuration: '72h',
    startDate: new Date('2023-06-10'),
    status: 'active',
    participants: ['rajesh_moments', 'priya_captures'],
    createdAt: new Date('2023-06-07'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1119',
    title: 'Cultural Heritage',
    description: 'Document the rich cultural heritage of India. From traditional arts to ancient crafts, capture the legacy of our ancestors.',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'neha_creative',
    votingDuration: '48h',
    startDate: new Date('2023-06-15'),
    status: 'active',
    participants: ['abhishek_photo', 'arjun_lens'],
    createdAt: new Date('2023-06-12'),
  },
  {
    _id: '61f1a5c5e98f4a001c9b1120',
    title: 'Seasons of India',
    description: 'Capture the beauty of different seasons in India. From monsoon rains to winter snow, show us how nature transforms our landscape.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    ],
    creator: 'rajesh_moments',
    votingDuration: '72h',
    startDate: new Date('2023-06-20'),
    status: 'active',
    participants: ['priya_captures', 'neha_creative'],
    createdAt: new Date('2023-06-17'),
  }
];

// Invitations data
const invitations = [
  {
    _id: '62f1a5c5e98f4a001c9b2221',
    contestId: '61f1a5c5e98f4a001c9b1111', // Incredible India Landscapes
    from: '60f1a5c5e98f4a001c9b1234', // abhishek_photo
    to: 'neha_creative',
    method: 'app',
    status: 'pending',
    createdAt: new Date('2023-04-26'),
  },
  {
    _id: '62f1a5c5e98f4a001c9b2222',
    contestId: '61f1a5c5e98f4a001c9b1111', // Incredible India Landscapes
    from: '60f1a5c5e98f4a001c9b1234', // abhishek_photo
    to: 'rajesh_moments',
    method: 'app',
    status: 'pending',
    createdAt: new Date('2023-04-26'),
  },
  {
    _id: '62f1a5c5e98f4a001c9b2223',
    contestId: '61f1a5c5e98f4a001c9b1112', // Street Life of Mumbai
    from: '60f1a5c5e98f4a001c9b1236', // arjun_lens
    to: 'priya_captures',
    method: 'app',
    status: 'pending',
    createdAt: new Date('2023-05-06'),
  },
  {
    _id: '62f1a5c5e98f4a001c9b2224',
    contestId: '61f1a5c5e98f4a001c9b1112', // Street Life of Mumbai
    from: '60f1a5c5e98f4a001c9b1236', // arjun_lens
    to: '+919876543213', // neha's phone
    method: 'sms',
    status: 'pending',
    createdAt: new Date('2023-05-06'),
    metadata: {
      message: 'Join our street photography contest!',
    },
  },
  {
    _id: '62f1a5c5e98f4a001c9b2225',
    contestId: '61f1a5c5e98f4a001c9b1113', // Portraits of India
    from: '60f1a5c5e98f4a001c9b1235', // priya_captures
    to: 'abhishek_photo',
    method: 'app',
    status: 'accepted',
    createdAt: new Date('2023-05-12'),
    responseDate: new Date('2023-05-13'),
  },
  {
    _id: '62f1a5c5e98f4a001c9b2226',
    contestId: '61f1a5c5e98f4a001c9b1113', // Portraits of India
    from: '60f1a5c5e98f4a001c9b1235', // priya_captures
    to: 'arjun_lens',
    method: 'app',
    status: 'declined',
    createdAt: new Date('2023-05-12'),
    responseDate: new Date('2023-05-14'),
  },
  {
    _id: '62f1a5c5e98f4a001c9b2227',
    contestId: '61f1a5c5e98f4a001c9b1113', // Portraits of India
    from: '60f1a5c5e98f4a001c9b1235', // priya_captures
    to: '+919876543214', // rajesh's phone
    method: 'whatsapp',
    status: 'pending',
    createdAt: new Date('2023-05-12'),
    metadata: {
      message: 'Join our portrait photography contest on the app!',
    },
  },
];

module.exports = {users, contests, invitations};
