import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({
    level, timestamp, message
}) => {
    return `[${level}] - ${timestamp}: ${message}`
});

const logger = createLogger({
    level : 'info',
    format : combine(
        colorize(),
        timestamp({ format : 'YYYY-MM-DD HH:mm:ss'}),
        customFormat
    ),
    transports : [
        new transports.Console(),
        new transports.File({ filename : 'logs/app.log'})
    ]
})

export default logger