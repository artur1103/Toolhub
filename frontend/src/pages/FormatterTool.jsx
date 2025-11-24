import React, { useState } from "react";
import axios from "axios";

export default function FormatterTool() {
  const [inputType, setInputType] = useState("json");
  const [inputText, setInputText] = useState("");
  const [formatted, setFormatted] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormatted("");

    try {
      const res = await axios.post("/api/tools/format/", {
        input: inputText,
        input_type: inputType,
      });
      setFormatted(res.data.formatted);
    } catch (err) {
      console.error(err);
      alert("Error al formatear. Revisa que el contenido sea válido.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!formatted) return;
    navigator.clipboard.writeText(formatted);
  };

  return (
    <div className="card">
      <h2>🧹 Formateador JSON / XML / YAML</h2>
      <p className="menu-card-desc">
        Pega contenido y formatea la estructura para hacerla legible y fácil de revisar.
      </p>

      <form onSubmit={handleFormat}>
        <div className="field">
          <label className="label">Tipo de entrada:</label>
          <select
            className="select"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Contenido:</label>
          <textarea
            className="textarea"
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='{ "ejemplo": true }'
          />
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Formateando..." : "Formatear"}
        </button>
      </form>

      {formatted && (
        <>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
            <span className="label">Resultado:</span>
            <button className="button button-secondary" type="button" onClick={handleCopy}>
              Copiar
            </button>
          </div>
          <div className="result-box">{formatted}</div>
        </>
      )}
    </div>
  );
}
