import { useState } from 'react';
import "./style.css";

export default function CatSearch() {
  const [input, setInput] = useState("");
  const [catUrl, setCatUrl] = useState(null);

  const handleSend = async function() {
    const formattedTags = input.toLowerCase().replace(/\./g, '').trim().split(/\s+/);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/process-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: formattedTags }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCatUrl(data.url);
      } else {
        console.log("No cats found with those tags!");
      }
    } catch (error) {
      console.log("Error connecting to Flask:", error);
    }
  };

  return (
    <div id="main-container">
      <img src={catUrl} alt="a random cat"/>

      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Write an emotion (like sad, angry etc)"
      />

      <button onClick={handleSend}>Find Cat</button>
    </div>
  );
}