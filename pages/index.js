import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setChat([...chat, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();

      if (res.ok) {
        setChat(prev => [...prev, { role: 'ai', content: data.message }]);
      } else {
        setChat(prev => [...prev, { role: 'ai', content: `Error: ${data.error}` }]);
      }
    } catch (e) {
      setChat(prev => [...prev, { role: 'ai', content: 'Error: Unable to reach API' }]);
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Chat</h1>

      <div style={{
        border: '1px solid #ddd',
        padding: 10,
        height: 400,
        overflowY: 'auto',
        marginBottom: 10,
        backgroundColor: '#fafafa',
      }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ margin: '10px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <b>{msg.role === 'user' ? 'You' : 'AI'}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>AI is typing...</div>}
      </div>

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        placeholder="Type your message"
        style={{ width: '100%', padding: 10, fontSize: 16 }}
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ marginTop: 10, padding: '10px 20px' }}>
        Send
      </button>
    </div>
  );
}
