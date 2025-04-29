import express from 'express';
import * as UserController from '../controllers/user.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { limiter } from '../utils/limiter';
import { authenticate } from '../middlewares/auth';
import { validateUserInput } from '../middlewares/user';

const router = express.Router();


router.get('/', limiter, authenticate, isAdminAuth, UserController.getUsers);
router.get('/auth', limiter, authenticate, UserController.getAuthenticatedUser);
router.get('/:id', UserController.getUserById);
router.post('/', authenticate, isAdminAuth, validateUserInput, UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.put<{id: string}>('/:id', limiter, authenticate, isAdminAuth, UserController.updateUser);  // <{id: string}> debe ser especificado porque el id está tipado en el controller.
router.delete('/:id', authenticate, isAdminAuth, UserController.deleteUser);    

export default router;