import { RequestHandler } from "express";
import ClientModel from "../models/clientModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getClients: RequestHandler = async (req, res, next) => {
    try {
        const clients = await ClientModel.find().populate({
            path: 'project_id',
            select: 'project'
        });
        if (clients.length === 0) {
            res.status(200).json({message: "No clients yet"});
        }
        res.status(200).json(clients);
    } catch(error) {
        next(error);
    }
}

export const getClientById: RequestHandler = async (req, res, next) => {
    const clientId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(clientId)) {
            throw createHttpError(400, "Invalid client ID");
        }

        const client = await ClientModel.findById(clientId);

        if (!client) {
            throw createHttpError(404, "Client not found");
        }

        res.status(200).json({client});
    } catch(error) {
        next(error);
    }
}

interface CreateClientBody {
    client: string;
    project_id?: string;
    sector_id?: string;

}

export const createClient: RequestHandler<unknown, unknown, CreateClientBody, unknown> = async (req, res, next) => {
    const { client, project_id, sector_id } = req.body;

    try {
        if (!client) {
            throw createHttpError(400, "Client is required");
        }

        const newClient = await ClientModel.create({
            client,
            project_id,
            sector_id
        });

        if(Array.isArray(project_id) && project_id.length > 0) {
            await ClientModel.updateMany(
                { _id: { $in: project_id } },
                { $push: { client: newClient._id } }
            );
        }

        res.status(201).json({message: 'Client successfully created', newClient});  
    } catch(error) {
        next(error);    
    }
}

interface UpdateClientParams {
    id: string;
}

interface UpdateClientBody {
    client: string;
    project_id?: string;
    sector_id?: string;
}

export const updateClient: RequestHandler<UpdateClientParams, unknown, UpdateClientBody, unknown> = async (req, res, next) => {
    const clientId = req.params.id;
    const { client, project_id, sector_id } = req.body;  

    try {
        if (!mongoose.isValidObjectId(clientId)) {
            throw createHttpError(400, "Invalid client ID");
        }
        
        const updatedClient = await ClientModel.findByIdAndUpdate(clientId, { client, project_id, sector_id }, {new: true});
        if (!updatedClient) {
            throw createHttpError(404, "Client not found");
        }

        res.status(201).json({message: 'Updated information', updatedClient});
    } catch(error) {
        next(error);
    }
}

export const deleteClient: RequestHandler = async (req, res, next) => {
    const clientId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(clientId)) {
            throw createHttpError(400, "Invalid client ID");
        }
        const deletedClient = await ClientModel.findByIdAndDelete(clientId);
        if (!deletedClient) {
            throw createHttpError(404, "Client not found");
        }

        res.status(200).json({message: 'Client successfully deleted', deleteClient});
    } catch(error) {
        next(error);
    }
}