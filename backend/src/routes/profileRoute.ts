import express from 'express';
import * as ProfileController from '../controllers/profile.controller';
import isAdminAuth from '../middlewares/isAdminAuth';

const router = express.Router();

router.get('/', ProfileController.getProfiles);
router.get('/:id', ProfileController.getProfileById);
router.post('/', isAdminAuth, ProfileController.createProfile);
router.put<{id: string}>('/:id', isAdminAuth, ProfileController.updateProfile);
router.delete('/:id', isAdminAuth, ProfileController.deleteProfile);

export default router;