import express from 'express';
import * as DepartmentController from '../controllers/department.controller';

const router = express.Router();

router.get('/', DepartmentController.getDepartments);
router.get('/:id', DepartmentController.getDepartmentById);
router.post('/', DepartmentController.createDepartment);
router.put('/:id', DepartmentController.updateDepartment);
router.delete('/:id', DepartmentController.deleteDepartment);

export default router;