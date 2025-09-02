// src/constants/errorCodes.ts

export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",       // Input validation failed
  AUTH_ERROR: "AUTH_ERROR",                   // Authentication failed
  PERMISSION_DENIED: "PERMISSION_DENIED",     // Unauthorized action
  NOT_FOUND: "NOT_FOUND",                     // Resource not found
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",  // Conflict / duplicate resource
  SERVER_ERROR: "SERVER_ERROR",               // Internal server error
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",// External service unavailable
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED" // Too many requests
} as const;

// Optional: Type for TypeScript safety
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];
