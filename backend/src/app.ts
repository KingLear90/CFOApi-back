import 'dotenv/config';
import express from 'express';
import clientRoutes from './routes/clientRoute';
import collaboratorRoutes from './routes/collaboratorRoute';
import profileRoutes from './routes/profileRoute';
import projectRoutes from './routes/projectRoute';
import departmentRoutes from './routes/departmentRoute';
import tribeRoutes from './routes/tribeRoute';
import userRoutes from './routes/userRoute';
import createHttpError from 'http-errors';
import cors from 'cors';
import session from 'express-session';
import env from './utils/validateEnv';
import MongoStore from 'connect-mongo';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true
    }
));

app.use(express.json());

app.use(session({
    secret: env.JWT_SECRET,
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

// Middleware que maneja errores.
app.use(errorHandler);

export default app; 