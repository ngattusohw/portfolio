import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { db } from "./db";
import ws from "ws";
import * as schema from "@shared/schema";

// Check for environment variables
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

// Cache OIDC configuration to avoid hitting Replit's API too often
const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 } // Cache for 1 hour
);

// Configure session storage
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.REPL_ID!, // Using REPL_ID as the session secret
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

// Update user session with new tokens
function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

// Upsert user in database
async function upsertUser(claims: any) {
  try {
    // Convert claims to user data
    const userData = {
      id: claims["sub"],
      username: claims["username"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"],
      bio: claims["bio"],
      profileImageUrl: claims["profile_image_url"],
    };

    // Insert or update user in the database
    await storage.upsertUser(userData);
  } catch (error) {
    console.error("Error upserting user:", error);
  }
}

// Set up Replit Auth
export async function setupAuth(app: Express) {
  // Trust proxies
  app.set("trust proxy", 1);
  
  // Set up session and passport
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Get OIDC config
  const config = await getOidcConfig();

  // Verify function for OpenID client
  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const claims = tokens.claims();
    console.log("Auth claims:", JSON.stringify(claims, null, 2));
    
    const user = {
      // Include all claims
      ...claims
    };
    
    updateUserSession(user, tokens);
    await upsertUser(claims);
    
    console.log("Auth user created:", user.email, user.username);
    verified(null, user);
  };

  // Set up strategies for each domain
  for (const domain of process.env.REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  // Serialize and deserialize user for session
  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Auth routes
  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/admin",
      failureRedirect: "/",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
  
  // User info endpoint
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      console.log("User info endpoint - user:", req.user);
      
      // Return the claims directly instead of looking up from database
      // This ensures we have access to all the user information
      res.json({
        id: req.user.sub || req.user.claims?.sub,
        username: req.user.username || req.user.claims?.username,
        email: req.user.email || req.user.claims?.email,
        firstName: req.user.first_name || req.user.claims?.first_name,
        lastName: req.user.last_name || req.user.claims?.last_name,
        bio: req.user.bio || req.user.claims?.bio,
        profileImageUrl: req.user.profile_image_url || req.user.claims?.profile_image_url
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}

// Middleware to check if user is authenticated and is Nick
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Check if the user is Nick Gattuso by username or email
  const username = user.claims?.username;
  const email = user.claims?.email;
  
  console.log("Auth checking - Username:", username, "Email:", email);
  
  // Allow access if user has the specified email or username
  if (
    (!username || username !== "ngattuso3") && 
    (!email || email !== "ngattusohw@gmail.com")
  ) {
    console.log("Access denied. User not authorized.");
    return res.status(403).json({ message: "Access denied. Only Nick can access this area." });
  }
  
  console.log("User authorized:", email);

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.redirect("/api/login");
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    console.error("Token refresh failed:", error);
    return res.redirect("/api/login");
  }
};