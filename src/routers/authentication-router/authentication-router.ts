import express from "express"
import { routerUtils } from "@/utils/router-utils"
import signupSchema, { SignUpBody } from "@/routers/authentication-router/schemas/signup-schema"
import UserDataInteractions from "@/utils/user-data-interactions"
import { rootUserDataDirectory } from "@/constants"
import signinSchema, { SignInBody } from "@/routers/authentication-router/schemas/singin-schema"
import deleteSchema, { DeleteBody } from "@/routers/authentication-router/schemas/delete-schema"
import userdataSchema from "@/routers/authentication-router/schemas/userdata-get-schema"

const authenticationRouter = express.Router()

const userInteractions = new UserDataInteractions(rootUserDataDirectory)

authenticationRouter.post("/signup", (req, res) => {
  routerUtils(res, req)
    .schema(signupSchema)
    .errorBoundary(self => {
      const body = req.body as SignUpBody

      if (body.password.trim().length < 3) throw new Error("Invalid password")

      if (body.username.replace(/[^0-9A-z]/g, "").length !== body.username.length)
        throw new Error("Invalid username")

      if (body.username.trim().length < 3) throw new Error("Invalid username")

      const usersList = userInteractions.getUsersList()

      if (usersList.some(userId => userId.toLowerCase() === body.username.toLowerCase()))
        throw new Error("User exists")

      const key = userInteractions.addNewUser(body.username, body.password)
      self.sendJSON(key)
    })
})

authenticationRouter.post("/signin", (req, res) => {
  routerUtils(res, req)
    .schema(signinSchema)
    .errorBoundary(self => {
      const body = req.body as SignInBody

      if (body.username.length <= 3) throw new Error("Invalid username")

      const usersList = userInteractions.getUsersList()
      const userId = usersList.find(userId => userId.toLowerCase() === body.username.toLowerCase())

      if (!userId) throw new Error("User not exist")

      const userData = userInteractions.getUserData(userId)

      if (userData.password !== body.password) throw new Error("Invalid password")

      self.sendJSON(userData.key)
    })
})

authenticationRouter.delete("/delete", (req, res) => {
  routerUtils(res, req)
    .schema(deleteSchema)
    .errorBoundary(self => {
      const body = req.body as DeleteBody

      try {
        userInteractions.deleteUser(body.key)
        self.sendJSON("Deleted")
      } catch {
        throw new Error("Invalid key")
      }
    })
})

authenticationRouter.get("/:key", (req, res) => {
  routerUtils(res, req)
    .schema(userdataSchema)
    .errorBoundary(self => {
      const keyData = userInteractions.getKeyData(req.params.key)
      const userData = userInteractions.getUserData(keyData.username)

      self.sendJSON({
        username: userData.username,
        createdAt: userData.createdAt,
        key: userData.key
      })
    })
})

export default authenticationRouter
