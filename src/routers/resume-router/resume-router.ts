import express from "express"
import { routerUtils } from "@/utils/router-utils"
import UserDataInteractions from "@/utils/user-data-interactions"
import { rootUserDataDirectory } from "@/constants"
import createSchema, { CreateBody } from "@/routers/resume-router/schemas/create-schema"
import updateSchema, { UpdateBody } from "@/routers/resume-router/schemas/update-schema"
import deleteSchema, { DeleteBody } from "@/routers/resume-router/schemas/delete-schema"
import Joi from "joi"

const resumeRouter = express.Router()

const userInteractions = new UserDataInteractions(rootUserDataDirectory)

resumeRouter.post("/", (req, res) => {
  routerUtils(res, req)
    .schema(createSchema)
    .errorBoundary(self => {
      const body = req.body as CreateBody

      const id = userInteractions.createOrUpdateResume(body.key, body.content)

      self.sendJSON(userInteractions.getResumeContent(body.key, id))
    })
})

resumeRouter.patch("/:id", (req, res) => {
  routerUtils(res, req)
    .schema(updateSchema)
    .errorBoundary(self => {
      const body = req.body as UpdateBody

      const id = userInteractions.createOrUpdateResume(body.key, body.content, req.params.id)

      self.sendJSON(userInteractions.getResumeContent(body.key, id))
    })
})

resumeRouter.delete("/:id", (req, res) => {
  routerUtils(res, req)
    .schema(deleteSchema)
    .errorBoundary(self => {
      const body = req.body as DeleteBody

      userInteractions.deleteResume(body.key, req.params.id)
      self.sendJSON("Deleted")
    })
})

resumeRouter.get("/all/:key", (req, res) => {
  routerUtils(res, req)
    .schema({ params: Joi.object({ key: Joi.string().required() }) })
    .errorBoundary(self => {
      self.sendJSON(userInteractions.getAllUserResume(req.params.key))
    })
})

resumeRouter.get("/:key/:id", (req, res) => {
  routerUtils(res, req)
    .schema({
      params: Joi.object({ id: Joi.string().required(), key: Joi.string().required() })
    })
    .errorBoundary(self => {
      self.sendJSON(userInteractions.getResumeContent(req.params.key, req.params.id))
    })
})

export default resumeRouter
