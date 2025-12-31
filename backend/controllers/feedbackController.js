const Feedback = require('../models/Feedback');
const News = require('../models/News');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  if (result.score > 0) return 'positive';
  if (result.score < 0) return 'negative';
  return 'neutral';
};

exports.submitFeedback = async (req, res) => {
  const { newsId, rating, comment } = req.body;

  if (!newsId || !rating) {
    return res.status(400).json({ message: 'News ID and rating are required.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    const sentimentResult = comment ? analyzeSentiment(comment) : 'neutral';
    const feedback = new Feedback({
      user: req.user.id,
      news: newsId,
      rating,
      comment: comment || '',
      sentiment: sentimentResult
    });
    await feedback.save();
    // populate the user's name (User schema uses `name`, not `username`)
    await feedback.populate('user', 'name');

    // Emit real-time event for feedback updates
    req.io.emit('feedbackUpdate', { newsId, feedback });

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback.' });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id })
      .populate('news', 'title')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    res.status(500).json({ message: 'Server error while fetching feedbacks.' });
  }
};

exports.getFeedbacks = async (req, res) => {
  const { newsId } = req.params;

  try {
    const feedbacks = await Feedback.find({ news: newsId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks for news:', error);
    res.status(500).json({ message: 'Server error while fetching feedbacks.' });
  }
};

exports.calculateFeedback = async (req, res) => {
  const { newsId } = req.params;

  try {
    const feedbacks = await Feedback.find({ news: newsId });

    if (feedbacks.length === 0) {
      return res.json({ averageRating: 0, sentimentCount: { positive: 0, negative: 0, neutral: 0 }, totalFeedbacks: 0 });
    }

    const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / feedbacks.length;

    const sentimentCount = feedbacks.reduce((acc, f) => {
      acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    res.json({ averageRating: parseFloat(averageRating.toFixed(2)), sentimentCount, totalFeedbacks: feedbacks.length });
  } catch (error) {
    console.error('Error calculating feedback:', error);
    res.status(500).json({ message: 'Server error while calculating feedback.' });
  }
};

exports.updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    const feedback = await Feedback.findOne({ _id: id, user: req.user.id });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found or not authorized.' });
    }

    const sentimentResult = comment ? analyzeSentiment(comment) : 'neutral';
    feedback.rating = rating;
    feedback.comment = comment || '';
    feedback.sentiment = sentimentResult;
    await feedback.save();
    await feedback.populate('user', 'name');

    // Emit real-time event
    req.io.emit('feedbackUpdate', { newsId: feedback.news });

    res.json(feedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Server error while updating feedback.' });
  }
};

exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findOneAndDelete({ _id: id, user: req.user.id });
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found or not authorized.' });
    }

    // Emit real-time event
    req.io.emit('feedbackUpdate', { newsId: feedback.news });

    res.json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error while deleting feedback.' });
  }
};