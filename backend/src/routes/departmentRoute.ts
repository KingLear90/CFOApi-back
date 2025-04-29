import express from 'express';
import * as DepartmentController from '../controllers/department.controller';
import isAdminAuth from '../middlewares/isAdminAuth';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, DepartmentController.getDepartments);
router.get('/:id', authenticate, DepartmentController.getDepartmentById);
router.post('/', authenticate, isAdminAuth, DepartmentController.createDepartment);
router.put<{id: string}>('/:id', authenticate, isAdminAuth, DepartmentController.updateDepartment);
router.delete('/:id', authenticate, isAdminAuth, DepartmentController.deleteDepartment);

export default router;