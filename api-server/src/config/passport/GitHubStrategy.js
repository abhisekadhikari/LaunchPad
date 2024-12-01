import { Strategy as GitHubStrategy } from "passport-github2"
import passport from "passport"

import envConfig from "../env.config.js"
import User from "../../models/user.model.js"

export default new GitHubStrategy(
    {
        clientID: envConfig.GITHUB_CLIENT_ID,
        clientSecret: envConfig.GITHUB_CLIENT_SECRET,
        callbackURL: envConfig.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            console.log("Access Token", accessToken)
            console.log("Refresh Token", refreshToken)

            // Find or create the user in your database
            let user = await User.findOne({ githubId: profile.id })

            if (!user) {
                // Create a new user if none exists
                user = new User({
                    githubId: profile.id,
                    username: profile.username,
                    avatar_url: profile._json.avatar_url,
                    displayName: profile.displayName,
                    email: profile._json.email,
                    profileUrl: profile.profileUrl,
                    provider: profile.provider,
                })

                await user.save() // Save the user to the database
            }

            // Pass the user _id and accessToken to the next step
            cb(null, { _id: user._id, accessToken })
        } catch (error) {
            console.error("Error in GitHub Strategy:", error)
            cb(error, null) // Handle errors
        }
    }
)

passport.serializeUser((user, done) => {
    // Store both user._id and accessToken in the session
    // console.log(user)
    done(null, { _id: user._id, accessToken: user.accessToken })
})

passport.deserializeUser(async (sessionData, done) => {
    try {
        // Retrieve the user from the database using the _id stored in the session
        const user = await User.findById(sessionData._id)

        if (user) {
            done(null, user._id)
        } else {
            done(new Error("User not found"), null)
        }
    } catch (error) {
        done(error, null)
    }
})
