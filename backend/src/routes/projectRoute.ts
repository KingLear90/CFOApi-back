import express from 'express';
import * as ProjectController from '../controllers/project.controller';

const router = express.Router();

router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.post('/', ProjectController.createProject);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;