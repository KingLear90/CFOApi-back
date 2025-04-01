import express from 'express';
import * as TribeController from '../controllers/tribeController';

const router = express.Router();

router.get('/', TribeController.getTribes);
router.get('/:id', TribeController.getTribeById);
router.post('/', TribeController.createTribe);
router.put('/:id', TribeController.updateTribe);
router.delete('/:id', TribeController.deleteTribe);

export default router;