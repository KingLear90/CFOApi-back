import { RequestHandler } from "express";
import DepartmentModel from "../models/departmentModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { BAD_REQUEST, OK, NOT_FOUND, CREATED } from "../constants/http";

export const getDepartments: RequestHandler = async (req, res, next)  => {
    try {
        const departments = await DepartmentModel.find();

        if (departments.length === 0) {
            res.status(OK).json({message: "No departments yet"});
        }

        res.status(OK).json({departments});
    } catch(error) {
        next(error);
    }
}

export const getDepartmentById: RequestHandler = async (req, res, next) => {
    const deparmentId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(deparmentId)) {
            throw createHttpError(BAD_REQUEST, "Invalid department ID");
        }

        const department = await DepartmentModel.findById(deparmentId);
        if (!department) {
            throw createHttpError(NOT_FOUND, "Department not found");
        }   
        res.status(OK).json({message: "Department found:", department});

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
            throw createHttpError(BAD_REQUEST, "Department is required");
        }

        const newDepartment = await DepartmentModel.create({
            department
        })
        
        res.status(CREATED).json({message: 'Department successfully created', newDepartment});
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
        throw createHttpError(BAD_REQUEST, "Invalid department ID");
    }

    try {
        const updatedDepartment = await DepartmentModel.findByIdAndUpdate(departmentId, { department }, {new: true});
        if (!updatedDepartment) {
            throw createHttpError(NOT_FOUND, "Department not found");
        }
        res.status(CREATED).json({message: 'Department successfully updated', updatedDepartment});
    } catch(error) {
        next(error);
    }
}

export const deleteDepartment: RequestHandler = async (req, res, next) => {
    const departmentId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(departmentId)) {
            throw createHttpError(BAD_REQUEST, "Invalid department ID");
        }
        const deletedDepartment= await DepartmentModel.findByIdAndDelete(departmentId);
        if (!deletedDepartment) {
            throw createHttpError(NOT_FOUND, "Department not found");
        }
        res.status(OK).json({message: 'Department succesfully deleted', deletedDepartment});
    } catch(error) {
        next(error);
    }   
}