import mongoose from "mongoose"

const deploymentSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: "Projects",
        },

        status: {
            type: String,
            enum: ["NOT_STARTED", "QUEUED", "IN_PROGRESS", "READY", "FAIL"],
            default: "NOT_STARTED",
        },
    },
    {
        timestamps: true,
    }
)

const Deployment = mongoose.model("Deployments", deploymentSchema)

export default Deployment
