import dotenv from "dotenv"

// Load environment variables dynamically based on the current environment
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`, // Selects the appropriate .env file
    debug: true, // Logs environment variable loading for debugging
    encoding: "UTF-8", // Ensures UTF-8 encoding is used
})

const NODE_ENV = process.env.NODE_ENV

const devEnv = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKER: process.env.KAFKA_BROKER,
    KAFKA_USERNAME: process.env.KAFKA_USERNAME,
    KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
    ECS_CLUSTER: process.env.ECS_CLUSTER,
    ECS_TASK: process.env.ECS_TASK,
    ECS_SUBNETS: process.env.ECS_SUBNETS,
    ECS_CLIENT_ACCESS_KEY: process.env.ECS_CLIENT_ACCESS_KEY,
    ECS_CLIENT_ACCESS_KEY_SECRET: process.env.ECS_CLIENT_ACCESS_KEY_SECRET,
    ECS_SECURITY_GROUP: process.env.ECS_SECURITY_GROUP,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
}

const prodEnv = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKER: process.env.KAFKA_BROKER,
    KAFKA_USERNAME: process.env.KAFKA_USERNAME,
    KAFKA_PASSWORD: process.env.KAFKA_PASSWORD,
    ECS_CLUSTER: process.env.ECS_CLUSTER,
    ECS_TASK: process.env.ECS_TASK,
    ECS_SUBNETS: process.env.ECS_SUBNETS,
    ECS_CLIENT_ACCESS_KEY: process.env.ECS_CLIENT_ACCESS_KEY,
    ECS_CLIENT_ACCESS_KEY_SECRET: process.env.ECS_CLIENT_ACCESS_KEY_SECRET,
    ECS_SECURITY_GROUP: process.env.ECS_SECURITY_GROUP,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
}

const envConfig = NODE_ENV === "dev" ? devEnv : prodEnv

export default envConfig
