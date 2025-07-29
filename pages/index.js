import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");
  const [loading, setLoading] = useState(false);

  const isLikelyDomain = (text) => /^[\w.-]+\.[a-z]{2,}$/.test(text);

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setAnswer("");
      setIframeSrc("");
      setLoading(true);

      let query = input.trim();

      if (query.startsWith("http://") || query.startsWith("https://")) {
        setIframeSrc(query);
        setLoading(false);
        return;
      }

      if (isLikelyDomain(query)) {
        setIframeSrc("https://" + query);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query })
        });
        const data = await res.json();
        setAnswer(data.answer || "❌ AI neodpověděla.");
      } catch (err) {
        setAnswer("⚠️ Chyba při dotazu na AI");
      }

      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", margin: 0 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "1rem", gap: "10px" }}>
        <img src="/logo.png" alt="Logo" style={{ height: "40px" }} />
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>KotakEngine</h1>
        <input
          style={{
            marginLeft: "30px",
            flexGrow: 1,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "none"
          }}
          type="text"
          placeholder="Zadej dotaz nebo web (např. frcreator.eu)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {loading && <p style={{ margin: "1rem" }}>⏳ Načítání...</p>}
      {answer && (
        <div style={{ background: "#222", margin: "1rem", padding: "1rem", borderRadius: "8px" }}>
          {answer}
        </div>
      )}
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          style={{ width: "100%", height: "80vh", border: "none" }}
        />
      )}
    </div>
  );
}
