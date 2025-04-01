import { RequestHandler } from "express";
import ProfileModel from "../models/profileModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getProfiles: RequestHandler = async (req, res, next)  => {
    try {
        const profiles = await ProfileModel.find().populate({
            path: 'collaborator_id',
            select: 'name'
        });

        if (profiles.length === 0) {
            res.status(200).json({message: "No profiles yet"});
        }

        res.status(200).json({profiles});
    } catch(error) {
        next(error);
    }
}

export const getProfileById: RequestHandler = async (req, res, next) => {
    const profileId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(profileId)) {
            throw createHttpError(400, "Invalid profile ID");
        }

        const profile = await ProfileModel.findById(profileId);
        if (!profile) {
            throw createHttpError(404, "Profile not found");
        }   
        res.status(200).json({message: "Profile found:", profile});

    } catch(error) {
        next(error);
    }

}

interface CreateProfileBody {
    profile: string;
}

export const createProfile: RequestHandler<unknown, unknown, CreateProfileBody, unknown> = async (req, res, next) => {
    const { profile } = req.body;

    try { 
        if (!profile) {
            throw createHttpError(400, "Profile is required");
        }

        const newProfile = await ProfileModel.create({
            profile
        })
        
        res.status(201).json({message: 'Profile successfully created', newProfile});
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
        throw createHttpError(400, "Invalid profile ID");
    }

    try {
        const updatedProfile = await ProfileModel.findByIdAndUpdate(profileId, { profile }, {new: true});
        if (!updatedProfile) {
            throw createHttpError(404, "Profile not found");
        }
        res.status(201).json({message: 'Profile successfully updated', updatedProfile});
    } catch(error) {
        next(error);
    }
}

export const deleteProfile: RequestHandler = async (req, res, next) => {
    const profileId = req.params.id;
    try {
        if (!mongoose.isValidObjectId(profileId)) {
            throw createHttpError(400, "Invalid profile ID");
        }
        const deletedProfile = await ProfileModel.findByIdAndDelete(profileId);
        if (!deletedProfile) {
            throw createHttpError(404, "Profile not found");
        }
        res.status(200).json({message: 'Profile succesfully deleted', deletedProfile});
    } catch(error) {
        next(error);
    }   
}
