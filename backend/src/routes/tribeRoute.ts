import express from 'express';
import * as TribeController from '../controllers/tribe.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, isAdminAuth, TribeController.getTribes);
router.get('/:id', authenticate, TribeController.getTribeById);
router.post('/', authenticate, isAdminAuth, TribeController.createTribe);
router.put<{id: string}>('/:id', authenticate, isAdminAuth, TribeController.updateTribe);
router.delete('/:id', authenticate, isAdminAuth, TribeController.deleteTribe);

export default router;