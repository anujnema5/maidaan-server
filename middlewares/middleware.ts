// middlewares.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from '@/utils/passport-config';
import cors from 'cors';

const appMiddlewares = (app: express.Application) => {
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

export default appMiddlewares;
