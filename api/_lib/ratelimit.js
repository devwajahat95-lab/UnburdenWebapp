import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

export const subscribeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: false,
  prefix: 'tuc:subscribe',
});

export const assessmentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  analytics: false,
  prefix: 'tuc:assessment',
});
