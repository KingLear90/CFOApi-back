import express from 'express';
import * as CollaboratorController from '../controllers/collaborator.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { limiter } from '../utils/limiter';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(limiter)

router.get('/', authenticate, isAdminAuth, CollaboratorController.getCollaborators);
router.get('/:id', authenticate, CollaboratorController.getCollaboratorById);

//Mostrar todos los colaboradores de un proyecto
router.get('/project/:id', authenticate, CollaboratorController.getCollaboratorsByProjectId);

router.post('/', authenticate, isAdminAuth, CollaboratorController.createCollaborator);
router.put<{id: string}>('/:id', authenticate, isAdminAuth, CollaboratorController.updateCollaborator);
router.delete('/:id', authenticate, isAdminAuth, CollaboratorController.deleteCollaborator);

export default router;