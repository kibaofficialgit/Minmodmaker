import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [damage, setDamage] = useState(1);

  const generate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, damage })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.mcaddon`;
    a.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Minecraft Mod Maker</h1>

      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        value={damage}
        onChange={(e) => setDamage(e.target.value)}
      />

      <br /><br />

      <button onClick={generate}>Generate</button>
    </div>
  );
}
