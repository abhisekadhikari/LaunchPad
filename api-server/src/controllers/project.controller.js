import path, { dirname } from "path"
import { fileURLToPath } from "url"

import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs"
import { generateSlug } from "random-word-slugs"

// Get the current directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import asyncErrorHandler from "../utils/asyncErrorHandler.util.js"
import { matchedData, validationResult } from "express-validator"
import AppError from "../utils/AppError.js"
import Project from "../models/project.model.js"
import Deployment from "../models/deployment.model.js"
import envConfig from "../config/env.config.js"
// import { clickHouseClient } from "../config/clickhouse.config.js"

const deployProject = asyncErrorHandler(async (req, res) => {
    const { projectId } = req.body

    if (!projectId) throw new AppError("Project ID is required.", 400)

    const project = await Project.findById(projectId)

    console.log(project)

    if (!project) throw new AppError("Project not found.", 404)

    // check if the project is running deployment

    // Create a deployment

    const deployment = await Deployment.create({
        projectId,
        status: "QUEUED",
    })

    const ecsClient = new ECSClient({
        region: "ap-south-1",
        credentials: {
            accessKeyId: envConfig.ECS_CLIENT_ACCESS_KEY,
            secretAccessKey: envConfig.ECS_CLIENT_ACCESS_KEY_SECRET,
        },
    })

    const config = {
        CLUSTER: envConfig.ECS_CLUSTER,
        TASK: envConfig.ECS_TASK,
    }

    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: JSON.parse(envConfig.ECS_SUBNETS),
                securityGroups: [envConfig.ECS_SECURITY_GROUP],
            },
        },
        overrides: {
            containerOverrides: [
                {
                    name: "builder-image",
                    environment: [
                        {
                            name: "GIT_REPOSITORY__URL",
                            value: project.config.gitURL,
                        },
                        { name: "PROJECT_ID", value: projectId },
                        {
                            name: "DEPLOYMENT_ID",
                            value: deployment._id.toString(),
                        },
                    ],
                },
            ],
        },
    })

    await ecsClient.send(command)

    return res.json({
        status: "queued",
        data: deployment,
    })
})

const createProject = asyncErrorHandler(async (req, res) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new AppError(errors.formatWith((err) => err.msg).mapped(), 400)
    }

    // Extract valid data
    const data = matchedData(req, {
        includeOptionals: true,
        onlyValidData: true,
    })

    try {
        // Create the project
        const project = await Project.create({
            name: data.name,
            createdBy: req?.user?._id || "673b82726762ee01836c4b63",
            config: {
                gitURL: data.gitURL,
                subDomain: generateSlug(),
                customDomain: data.customDomain || null,
            },
        })

        // Respond with success
        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            project,
        })
    } catch (error) {
        // Handle creation error
        throw new AppError(error.message, 400)
    }
})

/* const getDeploymentLogs = asyncErrorHandler(async (req, res) => {
    const { deploymentId } = req.params

    if (!deploymentId) throw new AppError("Deployment ID is required.", 400)

    const logs = await clickHouseClient.query({
        query: `SELECT event_id, deployment_id, log, timestamp FROM log_events WHERE deployment_id={deployment_id: String}`,
        query_params: {
            deployment_id: deploymentId,
        },
        format: "JSONEachRow",
    })

    const rawLogs = await logs.json()

    return res.status(200).json({
        success: true,
        log: rawLogs,
    })
}) */

export { createProject, deployProject /* getDeploymentLogs */ }
