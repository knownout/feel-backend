import Joi from "joi"

const updateSchema = {
  body: Joi.object({
    key: Joi.string().required(),
    content: Joi.string().required()
  }),
  params: Joi.object({
    id: Joi.string().required()
  })
}

interface UpdateBody {
  key: string
  content: string
}

export default updateSchema

export { type UpdateBody }
