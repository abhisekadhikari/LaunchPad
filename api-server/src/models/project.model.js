import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
            required: true,
        },

        config: {
            gitURL: {
                type: String,
                required: true,
            },
            subDomain: {
                type: String,
                required: true,
            },

            customDomain: String,
        },
    },
    {
        timestamps: true,
    }
)

const Project = mongoose.model("Project", projectSchema)

export default Project
