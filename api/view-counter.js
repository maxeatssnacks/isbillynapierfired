// Simple in-memory counter (resets on server restart)
// For production, you'd want to use a database like Vercel KV, Supabase, or Firebase
let viewCount = 0;

export default function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return current count
    res.status(200).json({ count: viewCount });
  } else if (req.method === 'POST') {
    // Increment count
    viewCount++;
    res.status(200).json({ count: viewCount });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
