// Todos los midddlewares relacionados a la autenticación

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if(!bearer) {
      const error = new Error("Unauthorized");
      res.status(401).json({ error: error.message });
      return;
    }

    const token = bearer.split(' ')[1];

    if(!token) {
      const error = new Error("Token not found");
      res.status(401).json({ error: error.message });
      return;
    } 

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      if(typeof decoded === 'object' && decoded.id) {
        req.user = await User.findById(decoded.id).select('+email -__v');
        next()
      }
    } catch (error) {
        next(error);
    }
}