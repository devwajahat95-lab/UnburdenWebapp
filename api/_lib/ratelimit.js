import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

// A no-op limiter used when Upstash isn't configured yet — always allows the
// request through rather than crashing the endpoint that needs rate limiting.
const noopLimiter = { limit: async () => ({ success: true }) };

export const subscribeLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      analytics: false,
      prefix: 'tuc:subscribe',
    })
  : noopLimiter;

export const assessmentLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      analytics: false,
      prefix: 'tuc:assessment',
    })
  : noopLimiter;
