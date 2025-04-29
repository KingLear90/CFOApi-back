import express from 'express';
import * as ProfileController from '../controllers/profile.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, ProfileController.getProfiles);
router.get('/:id', authenticate, ProfileController.getProfileById);
router.post('/', authenticate, isAdminAuth, ProfileController.createProfile);
router.put<{id: string}>('/:id', authenticate, isAdminAuth, ProfileController.updateProfile);
router.delete('/:id', authenticate, isAdminAuth, ProfileController.deleteProfile);

export default router;