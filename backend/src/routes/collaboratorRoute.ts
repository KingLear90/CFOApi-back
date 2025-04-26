import express from 'express';
import * as CollaboratorController from '../controllers/collaborator.controller';
import isAdminAuth from '../middlewares/isAdminAuth';

const router = express.Router();

router.get('/', isAdminAuth, CollaboratorController.getCollaborators);
router.get('/:id', CollaboratorController.getCollaboratorById);

//Mostrar todos los colaboradores de un proyecto
router.get('/project/:id', CollaboratorController.getCollaboratorsByProjectId);

router.post('/', isAdminAuth, CollaboratorController.createCollaborator);
router.put<{id: string}>('/:id', isAdminAuth, CollaboratorController.updateCollaborator);
router.delete('/:id', isAdminAuth, CollaboratorController.deleteCollaborator);

export default router;