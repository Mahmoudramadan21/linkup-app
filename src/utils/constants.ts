/*
 * Error message constants
 * - Defines standard error messages for API responses
 * - Used for consistent error handling
 */
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOO_MANY_ATTEMPTS: 'Too many login attempts, please try again after 15 minutes',
  SERVER_ERROR: 'Internal server error',
} as const;