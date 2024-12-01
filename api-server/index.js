import app from "./src/app.js"
import connectDb from "./src/config/db.config.js"
import envConfig from "./src/config/env.config.js"

connectDb()
    .then(() => {
        app.listen(envConfig.PORT, () => {
            console.log("App Started 🚀")
            console.info(`App running on http://localhost:${envConfig.PORT}`)
        })

        app.on("error", (err) => {
            console.error("App error", err)
        })
    })
    .catch((err) => {
        console.error(`Server Start Failed: ${err.message}`)
    })
