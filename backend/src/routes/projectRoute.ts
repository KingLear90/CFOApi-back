import express from 'express';
import * as ProjectController from '../controllers/project.controller';
import isAdminAuth from '../middlewares/isAdminAuth';

const router = express.Router();

router.get('/', isAdminAuth, ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', isAdminAuth, ProjectController.createProject);
router.put<{id: string}>('/:id', isAdminAuth, ProjectController.updateProject);
router.delete('/:id', isAdminAuth, ProjectController.deleteProject);

export default router;