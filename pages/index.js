import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [damage, setDamage] = useState(1);
  const [loading, setLoading] = useState(false);
 const [texture, setTexture] = useState(null);
const [preview, setPreview] = useState("");

  const generate = async () => {
    if (!name) {
      alert("Please enter item name");
      return;
    }

    setLoading(true);

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

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Minecraft Mod Maker</h1>

        <p style={styles.subtitle}>
          Create custom Minecraft Bedrock items instantly.
        </p>

        <input
          style={styles.input}
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          value={damage}
          onChange={(e) => setDamage(e.target.value)}
        />

        <button style={styles.button} onClick={generate}>
          {loading ? "Generating..." : "Generate Addon"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
    padding: 20
  },

  card: {
    width: "100%",
    maxWidth: 400,
    background: "#1e293b",
    padding: 30,
    borderRadius: 20
  },

  title: {
    color: "white",
    fontSize: 36
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: 20
  },

  input: {
    width: "100%",
    padding: 14,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "white",
    fontWeight: "bold"
  }
};
