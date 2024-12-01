import { Server } from "socket.io"

// import { clickHouseClient } from "../config/clickhouse.config.js"
import { kafkaConsumer } from "../config/kafka.config.js"
import { v4 as uuidv4 } from "uuid"

const io = new Server({ cors: "*" })

io.on("connection", (socket) => {
    socket.on("subscribe", (channel) => {
        socket.join(channel)
    })
})

io.listen(8000, () => console.log("Socket Server Started"))

// Graceful shutdown signal handlers
const setupGracefulShutdown = () => {
    process.on("SIGINT", async () => {
        console.log("Process interrupted. Disconnecting Kafka consumer...")
        await kafkaConsumer.disconnect()
        process.exit(0)
    })

    process.on("SIGTERM", async () => {
        console.log("Process terminated. Disconnecting Kafka consumer...")
        await kafkaConsumer.disconnect()
        process.exit(0)
    })
}

// Message processor
const processMessage = async (message) => {
    const stringMessage = message.value.toString()
    const parsedMessage = JSON.parse(stringMessage)

    // Validate message structure
    if (
        !parsedMessage.PROJECT_ID ||
        !parsedMessage.DEPLOYMENT_ID ||
        !parsedMessage.log
    ) {
        throw new Error("Invalid message structure")
    }

    const { PROJECT_ID, DEPLOYMENT_ID, log } = parsedMessage

    // Insert log event into ClickHouse

    io.to(DEPLOYMENT_ID).emit("deployment_logs", log)

    // Insert log event into ClickHouse

    /* await clickHouseClient.insert({
        table: "log_events",
        values: [
            {
                event_id: uuidv4(),
                deployment_id: DEPLOYMENT_ID,
                log,
            },
        ],
        format: "JSONEachRow",
    }) */
}

// Concurrency limiter for batch processing
const limitConcurrency = async (messages, limit, resolveOffset) => {
    const pool = []

    for (const message of messages) {
        const promise = processMessage(message)
            .then(() => {
                resolveOffset(message.offset)
            })
            .catch((error) => {
                console.error(
                    `Error processing message at offset ${message.offset}:`,
                    error
                )
            })

        pool.push(promise)

        if (pool.length >= limit) {
            await Promise.all(pool)
            pool.length = 0 // Clear the pool
        }
    }

    await Promise.all(pool) // Process remaining messages
}

// Initialize Kafka consumer
const initKafkaConsumer = async () => {
    try {
        await kafkaConsumer.connect()
        console.log("Kafka consumer connected.")

        await kafkaConsumer.subscribe({
            topics: ["container-logs"],
        })

        console.log("Subscribed to topic: container-logs")

        await kafkaConsumer.run({
            autoCommit: false,
            eachBatch: async ({
                batch,
                heartbeat,
                commitOffsetsIfNecessary,
                resolveOffset,
            }) => {
                console.log(`Receiving ${batch.messages.length} messages...`)

                await limitConcurrency(batch.messages, 10, resolveOffset)

                // Commit offsets after processing the batch
                await commitOffsetsIfNecessary()
                await heartbeat()

                console.log("Batch processing completed.")
            },
        })

        setupGracefulShutdown() // Handle termination signals
    } catch (error) {
        console.error("Error initializing Kafka consumer:", error)
        process.exit(1)
    }
}

export default initKafkaConsumer
