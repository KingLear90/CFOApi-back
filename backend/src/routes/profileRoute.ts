import express from 'express';
import * as ProfileController from '../controllers/profileController';

const router = express.Router();

router.get('/', ProfileController.getProfiles);
router.get('/:id', ProfileController.getProfileById);
router.post('/', ProfileController.createProfile);
router.put('/:id', ProfileController.updateProfile);
router.delete('/:id', ProfileController.deleteProfile);

export default router;