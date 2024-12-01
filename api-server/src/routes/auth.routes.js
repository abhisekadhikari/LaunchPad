import { Router } from "express"
import passport from "passport"

const authRouter = Router()

authRouter.route("/github").get(
    passport.authenticate("github", {
        scope: ["user:email", "repo"],
    })
)

authRouter.route("/github/callback").get(
    passport.authenticate("github", {
        failureRedirect: "/",
        successRedirect: "http://localhost:5173/success",
    })
)

export default authRouter
