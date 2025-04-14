class ApiResponse{
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode >= 200 && statusCode < 300;
        this.timestamp = new Date().toISOString();
    }

    static success(message, data = null) {
        return new ApiResponse(200, message, data);
    }

    static error(message, statusCode = 500) {
        return new ApiResponse(statusCode, message);
    }
} export default ApiResponse;