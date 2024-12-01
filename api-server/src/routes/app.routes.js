import { Router } from "express"
import projectRouter from "./project.routes.js"
import authRouter from "./auth.routes.js"

const appRouter = Router()

appRouter.use("/auth", authRouter)

appRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the App",
        accessToken: req.user,
    })
})

appRouter.get("/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user })
    } else {
        res.status(401).json({ message: "Unauthorized" })
    }
})

appRouter.use("/project", projectRouter)

export default appRouter
