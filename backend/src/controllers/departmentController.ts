import { RequestHandler } from "express";
import DepartmentModel from "../models/departmentModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getDepartments: RequestHandler = async (req, res, next)  => {
    try {
        const departments = await DepartmentModel.find();

        if (departments.length === 0) {
            res.status(200).json({message: "No departments yet"});
        }

        res.status(200).json({departments});
    } catch(error) {
        next(error);
    }
}

export const getDepartmentById: RequestHandler = async (req, res, next) => {
    const deparmentId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(deparmentId)) {
            throw createHttpError(400, "Invalid department ID");
        }

        const department = await DepartmentModel.findById(deparmentId);
        if (!department) {
            throw createHttpError(404, "Department not found");
        }   
        res.status(200).json({message: "Department found:", department});

    } catch(error) {
        next(error);
    }

}

interface CreateDepartmentBody {
    department: string;
}

export const createDepartment: RequestHandler<unknown, unknown, CreateDepartmentBody, unknown> = async (req, res, next) => {
    const { department } = req.body;

    try { 
        if (!department) {
            throw createHttpError(400, "Department is required");
        }

        const newDepartment = await DepartmentModel.create({
            department
        })
        
        res.status(201).json({message: 'Department successfully created', newDepartment});
    } catch(error) {
        next(error);
    }
}

interface UpdateDepartmentParams {
    id: string;
}

interface  UpdateDepartmentBody {
    department: string;
}

export const updateDepartment: RequestHandler<UpdateDepartmentParams, unknown, UpdateDepartmentBody, unknown > = async (req, res, next) => {
    const departmentId = req.params.id;
    const { department } = req.body;

    if (!mongoose.isValidObjectId(departmentId)) {
        throw createHttpError(400, "Invalid department ID");
    }

    try {
        const updatedDepartment = await DepartmentModel.findByIdAndUpdate(departmentId, { department }, {new: true});
        if (!updatedDepartment) {
            throw createHttpError(404, "Department not found");
        }
        res.status(201).json({message: 'Department successfully updated', updatedDepartment});
    } catch(error) {
        next(error);
    }
}

export const deleteDepartment: RequestHandler = async (req, res, next) => {
    const departmentId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(departmentId)) {
            throw createHttpError(400, "Invalid department ID");
        }
        const deletedDepartment= await DepartmentModel.findByIdAndDelete(departmentId);
        if (!deletedDepartment) {
            throw createHttpError(404, "Department not found");
        }
        res.status(200).json({message: 'Department succesfully deleted', deletedDepartment});
    } catch(error) {
        next(error);
    }   
}