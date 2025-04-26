import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import User from "../models/userModel";
import { FORBIDDEN } from "../constants/http";

const isAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
   try {
    const user = await User.findById(req.session.userId);
        if(!user) {
            throw createHttpError(FORBIDDEN, "User not authenticated");
        }
        if(user.isAdmin === false || user.isAdmin === undefined) {
            throw createHttpError(FORBIDDEN, "You are not authorized to access this resource");;
        }
   } catch(error) {
        next(error);
   }
   next();

}

export default isAdminAuth;