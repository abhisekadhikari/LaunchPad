import { Kafka } from "kafkajs"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import envConfig from "./env.config.js"

// Get the current directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Kafka setup
const kafkaClient = new Kafka({
    clientId: envConfig.KAFKA_CLIENT_ID,
    brokers: [envConfig.KAFKA_BROKER],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "kafka.pem"), "utf-8")],
    },
    sasl: {
        username: envConfig.KAFKA_USERNAME,
        password: envConfig.KAFKA_PASSWORD,
        mechanism: "plain",
    },
})

const kafkaConsumer = kafkaClient.consumer({
    groupId: "api-server-logs-consumer",
})

export { kafkaClient, kafkaConsumer }
