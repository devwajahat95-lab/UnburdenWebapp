import { Redis } from '@upstash/redis';

// If Upstash isn't configured yet, don't crash every function that imports
// this file — export null and let ratelimit.js fail open instead.
export const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

