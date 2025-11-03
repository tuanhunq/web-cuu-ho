import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/userController.js';
import { auth } from '../utils/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;