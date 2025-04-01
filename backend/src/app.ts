import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import clientRoutes from './routes/clientRoute';
import collaboratorRoutes from './routes/collaboratorRoute';
import profileRoutes from './routes/profileRoute';
import projectRoutes from './routes/projectRoute';
import departmentRoutes from './routes/departmentRoute';
import tribeRoutes from './routes/tribeRoute';
import userRoutes from './routes/userRoute';
import createHttpError, { isHttpError } from 'http-errors';
import cors from 'cors';
import session from 'express-session';
import env from './util/validateEnv'
import MongoStore from 'connect-mongo';

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
));

app.use(express.json());

app.use(session({
    secret: env.SECRET,
    resave: false, // Guardar la sesión ante cada solicitud
    saveUninitialized: false, 
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hora    
    },
    rolling: true, // Se actualiza el tiempo de expiración de la cookie con cada solicitud
    store: MongoStore.create({
        mongoUrl: env.MONGODB_URI
    })
}));

app.use('/api/clients', clientRoutes);
app.use('/api/collaborators', collaboratorRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/tribes', tribeRoutes);
app.use('/api/users', userRoutes);


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(createHttpError(404, 'Endpoint not found'));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {      //Middleware que maneja errores.
    console.error(error);
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    };
    console.log(`${statusCode}: ${errorMessage}`)
    res.status(statusCode).json({ message: errorMessage }); 
});

export default app; 