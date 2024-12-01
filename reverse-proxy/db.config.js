const mongoose = require("mongoose")

async function connectDb() {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo DB Connection Successful 🎊")
        console.log(`Connection Host: ${connectionInstance.connection.host}`)
        console.log(
            `Database Name: ${connectionInstance.connection.db.databaseName}`
        )
    } catch (error) {
        console.log(`Mongo DB Connection Error: ${error.message}`)
    }
}

module.exports = connectDb
