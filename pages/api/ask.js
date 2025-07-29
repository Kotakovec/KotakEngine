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
        model: "mistralai/mistral-7b-instruct", // ✅ pozor na název modelu
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Žádná odpověď od AI.");
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({ answer: reply });
  } catch (error) {
    console.error("Chyba API:", error);
    res.status(500).json({ answer: "⚠️ Chyba při dotazu na AI" });
  }
}