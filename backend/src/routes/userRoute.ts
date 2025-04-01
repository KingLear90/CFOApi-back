import express from 'express';
import * as UserController from '../controllers/userController';

const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/auth', UserController.getAuthenticatedUser);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;