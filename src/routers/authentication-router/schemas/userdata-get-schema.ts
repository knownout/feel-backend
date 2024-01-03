import Joi from "joi"

const userdataSchema = {
  params: Joi.object({
    key: Joi.string().required()
  })
}

export default userdataSchema
