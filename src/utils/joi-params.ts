import Joi from "joi"

const JoiEthereumAddress = Joi.string().regex(/\b0x[0-9A-z]{40}\b/).length(42)

export {
  JoiEthereumAddress
}
