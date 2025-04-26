import express from 'express';
import * as TribeController from '../controllers/tribe.controller';
import isAdminAuth from '../middlewares/isAdminAuth';

const router = express.Router();

router.get('/', isAdminAuth, TribeController.getTribes);
router.get('/:id', TribeController.getTribeById);
router.post('/', isAdminAuth, TribeController.createTribe);
router.put<{id: string}>('/:id', isAdminAuth, TribeController.updateTribe);
router.delete('/:id', isAdminAuth, TribeController.deleteTribe);

export default router;