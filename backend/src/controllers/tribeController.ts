import { RequestHandler } from "express";
import TribeModel from "../models/tribeModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getTribes: RequestHandler = async (req, res, next)  => {
    try {
        const tribes = await TribeModel.find().populate({
            path: 'collaborator_id',
            select: 'name'
        });

        if (tribes.length === 0) {
            res.status(200).json({message: "No tribes yet"});
        }

        res.status(200).json({tribes});
    } catch(error) {
        next(error);
    }
}

export const getTribeById: RequestHandler = async (req, res, next) => {
    const tribeId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(tribeId)) {
            throw createHttpError(400, "Invalid tribe ID");
        }

        const tribe = await TribeModel.findById(tribeId);
        if (!tribe) {
            throw createHttpError(404, "Tribe not found");
        }   
        res.status(200).json({message: "Tribe found:", tribe});

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
            throw createHttpError(400, "Tribe is required");
        }

        const newTribe = await TribeModel.create({
            tribe,
            collaborator_id
        })
        
        res.status(201).json({message: 'Tribe successfully created', newTribe});
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
        throw createHttpError(400, "Invalid tribe ID");
    }

    try {
        const updatedTribe = await TribeModel.findByIdAndUpdate(tribeId, { tribe }, {new: true});
        if (!updatedTribe) {
            throw createHttpError(404, "Tribe not found");
        }
        res.status(201).json({message: 'Tribe successfully updated', updatedTribe});
    } catch(error) {
        next(error);
    }
}

export const deleteTribe: RequestHandler = async (req, res, next) => {
    const tribeId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(tribeId)) {
            throw createHttpError(400, "Invalid tribe ID");
        }
        const deletedTribe = await TribeModel.findByIdAndDelete(tribeId);
        if (!deletedTribe) {
            throw createHttpError(404, "Tribe not found");
        }
        res.status(200).json({message: 'Tribe succesfully deleted', deletedTribe});
    } catch(error) {
        next(error);
    }   
}