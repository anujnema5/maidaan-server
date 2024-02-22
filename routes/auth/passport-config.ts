import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config'
import { db } from '@/db';
import { Turfcaptain, User } from '@prisma/client';
import { getTcByEmail, getUserByEmail } from '@/services/user.utils';
import { RoleRequest } from '@/utils/static/types';

// Configure Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/auth/google/callback',
    passReqToCallback: true
},
    async (req: RoleRequest, accessToken: any, refreshToken: any, params: any, profile: any, done: any) => {

        try {
            const { id, displayName, name, emails, photos, provider } = profile
            const email = emails?.[0].value as string;

            if (req.role === 'user') {

                const existingUser = await getUserByEmail(email)

                if (existingUser) {
                    return done(null, existingUser as User)
                }

                // CREATE ONE
                const newUser = await db.user.create({
                    data: {
                        googleId: id,
                        fullName: displayName,
                        email: email,
                        provider,
                        emailVerified: true
                    }
                })

                done(null, newUser)
            }

            if (req.role === 'tc') {
                console.log("I am reaching here")
                const existingTc = await getTcByEmail(email)

                if (existingTc) {
                    return done(null, existingTc as Turfcaptain)
                }
                // ELSE CREATE ONE
                const newTurfCaptain = await db.turfcaptain.create({
                    data: {
                        googleId: id,
                        fullName: displayName,
                        email: email,
                        provider,
                        emailVerified: true
                    }
                })

                done(null, newTurfCaptain)
            }

        } catch (error) {
            console.log(error);
            return done(error);
        }

    }));
export default passport;
