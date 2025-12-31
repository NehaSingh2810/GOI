const express = require('express');
const { submitFeedback, getFeedbacks, getAllFeedbacks, calculateFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, submitFeedback);
router.get('/user', auth, getAllFeedbacks);
router.get('/:newsId', getFeedbacks);
router.get('/:newsId/calculate', calculateFeedback);
router.put('/:id', auth, updateFeedback);
router.delete('/:id', auth, deleteFeedback);

module.exports = router;