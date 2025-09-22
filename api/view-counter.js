import { Redis } from '@upstash/redis';

// Initialize Redis client with Upstash REST credentials
// NOTE: Must use KV_REST_API_URL and KV_REST_API_TOKEN (WRITE token)
function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('Missing Upstash env vars: KV_REST_API_URL / KV_REST_API_TOKEN');
  }
  return new Redis({ url, token });
}

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const redis = getRedis();
    if (req.method === 'GET') {
      // Initialize only once (atomic NX) then return current value
      await redis.set('viewCount', 346, { nx: true });
      const count = await redis.get('viewCount');
      res.status(200).json({ count: parseInt(String(count)) || 346 });
    } else if (req.method === 'POST') {
      // Initialize if absent (NX). If we just initialized, return 346; else increment.
      const wasInitialized = await redis.set('viewCount', 346, { nx: true });
      if (wasInitialized) {
        return res.status(200).json({ count: 346 });
      }
      const newCount = await redis.incr('viewCount');
      res.status(200).json({ count: newCount });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('KV Error:', error);
    res.status(500).json({ error: 'Counter service unavailable' });
  }
}
