require("dotenv").config()
const express = require("express")
const httpProxy = require("http-proxy")
const connectDb = require("./db.config")
const Project = require("./project.model")

connectDb()
    .then(() => {
        console.log("Connected to MongoDB")
    }) // Connect to MongoDB
    .catch((error) => {
        console.log(`MongoDB Connection Error: ${error.message}`)
    })

const app = express()
// const proxy = httpProxy.createProxyServer()

const proxy = httpProxy.createProxy()

app.use(async (req, res) => {
    const hostname = req.hostname
    const subdomain = hostname.split(".")[0]

    // Custom Domain - DB Query

    const subDomainRecord = await Project.findOne({
        "config.subDomain": subdomain,
    })

    if (!subDomainRecord) {
        return res.status(404).send("Not Found")
    }

    const resolvesTo = `${
        process.env.BASE_PATH
    }/${subDomainRecord._id.toString()}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })
})

proxy.on("proxyReq", (proxyReq, req, res) => {
    const url = req.url
    if (url === "/") proxyReq.path += "index.html"
})

app.listen(8080, () => {
    console.log("Server started at http://localhost:8080")
})
