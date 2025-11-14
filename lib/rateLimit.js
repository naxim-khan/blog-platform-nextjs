import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Rate limiters for different use cases
export const forgotPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'), // 3 requests per 10 minutes
  analytics: true,
  prefix: 'ratelimit:forgot-password',
});

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: 'ratelimit:login',
});

export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '10 m'), // 3 requests per 10 minutes
  analytics: true,
  prefix: 'ratelimit:register',
});

export const changePasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour
  analytics: true,
  prefix: 'ratelimit:change-password',
});

export const deleteAccountLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '1 h'), // 1 request per hour
  analytics: true,
  prefix: 'ratelimit:delete-account',
});

export const resetPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 requests per hour
  analytics: true,
  prefix: 'ratelimit:reset-password',
});

export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
  analytics: true,
  prefix: 'ratelimit:general',
});

export const postCreationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 posts per minute
  analytics: true,
  prefix: 'ratelimit:post-creation',
});

// Apply rate limiting
export async function applyRateLimit(limiter, identifier) {
  const result = await limiter.limit(identifier);
  const { success, limit, reset, remaining } = result;

  return {
    success,
    limit,
    reset,
    remaining,
    isRateLimited: !success,
  };
}

// Get client IP address from request
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;

  return 'unknown';
}
