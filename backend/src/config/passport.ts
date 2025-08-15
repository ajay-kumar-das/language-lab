import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Configure Google OAuth Strategy (only if credentials are provided)
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientID && googleClientSecret && googleClientID !== 'your_google_client_id_here') {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: '/api/v1/auth/google/callback',
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: profile.id },
              { email: profile.emails?.[0]?.value }
            ]
          }
        });

        if (user) {
          // User exists, update Google ID if not set
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { 
                googleId: profile.id,
                isVerified: true, // Google accounts are pre-verified
                lastLoginAt: new Date()
              }
            });
          } else {
            // Just update last login
            user = await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() }
            });
          }
        } else {
          // Create new user from Google profile
          const email = profile.emails?.[0]?.value;
          const firstName = profile.name?.givenName || '';
          const lastName = profile.name?.familyName || '';

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          user = await prisma.user.create({
            data: {
              email: email.toLowerCase(),
              googleId: profile.id,
              firstName,
              lastName,
              password: '', // No password for Google users
              isVerified: true, // Google accounts are pre-verified
              profileImageUrl: profile.photos?.[0]?.value,
              nativeLanguage: 'en', // Default
              targetLanguage: 'es', // Default
              lastLoginAt: new Date()
            }
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            id: user.id,
            userId: user.id,
            email: user.email
          },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return done(null, { user, token });
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, undefined);
      }
    }
    )
  );
} else {
  console.warn('Google OAuth credentials not configured. Google login will be disabled.');
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;