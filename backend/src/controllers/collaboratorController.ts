import { RequestHandler } from "express";
import CollaboratorModel from "../models/collaboratorModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import ProjectModel from "../models/projectModel";
import ProfileModel from "../models/profileModel";
import TribeModel from "../models/tribeModel";
import projectModel from "../models/projectModel";
import { BAD_REQUEST, NOT_FOUND, OK, CREATED } from "../constants/http";

export const getCollaborators: RequestHandler = async (req, res, next) => {
    try {
        const collaborators = await CollaboratorModel.find()
        .populate({
            path: 'profile_id',
            select: 'profile'
        })
        .populate({
            path: 'tribe_id',
            select: 'tribe'
        })
        .populate({
            path: 'project_id',
            select: 'project'
        });
        
        if (collaborators.length === 0) {
            res.status(OK).json({message: "No collaborators yet"});
        }
        res.status(OK).json(collaborators);
    } catch(error) {
        next(error);
    }
}

export const getCollaboratorById: RequestHandler = async (req, res, next) => {
    const collaboratorId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(collaboratorId)) {
            throw createHttpError(BAD_REQUEST, "Invalid collaborator ID");
        }

        const collaborator = await CollaboratorModel.findById(collaboratorId);

        if (!collaborator) {
            throw createHttpError(NOT_FOUND, "Collaborator not found");
        }

        res.status(OK).json({collaborator});
    } catch(error) {
        next(error);
    }
}

// Todos los colaboradores de un proyecto específico: 
export const getCollaboratorsByProjectId: RequestHandler = async (req, res, next) => {
    const projectId = req.params.id;
    try {
        if (!mongoose.isValidObjectId(projectId)) {
            throw createHttpError(BAD_REQUEST, "Invalid project ID");
        }

        const projects = await projectModel.findById(projectId).populate({
            path: 'collaborator_id', 
            select: 'name'})

        if (!projects) {
            throw createHttpError(NOT_FOUND, "No collaborators found for this project");
        }
        res.status(OK).json(projects);
    } catch(error) {
        next(error);
    }   
}

interface CreateCollaboratorBody {
    name: string;
    email: string;
    profile_id?: string;
    tribe_id?: string;
    project_id?: string;
}

export const createCollaborator: RequestHandler<unknown, unknown, CreateCollaboratorBody, unknown> = async (req, res, next) => {
    const { name, email, profile_id, tribe_id, project_id } = req.body;

    try {
        if (!name) {
            throw createHttpError(BAD_REQUEST, "Collaborator must have a name");
        }
        if (!email) {
            throw createHttpError(BAD_REQUEST, "Collaborator must have an email");
        }

        const newCollaborator = await CollaboratorModel.create({
            name,
            email,
            profile_id,
            tribe_id,
            project_id,
        });

        if (profile_id) {
            const profile = await ProfileModel.findById(profile_id);
            if (!profile) {
                throw createHttpError(NOT_FOUND, "Profile not found");
            }
            profile.collaborator_id.push(newCollaborator._id);
            await profile.save();
        }

        if (tribe_id) {
            const tribe = await TribeModel.findById(tribe_id);
            if (!tribe) {
                throw createHttpError(NOT_FOUND, "Tribe not found");
            }
            tribe.collaborator_id.push(newCollaborator._id);
            await tribe.save();
        }

        if (Array.isArray(project_id) && project_id.length > 0) {

            const projectsPromises = project_id.map(async (id) => {
                try {
                    const project = await ProjectModel.findById(id);
                    if (!project) {
                        throw createHttpError(NOT_FOUND, "Project not found");
                    }

                    project.collaborator_id.push(newCollaborator._id);

                    await project.save();
                    
                } catch (error) {
                    console.error(error)
                }
            });

           
            await Promise.all(projectsPromises);
        }

        res.status(CREATED).json({ message: "Collaborator successfully created", newCollaborator });
    } catch (error) {
        next(error);
    }
};

interface UpdateCollaboratorParams {
    id: string;
}

interface UpdateCollaboratorBody {
    name?: string;
    profile?: string;
    tribu?: string;
}

export const updateCollaborator: RequestHandler<UpdateCollaboratorParams, unknown, UpdateCollaboratorBody, unknown> = async (req, res, next) => {
    const collaboratorId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(collaboratorId)) {
            throw createHttpError(BAD_REQUEST, "Invalid collaborator ID");
        }
        
        const updatedCollaborator = await CollaboratorModel.findByIdAndUpdate(collaboratorId, req.body, {new: true});
        if (!updatedCollaborator) {
            throw createHttpError(NOT_FOUND, "Collaborator not found");
        }

        res.status(CREATED).json({message: 'Updated information', updatedCollaborator});
    } catch(error) {
        next(error);
    }
}

export const deleteCollaborator: RequestHandler = async (req, res, next) => {
    const collaboratorId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(collaboratorId)) {
            throw createHttpError(BAD_REQUEST, "Invalid collaborator ID");
        }
        const deletedCollaborator = await CollaboratorModel.findByIdAndDelete(collaboratorId);
        if (!deletedCollaborator) {
            throw createHttpError(NOT_FOUND, "Collaborator not found");
        }

        res.status(OK).json({message: 'Collaborator successfully deleted', deletedCollaborator});
    } catch(error) {
        next(error);
    }
}

