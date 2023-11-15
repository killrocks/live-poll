const express = require('express');
const router = express.Router();
const UserController = require('./controllers/users');

router.get('/', UserController.index);
router.get('/teacher', UserController.create_poll);
router.get('/student/:id', UserController.student_answer);
router.post('/teacher_results', UserController.teacher_results);
router.post('/student_results', UserController.student_results);

module.exports = router;