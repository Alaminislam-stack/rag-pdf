import express from 'express';
import { createCollection, getCollections, getPdf, uploadController } from '../controllers/uploadController.js';
import { chatController } from '../controllers/chatController.js';
import { verifyUser } from '../middlewares/auth.meddleware.js';
import { upload } from '../middlewares/multer.meddleware.js';

const router = express.Router();

router.post('/upload', verifyUser, upload.single('file'), uploadController);
router.post('/chat', verifyUser, chatController);
router.get('/get-pdf', verifyUser, getPdf);
router.post('/create-collection', verifyUser, createCollection)
router.get('/get-collections', verifyUser, getCollections)

export default router;
