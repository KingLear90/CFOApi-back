import { RequestHandler } from "express";
import ProjectModel from "../models/projectModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getProjects: RequestHandler = async (req, res, next)  => {
    try {
        const projects = await ProjectModel.find().populate({
            path: 'tribe_id',
            select: 'tribe'
        })
        .populate({
            path: 'collaborator_id',
            select: 'name email'
        });

        if (projects.length === 0) {
            res.status(200).json({message: "No projects yet"});
        }

        res.status(200).json(projects);
    } catch(error) {
        next(error);
    }
}

export const getProjectById: RequestHandler = async (req, res, next) => {
    const projectId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project ID");
        }

        const project = await ProjectModel.findById(projectId).populate(
            {
                path: 'collaborator_id',
                select: 'name'
            }
        );
        if (!project) {
            throw createHttpError(404, "Project not found");
        }   
        res.status(200).json({message: "Project found:", project});

    } catch(error) {
        next(error);
    }

}

interface CreateProjectBody {
    project: string;
    tribe_id?: string;
}

export const createProject: RequestHandler<unknown, unknown, CreateProjectBody, unknown> = async (req, res, next) => {
    const { project, tribe_id } = req.body;

    try { 
        if (!project) {
            throw createHttpError(400, "Project is required");
        }

        const newProject = await ProjectModel.create({
            project,
            tribe_id
        })
        
        res.status(201).json({message: 'Profile successfully created', newProject});
    } catch(error) {
        next(error);
    }
}

interface UpdateProjectParams {
    id: string;
}

interface  UpdateProjectBody {
    project: string;
    tribe_id?: string;
}

export const updateProject: RequestHandler<UpdateProjectParams, unknown, UpdateProjectBody, unknown > = async (req, res, next) => {
    const projectId = req.params.id;
    const { project, tribe_id } = req.body;

    if (!mongoose.isValidObjectId(projectId)) {
        throw createHttpError(400, "Invalid project ID");
    }

    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, { project, tribe_id }, {new: true});
        if (!updatedProject) {
            throw createHttpError(404, "Project not found");
        }
        res.status(201).json({message: 'Project successfully updated', updatedProject});
    } catch(error) {
        next(error);
    }
}

export const deleteProject: RequestHandler = async (req, res, next) => {
    const projectId = req.params.id;
    try {
        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(400, "Invalid project ID");
        }
        const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
        if (!deletedProject) {
            throw createHttpError(404, "Project not found");
        }
        res.status(200).json({message: 'Project succesfully deleted', deletedProject});
    } catch(error) {
        next(error);
    }   
}