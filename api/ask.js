import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'Missing prompt' });
    return;
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      res.status(500).json({ error: 'OpenRouter API error', details: err });
      return;
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "Žádná odpověď.";
    res.status(200).json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
