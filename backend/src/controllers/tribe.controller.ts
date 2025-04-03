import { RequestHandler } from "express";
import TribeModel from "../models/tribeModel";
import CollaboratorModel from "../models/collaboratorModel"
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/http";

export const getTribes: RequestHandler = async (req, res, next)  => {
    try {
        const tribes = await TribeModel.find().populate({
            path: 'collaborator_id',
            select: 'name'
        });

        if (tribes.length === 0) {
            res.status(OK).json({message: "No tribes yet"});
        }

        res.status(OK).json({tribes});
    } catch(error) {
        next(error);
    }
}

export const getTribeById: RequestHandler = async (req, res, next) => {
    const tribeId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(tribeId)) {
            throw createHttpError(BAD_REQUEST, "Invalid tribe ID");
        }

        const tribe = await TribeModel.findById(tribeId);
        if (!tribe) {
            throw createHttpError(NOT_FOUND, "Tribe not found");
        }   
        res.status(OK).json({message: "Tribe found:", tribe});

    } catch(error) {
        next(error);
    }

}

interface CreateTribeBody {
    tribe: string;
    collaborator_id?: string;
}

export const createTribe: RequestHandler<unknown, unknown, CreateTribeBody, unknown> = async (req, res, next) => {
    const { tribe, collaborator_id } = req.body;

    try { 
        if (!tribe) {
            throw createHttpError(BAD_REQUEST, "Tribe is required");
        }

        const newTribe = await TribeModel.create({
            tribe,
            collaborator_id
        })
        
        res.status(CREATED).json({message: 'Tribe successfully created', newTribe});
    } catch(error) {
        next(error);
    }
}

interface UpdateTribeParams {
    id: string;
}

interface  UpdateTribeBody {
    tribe: string;
}

export const updateTribe: RequestHandler<UpdateTribeParams, unknown, UpdateTribeBody, unknown> = async (req, res, next) => {
    const tribeId = req.params.id;
    const { tribe } = req.body;

    if (!mongoose.isValidObjectId(tribeId)) {
        throw createHttpError(BAD_REQUEST, "Invalid tribe ID");
    }

    try {
        const updatedTribe = await TribeModel.findByIdAndUpdate(tribeId, { tribe }, {new: true});
        if (!updatedTribe) {
            throw createHttpError(NOT_FOUND, "Tribe not found");
        }
        res.status(CREATED).json({message: 'Tribe successfully updated', updatedTribe});
    } catch(error) {
        next(error);
    }
}

export const deleteTribe: RequestHandler = async (req, res, next) => {
    const tribeId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(tribeId)) {
            throw createHttpError(BAD_REQUEST, "Invalid tribe ID");
        }
        const deletedTribe = await TribeModel.findByIdAndDelete(tribeId);
        if (!deletedTribe) {
            throw createHttpError(NOT_FOUND, "Tribe not found");
        }

        await CollaboratorModel.updateMany(
            { tribe_id: tribeId },
            { $pull: { tribe_id : tribeId } }
        );

        res.status(OK).json({message: 'Tribe succesfully deleted', deletedTribe});
    } catch(error) {
        next(error);
    }   
}