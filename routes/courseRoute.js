const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.route('/').post(courseController.createCourse); // http://localhost:3000/courses
router.route('/').get(courseController.getAllCourses);
router.route('/:id').get(courseController.getSingleCourse);

module.exports = router;
