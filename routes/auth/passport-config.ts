import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config'
import { db } from '@/db';
import { User } from '@prisma/client';
import { getUserByEmail } from '@/services/user.utils';

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your-secret-key',
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        let user;

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// Configure Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/api/auth/user/google/callback' || '/api/auth/tc/google/callback',
},

    async (accessToken, refreshToken, profile, done) => {

        try {
            const { id, displayName, name, emails, photos, provider } = profile
            const email = emails?.[0].value as string;
            // const isVerified = emails?.[0].verified

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


        } catch (error) {
            console.log(error);

        }

    }));
export default passport;
