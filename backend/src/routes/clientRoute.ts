import express from 'express';
import * as ClientController from '../controllers/client.controller';

const router = express.Router();

router.get('/', ClientController.getClients);
router.get('/:id', ClientController.getClientById);
router.post('/', ClientController.createClient);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

export default router;