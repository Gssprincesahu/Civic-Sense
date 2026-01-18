import express from 'express';
import { Login, Signup, googleSignup, Logout, verifyToken } from '../controller/user.controller.js';
const router = express.Router();

router.post('/signup', Signup);
router.post('/google-signup', googleSignup);
router.post('/Login', Login);
router.post('/logout', Logout);
router.get('/verify', verifyToken);

export default router;