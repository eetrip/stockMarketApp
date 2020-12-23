export class ApplicationError extends Error {
    
    constructor(message, statusCode, data) {
        super(message);
        if (!message || !statusCode) {
            throw new Error("message and statusCode must be provided");
        }

        if (statusCode < 400 || statusCode >= 600) {
            throw new Error(
                "statusCode must be a number between 400 and 599 inclusive"
            );
        }

        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    };
};