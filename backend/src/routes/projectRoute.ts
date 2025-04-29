import express from 'express';
import * as ProjectController from '../controllers/project.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, isAdminAuth, ProjectController.getProjects);
router.get('/:id', authenticate, ProjectController.getProjectById);
router.post('/', authenticate, isAdminAuth, ProjectController.createProject);
router.put<{id: string}>('/:id', authenticate, isAdminAuth, ProjectController.updateProject);
router.delete('/:id', authenticate, isAdminAuth, ProjectController.deleteProject);

export default router;