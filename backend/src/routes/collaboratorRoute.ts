import express from 'express';
import * as CollaboratorController from '../controllers/collaboratorController';

const router = express.Router();

router.get('/', CollaboratorController.getCollaborators);
router.get('/:id', CollaboratorController.getCollaboratorById);
router.get('/project/:id', CollaboratorController.getCollaboratorsByProjectId);
router.post('/', CollaboratorController.createCollaborator);
router.put('/:id', CollaboratorController.updateCollaborator);
router.delete('/:id', CollaboratorController.deleteCollaborator);

export default router;