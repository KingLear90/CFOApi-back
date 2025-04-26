import express from 'express';
import * as UserController from '../controllers/user.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { limiter } from '../utils/limiter';

const router = express.Router();

router.get('/', isAdminAuth, UserController.getUsers);
router.get('/auth', UserController.getAuthenticatedUser);
router.get('/:id', UserController.getUserById);
router.post('/', isAdminAuth, UserController.createUser);
router.post('/login', limiter, UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.put<{id: string}>('/:id', isAdminAuth, UserController.updateUser);  // <{id: string}> debe ser especificado porque el id está tipado en el controller.
router.delete('/:id', isAdminAuth, UserController.deleteUser);

export default router;