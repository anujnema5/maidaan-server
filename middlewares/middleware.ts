// middlewares.ts
import express, { NextFunction, Request, Response, Router } from 'express';
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

export const initializeRole = (router: Router, role: string) => {
    router.use((req: RoleRequest, res, next) => {
        req.role = role;
        next();
    });
};

export const userRole = (req: RoleRequest, res: Response, next: NextFunction) => {
    const previousUrl = req.headers.referer;
    console.log(previousUrl)
    req.role = 'user'
    next();
}

export const tcRole = (req: RoleRequest, res: Response, next: NextFunction) => {
    // const previousUrl = req.headers.referer;
    // console.log(previousUrl)
    req.role = 'tc'
    next();
}

export default initializeMiddlewares;
