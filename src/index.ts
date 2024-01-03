import "module-alias/register"
import express from "express"
import { Logger } from "@/utils/logger"
import * as fs from "fs"
import { rootUserDataDirectory } from "@/constants"
import authenticationRouter from "@/routers/authentication-router/authentication-router"
import resumeRouter from "@/routers/resume-router/resume-router"

function initBackend(params: { host: string, port: number }) {
  const app = express()

  console.log(rootUserDataDirectory)

  if (!fs.existsSync(rootUserDataDirectory)) fs.mkdirSync(rootUserDataDirectory, { recursive: true })

  app.use(express.json())

  app.use("/auth", authenticationRouter)
  app.use("/resume", resumeRouter)

  app.listen(params.port, params.host, () => {
    Logger.info("Horiza backend v0.0.3 started at", params)
  })
}

initBackend({
  host: process.env.LISTEN_HOST ?? "0.0.0.0",
  port: Number(process.env.LISTEN_PORT)
})
