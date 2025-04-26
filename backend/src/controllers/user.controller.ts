import mongoose from "mongoose";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from 'bcrypt'
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http";
import { generateJWT } from "../utils/jwt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.session.userId;

    try {
        if (!authenticatedUser) {
            throw createHttpError(UNAUTHORIZED, "User not authenticated");
        }
        
        if(!mongoose.isValidObjectId(authenticatedUser)) {
            throw createHttpError(BAD_REQUEST, "Invalid user ID");
        }

        const user = await UserModel.findById(authenticatedUser).select("+email")

        res.status(OK).json(user);
    } catch (error) {
        next(error);
    }
}

interface createUserBody {
    collab_name: string | undefined;
    email: string | undefined;
    password: string | undefined;
    isAdmin: boolean | undefined;
}

export const createUser: RequestHandler<unknown, unknown, createUserBody, unknown> = async (req, res, next) => {
    const { collab_name, email, password, isAdmin } = req.body

    try {
        if(!collab_name || !email || !password) {
            throw createHttpError(BAD_REQUEST, "Complete all fields");
        }

        const existingEmail = await UserModel.findOne({email});
        if (existingEmail) {
            throw createHttpError(CONFLICT, "A user with this email already exists");
        }

        const passwordHasshed = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            collab_name,
            email,
            password: passwordHasshed,
            isAdmin
        })

        req.session.userId = newUser._id;

        res.status(CREATED).json({message: 'User successfully created', newUser})
    } catch(error) {
        next(error);
    }
}

export const getUsers: RequestHandler = async (req, res, next)  => {
    try {
        const users = await UserModel.find();

        if (users.length === 0) {
            res.status(OK).json({message: "No users yet"});
        }

        res.status(OK).json({users});
    } catch(error) {
        next(error);
    }
}

export const getUserById: RequestHandler = async (req, res, next) => {
    const userId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(BAD_REQUEST, "Invalid user ID");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw createHttpError(NOT_FOUND, "User not found");
        }   
        res.status(OK).json({message: "User found:", user});

    } catch(error) {
        next(error);
    }

}

interface UpdateUserParams {
    id: string;
}

interface UpdateUserBody {
    collab_name: string;
    email: string;
    password: string;
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async (req, res, next) => {
    const userId = req.params.id;
    const { collab_name, email, password } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
        throw createHttpError(BAD_REQUEST, "Invalid user ID");
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { collab_name, email, password }, {new: true});
        if (!updatedUser) {
            throw createHttpError(NOT_FOUND, "User not found");
        }
        res.status(CREATED).json({message: 'User successfully updated', updatedUser});
    } catch(error) {
        next(error);
    }
}

export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(BAD_REQUEST, "Invalid user ID");
        }
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw createHttpError(NOT_FOUND, "User not found");
        }
        res.status(OK).json({message: 'User succesfully deleted', deletedUser});
    } catch(error) {
        next(error);
    }   
}

interface loginBody {
    email?: string;
    password?: string;
}

export const loginUser: RequestHandler<unknown, unknown, loginBody, unknown> = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw createHttpError(BAD_REQUEST, "Complete all fields");
        }   

        const user = await UserModel.findOne({email}).select('+email +password');
        if (!user) {
            throw createHttpError(UNAUTHORIZED, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            throw createHttpError(UNAUTHORIZED, "Invalid credentials");
        }

        // JWT
        const token = generateJWT({id: user._id});

        // Sesión almacenada en la base de datos
        req.session.userId = user._id;

        res.status(OK).json({message: 'User successfully logged in', token});
    } catch (error) {
        next(error);
    }
}

export const logoutUser: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(OK);
        }
    })
}