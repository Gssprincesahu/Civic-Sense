import express from 'express';
import { Signup, googleSignup } from '../controller/user.controller.js';
const router = express.Router();

router.post('/signup', Signup);
router.post('/google-signup', googleSignup);

export default router;