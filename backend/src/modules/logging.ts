import * as winston from "winston";

export type log_fn_t = (msg: string, level?: level_keys_t) => void;

type level_keys_t = "fatal" | "alert" | "error" | "warn" | "info" | "debug" | "net" | "silly";

const loggerLevels: { [K in level_keys_t]: number } = {
    fatal: 0,
    alert: 1,
    error: 2,
    warn: 3,
    info: 4,
    debug: 5,
    net: 6,
    silly: 7,
};

const loggerColors: { [K in level_keys_t]: string } = {
    fatal: "bold black redBG",
    alert: "bold red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "yellow",
    net: "blue",
    silly: "magenta",
};

winston.addColors(loggerColors);

const format = winston.format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] - ${level}: ${message}`;
});

const testFormat = winston.format.combine(
    winston.format(info => {
        info.level = info.level.toUpperCase();
        return info;
    })(),
    winston.format.colorize(),
    winston.format.timestamp(), //TODO: Fix this ugly AF timestamp
    format
);

const logging = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: testFormat,
    levels: loggerLevels,
});

export function logger(moduleName: string): log_fn_t {
    return function log(msg: string, level: level_keys_t = "info") {
        logging.log({
            level: level,
            message: msg,
            label: moduleName
        });
    };
}
