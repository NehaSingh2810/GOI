const News = require('../models/News');
const User = require('../models/User');
const axios = require('axios');

exports.getNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    const category = req.query.category;
    if (category && category !== 'All') {
      filter.category = category;
    }

    const totalNews = await News.countDocuments(filter);
    const news = await News.find(filter)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalNews / limit),
        totalNews,
        hasNext: page * limit < totalNews,
        hasPrev: page > 1
      },
      hasMore: page * limit < totalNews 
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error while fetching news.' });
  }
};

exports.createNews = async (req, res) => {
  const { title, content, category, imageUrl } = req.body;

  if (!title || !content || !imageUrl) {
    return res.status(400).json({ message: 'Title, content, and image URL are required.' });
  }

  try {
    const news = new News({ 
      title, 
      content, 
      category: category || 'General',
      imageUrl,
      author: req.user.id 
    });
    await news.save();
    await news.populate('author', 'name');
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Server error while creating news.' });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name');
    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    res.status(500).json({ message: 'Server error while fetching news.' });
  }
};

exports.fetchAndSaveNews = async (req, res) => {
  try {
    // Try to fetch from NewsAPI
    const categoryParam = req.body?.category || req.query?.category; // optional category
    const params = {
      apiKey: process.env.NEWS_API_KEY || 'test',
      country: 'in',
      pageSize: 20
    };
    if (categoryParam && categoryParam !== 'All') {
      params.category = categoryParam.toLowerCase();
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', { params });


    const articles = response.data.articles;

    // Find a default author to attach to fetched news (seed user expected to exist)
    const defaultAuthor = await User.findOne();

    for (const article of articles) {
      const existing = await News.findOne({ title: article.title });
      if (!existing) {
        const news = new News({
          title: article.title,
          content: article.description || article.content || 'No content available.',
          category: categoryParam && categoryParam !== 'All' ? categoryParam : 'General',
          imageUrl: article.urlToImage,
          publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
          author: defaultAuthor ? defaultAuthor._id : undefined
        });
        await news.save();
      }
    }

    res.json({ message: 'News fetched and saved successfully.' });
  } catch (error) {
    console.error('Error fetching news from API:', error);
    // If API fails, add some mock news
    (async () => {
      const mockNews = [
        {
          title: 'Mock News: Government Launches New Initiative',
          content: 'The government has announced a new initiative to improve public services.',
          category: 'General',
          publishedAt: new Date()
        },
        {
          title: 'Mock News: Technology Update in Education',
          content: 'New technology programs are being introduced in schools.',
          category: 'Education',
          publishedAt: new Date()
        }
      ];

      // Attach a default author for mock items as well
      const defaultAuthor = await User.findOne();
      for (const item of mockNews) {
        const existing = await News.findOne({ title: item.title });
        if (!existing) {
          const news = new News({ ...item, author: defaultAuthor ? defaultAuthor._id : undefined });
          await news.save();
        }
      }
    })();

    res.json({ message: 'Mock news added successfully.' });
  }
};