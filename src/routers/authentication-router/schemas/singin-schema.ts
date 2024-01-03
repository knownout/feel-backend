import Joi from "joi"

const signinSchema = {
  body: Joi.object({
    username: Joi.string().max(64).required(),
    password: Joi.string().max(64).required()
  })
}

interface SignInBody {
  username: string
  password: string
}

export default signinSchema

export { type SignInBody }
