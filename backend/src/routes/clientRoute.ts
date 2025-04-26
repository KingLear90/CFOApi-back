import express from 'express';
import * as ClientController from '../controllers/client.controller';
import isAdminAuth from '../middlewares/isAdminAuth';

const router = express.Router();

router.get('/', isAdminAuth, ClientController.getClients);
router.get('/:id', ClientController.getClientById);
router.post('/', isAdminAuth, ClientController.createClient);
router.put<{id: string}>('/:id', isAdminAuth, ClientController.updateClient);
router.delete('/:id', isAdminAuth, ClientController.deleteClient);

export default router;