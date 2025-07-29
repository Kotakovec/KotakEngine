export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral/mistral-7b-instruct",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "⚠️ Odpověď nebyla nalezena.";
    res.status(200).json({ answer });
  } catch (error) {
    console.error("Chyba při volání OpenRouter API:", error);
    res.status(500).json({ answer: "⚠️ Chyba při dotazu na AI" });
  }
}
