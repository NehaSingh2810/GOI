const mongoose = require('mongoose');
const News = require('./models/News');
const User = require('./models/User');

async function createSampleData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/gov-feedback');
    console.log('Connected to MongoDB');

    // Create a sample user if not exists
    let user = await User.findOne({ email: 'admin@gov.in' });
    if (!user) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = new User({
        name: 'Government Admin',
        email: 'admin@gov.in',
        password: hashedPassword
      });
      await user.save();
      console.log('Sample user created');
    }

    // Create sample news
    const sampleNews = [
      {
        title: 'New Digital India Initiative Launched',
        content: 'The Government of India has launched a comprehensive digital transformation program aimed at improving citizen services and governance efficiency. This initiative will connect rural areas with high-speed internet and provide digital literacy programs to millions of citizens.',
        category: 'Technology',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        author: user._id
      },
      {
        title: 'Healthcare Reforms for Rural Areas',
        content: 'A new healthcare policy has been introduced to strengthen medical infrastructure in rural India. The program includes building 500 new hospitals and training 10,000 healthcare workers over the next three years.',
        category: 'Healthcare',
        imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800',
        author: user._id
      },
      {
        title: 'Education Technology Program Announced',
        content: 'The Ministry of Education has announced a major initiative to integrate technology in classrooms across the country. Smart classrooms will be established in 10,000 schools with interactive learning tools.',
        category: 'Education',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        author: user._id
      },
      {
        title: 'Infrastructure Development in Northeast',
        content: 'Major infrastructure projects have been approved for the Northeast region, including new highways, bridges, and railway connections. This will boost economic growth and improve connectivity.',
        category: 'Infrastructure',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        author: user._id
      }
    ];

    for (const newsData of sampleNews) {
      const existingNews = await News.findOne({ title: newsData.title });
      if (!existingNews) {
        const news = new News(newsData);
        await news.save();
        console.log('Created news:', newsData.title);
      }
    }

    console.log('Sample data creation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createSampleData();