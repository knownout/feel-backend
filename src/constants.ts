import path from "path"

require("dotenv").config()

export const rootUserDataDirectory = path.join(__dirname, process.env.USER_DATA_DIRECTORY as string)
