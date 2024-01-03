import colors from "colors/safe"

export enum LogType {
  INFO = "Info",
  WARNING = "Warning",
  ERROR = "Error",
  TRANSACTION = "Transaction",
}

export class Logger {
  public static getReadableTimestamp () {
    const date = new Date()

    return [
      [ date.getFullYear(), date.getMonth(), date.getDate() ].map(s => String(s).padStart(2, "0")).join("-"),
      [ date.getHours(), date.getMinutes(), date.getSeconds() ].map(s => String(s).padStart(2, "0")).join(":")
    ].join(" ")
  }

  public static log (logType: LogType, ...message: any) {
    colors.enable()

    const messageColor = {
      [LogType.WARNING]: "yellow",
      [LogType.ERROR]: "red",
      [LogType.INFO]: "cyan",
      [LogType.TRANSACTION]: "magenta"
    }[logType]

    const nextMessage = [
      (colors as any)[messageColor]?.(`[${ logType } at ${ this.getReadableTimestamp() }]`),
      ...message
    ]

    console.log(...nextMessage)

    colors.disable()
  }

  public static info (...message: any) { this.log(LogType.INFO, ...message) }

  public static warning (...message: any) { this.log(LogType.WARNING, ...message) }

  public static error (...message: any) { this.log(LogType.ERROR, ...message) }

  public static transaction (...message: any) { this.log(LogType.TRANSACTION, ...message) }
}
