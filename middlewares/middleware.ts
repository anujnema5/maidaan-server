// middlewares.ts
import express, { Router } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from '@/routes/auth/passport-config';
import cors from 'cors';
import { RoleRequest, Role } from '@/utils/static/types';

const initializeMiddlewares = (app: express.Application) => {
    app.use(express.json());
    app.use(cookieParser());

    app.use(
        session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false },
        })
    );

    app.use(passport.initialize());

    app.use(
        cors({
            origin: 'http://localhost:3000',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        })
    );
};

export const initializeRole = (router: Router, role: Role) => {
    router.use((req: RoleRequest, res, next) => {
        req.role = role;
        next();
    });
};

export default initializeMiddlewares;
