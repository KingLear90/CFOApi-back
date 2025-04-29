import express from 'express';
import * as ClientController from '../controllers/client.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { limiter } from '../utils/limiter';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.use(limiter)

router.get('/', authenticate, isAdminAuth, ClientController.getClients);
router.get('/:id', authenticate, ClientController.getClientById);
router.post('/', authenticate, isAdminAuth, ClientController.createClient);
router.put<{id: string}>('/:id', authenticate, isAdminAuth, ClientController.updateClient);
router.delete('/:id', authenticate, isAdminAuth, ClientController.deleteClient);

export default router;