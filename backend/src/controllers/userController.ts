import mongoose from "mongoose";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from 'bcrypt'

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.session.userId;

    try {
        if (!authenticatedUser) {
            throw createHttpError(401, "User not authenticated");
        }
        
        if(!mongoose.isValidObjectId(authenticatedUser)) {
            throw createHttpError(400, "Invalid user ID");
        }

        const user = await UserModel.findById(authenticatedUser).select("+email")

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface createUserBody {
    collab_name: string | undefined;
    email: string | undefined;
    passwordRaw: string | undefined;
}

export const createUser: RequestHandler<unknown, unknown, createUserBody, unknown> = async (req, res, next) => {
    const { collab_name, email, passwordRaw } = req.body

    try {
        if(!collab_name || !email || !passwordRaw) {
            throw createHttpError(400, "Complete all fields");
        }

        const existingEmail = await UserModel.findOne({email});
        if (existingEmail) {
            throw createHttpError(409, "A user with this email already exists");
        }

        const passwordHasshed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            collab_name: collab_name,
            email: email,
            password: passwordHasshed
        })

        req.session.userId = newUser._id;

        res.status(201).json({message: 'User successfully created', newUser})
    } catch(error) {
        next(error);
    }
}

export const getUsers: RequestHandler = async (req, res, next)  => {
    try {
        const users = await UserModel.find();

        if (users.length === 0) {
            res.status(200).json({message: "No users yet"});
        }

        res.status(200).json({users});
    } catch(error) {
        next(error);
    }
}

export const getUserById: RequestHandler = async (req, res, next) => {
    const userId = req.params.id;
    console.log("Received userId:", userId, "Type:", typeof userId);
    console.log("Is valid ObjectId:", mongoose.isValidObjectId(userId)); 

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user ID");
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw createHttpError(404, "User not found");
        }   
        res.status(200).json({message: "User found:", user});

    } catch(error) {
        next(error);
    }

}

interface UpdateUserParams {
    id: string;
}

interface UpdateUserBody {
    email: string;
    password: string;
}

export const updateUser: RequestHandler<UpdateUserParams, unknown, UpdateUserBody, unknown> = async (req, res, next) => {
    const userId = req.params.id;
    const { email, password } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
        throw createHttpError(400, "Invalid user ID");
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { email, password }, {new: true});
        if (!updatedUser) {
            throw createHttpError(404, "User not found");
        }
        res.status(201).json({message: 'User successfully updated', updatedUser});
    } catch(error) {
        next(error);
    }
}

export const deleteUser: RequestHandler = async (req, res, next) => {
    const userId = req.params.id;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user ID");
        }
        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw createHttpError(404, "User not found");
        }
        res.status(200).json({message: 'User succesfully deleted', deletedUser});
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
            throw createHttpError(400, "Complete all fields");
        }   

        const user = await UserModel.findOne({email}).select('+email +password');
        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(200).json({message: 'User successfully logged in', user});
    } catch (error) {
        next(error);
    }
}

export const logoutUser: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    })
}