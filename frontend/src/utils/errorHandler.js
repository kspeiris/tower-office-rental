class ErrorHandler {
  static handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return `Bad Request: ${data.error || 'Invalid data provided'}`;
        case 401:
          return 'Unauthorized: Please login again';
        case 403:
          return 'Forbidden: You do not have permission';
        case 404:
          return 'Not Found: The requested resource was not found';
        case 409:
          return 'Conflict: Resource already exists';
        case 422:
          return `Validation Error: ${data.errors?.join(', ') || 'Invalid data'}`;
        case 429:
          return 'Too Many Requests: Please try again later';
        case 500:
          return 'Server Error: Please try again later';
        case 503:
          return 'Service Unavailable: Server is under maintenance';
        default:
          return data.error || `Error: ${status}`;
      }
    } else if (error.request) {
      // Request made but no response
      if (error.message === 'Network Error') {
        return 'Network Error: Please check your internet connection';
      }
      return 'No response received from server';
    } else {
      // Something else happened
      return error.message || 'An unexpected error occurred';
    }
  }

  static handleValidationError(errors) {
    if (Array.isArray(errors)) {
      return errors.join(', ');
    } else if (typeof errors === 'object') {
      return Object.values(errors).join(', ');
    }
    return errors || 'Validation failed';
  }

  static logError(error, context = '') {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context,
      error: error.toString(),
      stack: error.stack,
      ...(error.response && {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      }),
      ...(error.request && {
        request: error.request
      })
    };

    console.error('Application Error:', errorInfo);
    
    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error);
    }
  }

  static isNetworkError(error) {
    return error.message === 'Network Error' || !error.response;
  }

  static isAuthError(error) {
    return error.response?.status === 401 || error.response?.status === 403;
  }

  static isValidationError(error) {
    return error.response?.status === 400 || error.response?.status === 422;
  }

  static isServerError(error) {
    return error.response?.status >= 500;
  }

  static getErrorCode(error) {
    return error.response?.status || error.code || 'UNKNOWN';
  }
}

export default ErrorHandler;