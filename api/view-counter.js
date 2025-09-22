import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get current count from KV database
      const count = await kv.get('viewCount');
      if (count === null) {
        // Initialize to 346 if it doesn't exist
        await kv.set('viewCount', 346);
        res.status(200).json({ count: 346 });
      } else {
        res.status(200).json({ count: parseInt(count) });
      }
    } else if (req.method === 'POST') {
      // Increment count in KV database
      const newCount = await kv.incr('viewCount');
      res.status(200).json({ count: newCount });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('KV Error:', error);
    // Fallback to 346 if KV fails
    res.status(200).json({ count: 346 });
  }
}
