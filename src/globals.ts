export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
      LISTEN_PORT?: string
      LISTEN_HOST?: string
      USER_DATA_DIRECTORY?: string
    }
  }
}
