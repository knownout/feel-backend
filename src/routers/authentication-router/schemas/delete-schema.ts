import Joi from "joi"

const deleteSchema = {
  body: Joi.object({
    key: Joi.string().required()
  })
}

interface DeleteBody {
  key: string
}

export default deleteSchema

export { type DeleteBody }
