const express = require('express');
const { getNews, createNews, getNewsById, fetchAndSaveNews } = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);
router.post('/', auth, createNews);
router.post('/fetch', fetchAndSaveNews); // Public route to fetch news

module.exports = router;