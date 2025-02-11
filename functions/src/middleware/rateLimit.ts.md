# Rate Limiting Middleware Documentation

## File Information
- **File**: rateLimit.ts
- **Description**: Implements rate limiting for Firebase Functions endpoints
- **Location**: functions/src/middleware/rateLimit.ts
- **Last Updated**: 2024-03-21

## Overview
This middleware implements rate limiting for Firebase Functions to prevent abuse and ensure fair usage of the API. It tracks request frequency per user/IP and enforces limits based on subscription tiers.

## Dependencies
- Firebase Functions
- Firebase Admin SDK
- Redis (for distributed rate limiting)
- Subscription Service (for tier limits)

## Features
- Per-user rate limiting
- IP-based rate limiting for unauthenticated requests
- Tiered rate limits based on subscription level
- Distributed rate limiting support
- Configurable time windows
- Custom limit overrides
- Burst protection

## Configuration Options
```typescript
export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  errorMessage?: string; // Custom error message
  keyGenerator?: Function; // Custom key generation
}
```

## Implementation Details
- Uses sliding window algorithm
- Implements token bucket algorithm
- Supports distributed environments
- Handles edge cases and race conditions
- Provides detailed error responses

## Rate Limit Tiers
- Free: 60 requests per minute
- Basic: 300 requests per minute
- Pro: 1000 requests per minute
- Enterprise: Custom limits

## Error Handling
- 429 Too Many Requests responses
- Retry-After header implementation
- Custom error messages
- Graceful degradation
- Request queue management

## Debug History

### 2024-03-21
- Initial documentation created
- Rate limiting working as expected
- Added improved error messages

### Known Issues
- None currently reported

### Future Improvements
- Add dynamic rate limit adjustment
- Implement request prioritization
- Add rate limit analytics
- Enhance monitoring and alerts
- Add rate limit preemption 