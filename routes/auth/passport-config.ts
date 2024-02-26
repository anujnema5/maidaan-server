import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config'
import { db } from '@/db';
import { Account, Turfcaptain, User } from '@prisma/client';
import { getAccountByUserId, getTcByEmail, getUserByEmail } from '@/services/user.utils';
import { RoleRequest } from '@/utils/static/types';

const createGoogleStrategy = (role: string) => {
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `/api/auth/${role}/google/callback`, // Adjust the callback URL based on your routes
        passReqToCallback: true
    },
        async (req: RoleRequest, accessToken: any, refreshToken: any, params: any, profile: any, done: any) => {
            console.log(profile)
            try {
                const { id, displayName, name, emails, photos, provider } = profile;
                const avatar = profile._json.picture;
                const emailVerified = profile._json.email_verified;
                const email = emails?.[0].value;

                if (role === 'user') {
                    console.log("Reaching under user")
                    const existingUser = await getUserByEmail(email) as User

                    if (existingUser) {
                        const account = await getAccountByUserId(existingUser.id) as Account

                        if (!account) {
                            await db.account.create({
                                data: {
                                    userId: existingUser.id,
                                    avatar
                                }
                            })
                        }

                        if (!existingUser.emailVerified) {

                            const verifiedUser = await db.user.update({
                                data: {
                                    emailVerified
                                },

                                where: { id: existingUser.id }
                            })
                            return done(null, verifiedUser as User)
                        }
                        return done(null, existingUser as User)
                    }

                    // CREATE ONE
                    const newUser = await db.user.create({
                        data: {
                            googleId: id,
                            fullName: displayName,
                            email: email,
                            provider,
                            emailVerified
                        }
                    })

                    await db.account.create({
                        data: { userId: newUser.id, avatar }
                    })


                    done(null, newUser)
                }

                if (role === 'tc') {
                    const existingTc = await getTcByEmail(email) as Turfcaptain
                    if (existingTc) {
                        console.log("Idhar to agaye")
                        if (!existingTc.emailVerified) {

                            const verifiedTC = await db.turfcaptain.update({
                                data: { emailVerified },
                                where: { id: existingTc.id }
                            })

                            return done(null, verifiedTC as User)
                        }
                        return done(null, existingTc as Turfcaptain)
                    }
                    // ELSE CREATE ONE
                    const newTurfCaptain = await db.turfcaptain.create({
                        data: {
                            googleId: id,
                            fullName: displayName,
                            email: email,
                            provider,
                            emailVerified,
                            avatar
                        }
                    })

                    done(null, newTurfCaptain)
                }

            } catch (error) {
                console.log(error);
                return done(error);
            }
        });
};

// Use the generic Google strategy for user authentication
passport.use('user-google', createGoogleStrategy('user'));

// Use the generic Google strategy for turf captain authentication
passport.use('tc-google', createGoogleStrategy('tc'));

export default passport;
