import { Request, Response, NextFunction } from 'express';
import { isHttpError } from 'http-errors';

// La siguiente línea es para evitar el error de eslint que dice que no se está utilizando el parámetro next.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction ) => {      
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    };

    console.error(`[${statusCode}] ${errorMessage}`, error)
    
    res.status(statusCode).json({ message: errorMessage }); 
}