import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"

export default class UserDataInteractions {
  constructor(private readonly rootDirectoryPath: string) {
  }

  // User account interactions

  public getUsersList() {
    return this.getDirectories(this.rootDirectoryPath)
  }

  public getUserData(userId: string) {
    const userDirectoryPath = path.join(this.rootDirectoryPath, userId)

    return JSON.parse(
      fs.readFileSync(path.join(userDirectoryPath, "data.json"), { encoding: "utf-8" })
    ) as {
      username: string
      password: string
      createdAt: number
      key: string
    }
  }

  public verifyUserKey(key: string) {
    const keyData = Buffer.from(key, "base64").toString("utf-8").split(":")

    const userData = this.getUserData(keyData[0])

    return userData.key === key
  }

  public getKeyData(key: string) {
    if (!this.verifyUserKey(key)) throw new Error("Invalid key")

    const keyData = Buffer.from(key, "base64").toString("utf-8").split(":")

    return {
      username: keyData[0],
      key
    }
  }

  public deleteUser(key: string) {
    const keyData = this.getKeyData(key)

    if (!fs.existsSync(path.join(this.rootDirectoryPath, keyData.username)))
      throw new Error("Invalid key")

    fs.rmSync(path.join(this.rootDirectoryPath, keyData.username), { recursive: true, force: true })
  }

  public addNewUser(username: string, password: string) {
    const userDirectoryPath = path.join(this.rootDirectoryPath, username)

    if (fs.existsSync(userDirectoryPath)) throw new Error("Already exist")

    fs.mkdirSync(userDirectoryPath)
    fs.mkdirSync(path.join(userDirectoryPath, "resumes"))
    fs.mkdirSync(path.join(userDirectoryPath, "files"))

    const key = Buffer.from(username + ":" + crypto.randomBytes(16).toString("hex")).toString("base64")

    fs.writeFileSync(path.join(userDirectoryPath, "data.json"), JSON.stringify({
      username,
      password,
      createdAt: Date.now(),
      key
    }, null, 2))

    return key
  }

  // User resume interactions

  public createOrUpdateResume(key: string, content: string, existResumeId?: string) {
    const keyData = this.getKeyData(key)

    const resumeId = existResumeId ?? crypto.randomBytes(8).toString("hex")

    if (existResumeId) {
      const resumeContent = this.getResumeContent(key, existResumeId)

      if (resumeContent.owner !== keyData.username) throw new Error("Access denied")

      fs.writeFileSync(path.join(this.rootDirectoryPath, keyData.username, "resumes", resumeId + ".json"), JSON.stringify({
        content,
        createdAt: resumeContent.createdAt,
        updatedAt: Date.now(),
        owner: resumeContent.owner,
        id: existResumeId
      }), { encoding: "utf-8" })
    } else {
      fs.writeFileSync(path.join(this.rootDirectoryPath, keyData.username, "resumes", resumeId + ".json"), JSON.stringify({
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        owner: keyData.username,
        id: resumeId
      }), { encoding: "utf-8" })
    }

    return resumeId
  }

  public deleteResume(key: string, resumeId: string) {
    const keyData = this.getKeyData(key)

    const resumePath = path.join(this.rootDirectoryPath, keyData.username, "resumes", resumeId + ".json")
    if (!fs.existsSync(resumePath)) throw new Error("Resume not exist")

    fs.rmSync(resumePath, { force: true })
  }

  public getResumeContent(key: string, resumeId: string) {
    const keyData = this.getKeyData(key)

    return JSON.parse(
      fs.readFileSync(
        path.join(this.rootDirectoryPath, keyData.username, "resumes", resumeId + ".json"),
        { encoding: "utf-8" }
      )
    ) as { owner: string, createdAt: number, updatedAt: number, content: string }
  }

  public getAllUserResume(key: string) {
    const keyData = this.getKeyData(key)

    const files = this.getFiles(path.join(this.rootDirectoryPath, keyData.username, "resumes"))

    const contents: any[] = []

    files.forEach(file => {
      contents.push(JSON.parse(fs.readFileSync(path.join(this.rootDirectoryPath, keyData.username, "resumes", file), { encoding: "utf-8" })))
    })

    return contents
  }

  // Internal utils

  private getDirectories(path: string): string[] {
    try {
      const entries = fs.readdirSync(path)

      const directories = entries.map((entry) => {
        const fullPath = `${ path }/${ entry }`
        const stats = fs.statSync(fullPath)
        return stats.isDirectory() ? entry : null
      })

      return directories.filter((directory) => directory !== null) as string[]
    } catch (error: any) {
      throw new Error(`Error reading directories at path ${ path }: ${ error?.message }`)
    }
  }

  private getFiles(path: string): string[] {
    try {
      const entries = fs.readdirSync(path)

      const files = entries.map((entry) => {
        const fullPath = `${ path }/${ entry }`
        const stats = fs.statSync(fullPath)
        return stats.isFile() ? entry : null
      })

      return files.filter((file) => file !== null) as string[]
    } catch (error: any) {
      throw new Error(`Error reading files at path ${ path }: ${ error?.message }`)
    }
  }

}
