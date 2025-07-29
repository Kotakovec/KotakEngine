export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.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}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kotak-engine.vercel.app",
        "X-Title": "KotakEngine",
      },
      body: JSON.stringify({
        model: "openrouter/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    res.status(200).json({ answer: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.status(500).json({ answer: "Chyba při spojení s AI." });
  }
}
