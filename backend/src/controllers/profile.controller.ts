import { RequestHandler } from "express";
import ProfileModel from "../models/profileModel";
import CollaboratorModel from "../models/collaboratorModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { BAD_REQUEST, CREATED, CONFLICT, NOT_FOUND, OK } from "../constants/http";

export const getProfiles: RequestHandler = async (req, res, next)  => {
    try {
        const profiles = await ProfileModel.find().populate({
            path: 'collaborator_id',
            select: 'name'
        });

        if (profiles.length === 0) {
            res.status(OK).json({message: "No profiles yet"});
        }

        res.status(OK).json({profiles});
    } catch(error) {
        next(error);
    }
}

export const getProfileById: RequestHandler = async (req, res, next) => {
    const profileId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(profileId)) {
            throw createHttpError(BAD_REQUEST, "Invalid profile ID");
        }

        const profile = await ProfileModel.findById(profileId);
        if (!profile) {
            throw createHttpError(NOT_FOUND, "Profile not found");
        }   
        res.status(OK).json({message: "Profile found:", profile});

    } catch(error) {
        next(error);
    }

}

interface CreateProfileBody {
    profile: string;
    collaborator_id?: string;
}

export const createProfile: RequestHandler<unknown, unknown, CreateProfileBody, unknown> = async (req, res, next) => {
    const { profile, collaborator_id } = req.body;


    try { 
        if (!profile) {
            throw createHttpError(BAD_REQUEST, "Profile is required");
        }

        const profileExists = await ProfileModel.findOne({profile})

        if(profileExists) {
            throw createHttpError(CONFLICT, "Profile already exists")
        }

        const newProfile = await ProfileModel.create({
            profile
        })

        if (Array.isArray(collaborator_id) && collaborator_id.length > 0) {
        
            const collaboratorsPromises = collaborator_id.map(async (id) => {
                const collaborator = await CollaboratorModel.findById(id);
                if (!collaborator) {
                    throw createHttpError(NOT_FOUND, "Collaborator not found");
                }

            [collaborator.profile_id].push(newProfile._id);
        
                await collaborator.save();
            });
                   
            await Promise.all(collaboratorsPromises);
        }
        
        res.status(CREATED).json({message: 'Profile successfully created', newProfile});
    } catch(error) {
        next(error);
    }
}

interface UpdateProfileParams {
    id: string;
}

interface  UpdateProfileBody {
    profile: string;
}

export const updateProfile: RequestHandler<UpdateProfileParams, unknown, UpdateProfileBody, unknown > = async (req, res, next) => {
    const profileId = req.params.id;
    const { profile } = req.body;

    if (!mongoose.isValidObjectId(profileId)) {
        throw createHttpError(BAD_REQUEST, "Invalid profile ID");
    }

    try {
        const updatedProfile = await ProfileModel.findByIdAndUpdate(profileId, { profile }, {new: true});
        if (!updatedProfile) {
            throw createHttpError(NOT_FOUND, "Profile not found");
        }
        res.status(CREATED).json({message: 'Profile successfully updated', updatedProfile});
    } catch(error) {
        next(error);
    }
}

export const deleteProfile: RequestHandler = async (req, res, next) => {
    const profileId = req.params.id;
    try {
        if (!mongoose.isValidObjectId(profileId)) {
            throw createHttpError(BAD_REQUEST, "Invalid profile ID");
        }
        const deletedProfile = await ProfileModel.findByIdAndDelete(profileId);
        if (!deletedProfile) {
            throw createHttpError(NOT_FOUND, "Profile not found");
        }

        const profileNotAssigned =  await CollaboratorModel.find({profile_id: profileId});
        if (profileNotAssigned === null ) {
            CollaboratorModel.updateMany({profile_id: profileId}, {profile_id: null}, {new: true});
        }

        res.status(OK).json({message: 'Profile succesfully deleted', deletedProfile});
    } catch(error) {
        next(error);
    }   
}
