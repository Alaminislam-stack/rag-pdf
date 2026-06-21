import express from 'express';
import { createCollection, deletePdf, getCollections, getPdf, uploadController, deleteCollection } from '../controllers/uploadController.js';
import { chatController } from '../controllers/chatController.js';
import { verifyUser } from '../middlewares/auth.meddleware.js';
import { upload } from '../middlewares/multer.meddleware.js';

const router = express.Router();

router.post('/upload', verifyUser, upload.single('file'), uploadController);
router.post('/chat', verifyUser, chatController);
router.get('/get-pdf', verifyUser, getPdf);
router.post('/create-collection', verifyUser, createCollection)
router.get('/get-collections', verifyUser, getCollections)
router.delete('/delete-pdf/:pdfId', verifyUser, deletePdf)
router.delete('/delete-collection/:collectionId', verifyUser, deleteCollection)

export default router;
