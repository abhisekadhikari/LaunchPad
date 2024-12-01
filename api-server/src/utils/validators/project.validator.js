import { checkSchema } from "express-validator"

const projectValidationSchema = checkSchema({
    name: {
        isString: {
            errorMessage: "Name must be a string",
        },
        isLength: {
            errorMessage: "Name must be at least 3 characters long",
            options: { min: 3 },
        },
    },

    gitURL: {
        isString: {
            errorMessage: "Git URL must be a string",
        },
        matches: {
            options: [
                /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\.git)?$/,
            ],
            errorMessage: "Git URL must be a valid GitHub repository URL",
        },
    },

    customDomain: {
        optional: true,
    },
})

export default projectValidationSchema
