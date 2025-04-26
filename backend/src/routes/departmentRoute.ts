import express from 'express';
import * as DepartmentController from '../controllers/department.controller';
import isAdminAuth from '../middlewares/isAdminAuth';

const router = express.Router();

router.get('/', DepartmentController.getDepartments);
router.get('/:id', DepartmentController.getDepartmentById);
router.post('/', isAdminAuth, DepartmentController.createDepartment);
router.put<{id: string}>('/:id', isAdminAuth, DepartmentController.updateDepartment);
router.delete('/:id', isAdminAuth, DepartmentController.deleteDepartment);

export default router;