import { Router } from "express"
import {
    createProject,
    deployProject,
    /* getDeploymentLogs, */
} from "../controllers/project.controller.js"

import projectValidationSchema from "../utils/validators/project.validator.js"

const projectRouter = Router()

projectRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Project",
    })
})

projectRouter.route("/deploy").post(deployProject)

projectRouter.route("/create").post(projectValidationSchema, createProject)

// projectRouter.route("/logs/:deploymentId").get(getDeploymentLogs)

export default projectRouter
