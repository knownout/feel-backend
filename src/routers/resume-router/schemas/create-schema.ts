import Joi from "joi"

const createSchema = {
  body: Joi.object({
    key: Joi.string().required(),
    content: Joi.string().required()
  })
}

interface CreateBody {
  key: string
  content: string
}

export default createSchema

export { type CreateBody }
