import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export const logError = (err, req = null) => {
    const errorLog = {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    };

    if (req) {
        errorLog.method = req.method;
        errorLog.url = req.url;
        errorLog.body = req.body;
        errorLog.user = req.user ? req.user.id : null;
    }

    logger.error(errorLog);
};

export const logInfo = (message, meta = {}) => {
    logger.info(message, meta);
};

export const logWarning = (message, meta = {}) => {
    logger.warn(message, meta);
};

export const logDebug = (message, meta = {}) => {
    logger.debug(message, meta);
};

export default logger;