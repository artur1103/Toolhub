// src/pages/HashTool.jsx
import React, { useState } from "react";
import axios from "axios";

export default function HashTool() {
  const [text, setText] = useState("");
  const [bcryptRounds, setBcryptRounds] = useState(12);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/tools/hash/", {
        text,
        bcrypt_rounds: bcryptRounds,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al generar hashes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔐 Convertidor de Hash</h2>
      <p className="menu-card-desc">
        Genera MD5, SHA256 y bcrypt para un texto. Útil para pruebas rápidas y debugging.
      </p>

      <form onSubmit={handleGenerate}>
        <div className="field">
          <label className="label">Texto a hashear:</label>
          <input
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="label">Rondas bcrypt (cost):</label>
          <input
            type="number"
            className="input"
            min={4}
            max={15}
            value={bcryptRounds}
            onChange={(e) => setBcryptRounds(e.target.value)}
          />
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar hashes"}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <div><strong>MD5:</strong> {result.md5}</div>
          <div><strong>SHA256:</strong> {result.sha256}</div>
          <div><strong>bcrypt:</strong> {result.bcrypt}</div>
        </div>
      )}
    </div>
  );
}
