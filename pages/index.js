import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [damage, setDamage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [texture, setTexture] = useState(null);
  const [preview, setPreview] = useState("");

  const uploadTexture = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    setTexture(data.path);

    setPreview(data.path);
  };

  const generate = async () => {
    if (!name) {
      alert("Please enter an item name");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          damage,
          texture
        })
      });

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `${name}.mcaddon`;

      a.click();
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Minecraft Mod Maker</h1>

        <p style={styles.subtitle}>
          Create custom Minecraft Bedrock items instantly.
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label}>Item Name</label>

          <input
            style={styles.input}
            placeholder="Excalibur Sword"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Damage</label>

          <input
            style={styles.input}
            type="number"
            value={damage}
            onChange={(e) => setDamage(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Texture Upload</label>

          <input
            type="file"
            accept="image/png"
            onChange={uploadTexture}
            style={styles.input}
          />
        </div>

        <button style={styles.button} onClick={generate}>
          {loading ? "Generating..." : "Generate Addon"}
        </button>

        <div style={styles.preview}>
          <h3 style={{ marginBottom: 10 }}>Preview</h3>

          <div style={styles.previewCard}>
            {preview ? (
              <img
                src={preview}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  objectFit: "cover"
                }}
              />
            ) : (
              <div style={styles.previewIcon}></div>
            )}

            <div>
              <p style={styles.previewName}>
                {name || "Custom Item"}
              </p>

              <p style={styles.previewDamage}>
                Damage: {damage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #111827)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Arial"
  },

  card: {
    width: "100%",
    maxWidth: 420,
    background: "#1e293b",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white"
  },

  title: {
    fontSize: 38,
    marginBottom: 10,
    fontWeight: "bold"
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: 30
  },

  formGroup: {
    marginBottom: 20
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: "bold"
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: 15,
    border: "none",
    borderRadius: 12,
    background: "#22c55e",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10
  },

  preview: {
    marginTop: 30
  },

  previewCard: {
    background: "#0f172a",
    padding: 15,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 15
  },

  previewIcon: {
    width: 60,
    height: 60,
    background: "#22c55e",
    borderRadius: 10
  },

  previewName: {
    fontWeight: "bold",
    fontSize: 18,
    margin: 0
  },

  previewDamage: {
    color: "#94a3b8",
    marginTop: 5
  }
};
