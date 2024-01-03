import Joi from "joi"

const signupSchema = {
  body: Joi.object({
    username: Joi.string().max(64).required(),
    password: Joi.string().max(64).required()
  })
}

interface SignUpBody {
  username: string
  password: string
}

export default signupSchema

export { type SignUpBody }
