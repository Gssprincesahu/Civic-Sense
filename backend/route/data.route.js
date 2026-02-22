import express from 'express';
import { 
    createIssue, 
    getAllIssues, 
    getIssueById, 
    updateIssue, 
    deleteIssue 
} from '../controller/data.controller.js';

import {upload} from '../config/cloudinary.js';

const router = express.Router();

router.post('/create', upload.single('image'), createIssue);
router.get('/', getAllIssues);
router.get('/:id', getIssueById);
router.put('/:id', updateIssue);
router.delete('/:id', deleteIssue);

export default router;