// Import core and third-party modules
import express from "express"
import expressSession from "express-session"
import passport from "passport"
import MongoStore from "connect-mongo"
import axios from "axios"
import { createServer } from "http"
import { Server, Socket } from "socket.io"
import cors from "cors"

// Import custom modules and utilities
import initKafkaConsumer from "./utils/kafka.util.js" // Kafka consumer initialization utility

import appRouter from "./routes/app.routes.js" // Application routes
import AppError from "./utils/AppError.js" // Custom error class for structured errors
import envConfig from "./config/env.config.js"
import GitHubStrategy from "./config/passport/GitHubStrategy.js"

// Create an Express application instance
const app = express()

// Configure Passport with the GitHub strategy
passport.use(GitHubStrategy)

// Initialize Kafka consumer (e.g., subscribing to topics, handling messages)
// initKafkaConsumer()

// Set up middleware

// cors middleware
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
    })
)

// Parse incoming JSON payloads in requests
app.use(express.json())

// Parse URL-encoded data (e.g., form submissions)
app.use(express.urlencoded({ extended: false }))

// Configure session handling
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
        resave: false, // Prevents resaving session if it hasn't been modified
        saveUninitialized: false, // Avoids creating sessions for unauthenticated users
        cookie: {
            secure: false, // Allows HTTP cookies (set to true for HTTPS in production)
            httpOnly: true, // Prevents JavaScript access to the cookie (enhances security)
            maxAge: 1000 * 60 * 60 * 24, // Sets cookie expiration to 24 hours
        },
        store: new MongoStore({
            mongoUrl: envConfig.MONGO_URI, // MongoDB connection URI
            collectionName: "sessions", // Collection to store session data
        }), // Stores session data in MongoDB
    })
)

// Initialize Passport for authentication and integrate it with session management
app.use(passport.initialize())
app.use(passport.session())

// Set up application routes
app.use("/api", appRouter)

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(err) // Log the error for debugging

    // Handle custom application errors
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false, // Indicates failure
            message: err.message, // Specific error message
        })
    }

    // Handle unexpected errors
    res.status(500).json({
        success: false, // Indicates failure
        message: "Something went wrong", // Generic error message
    })
})

// Export the configured Express application for use in the entry point
export default app
