import React, { useState } from "react";
import axios from "axios";

export default function JwtTool() {
  const [payloadText, setPayloadText] = useState('{\n  "sub": "user123"\n}');
  const [secret, setSecret] = useState("mysecret");
  const [algorithm, setAlgorithm] = useState("HS256");
  const [expiresIn, setExpiresIn] = useState(3600);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const parsedPayload = JSON.parse(payloadText);

      const res = await axios.post("/api/tools/jwt/", {
        payload: parsedPayload,
        secret,
        algorithm,
        expires_in: expiresIn,
      });

      // El backend devuelve: { token: "..." }
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al generar el JWT. Verifica el payload y la clave.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.token) return;
    navigator.clipboard.writeText(result.token);
  };

  return (
    <div className="card">
      <h2>🎫 Generador de JWT</h2>
      <p className="menu-card-desc">
        Genera un token JWT con un payload arbitrario y expiración opcional. Útil para pruebas de APIs protegidas.
      </p>

      <form onSubmit={handleGenerate}>
        <div className="field">
          <label className="label">Payload (JSON):</label>
          <textarea
            className="textarea"
            rows={6}
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Secret:</label>
          <input
            className="input"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="label">Algoritmo:</label>
          <select
            className="select"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="HS256">HS256</option>
            <option value="HS384">HS384</option>
            <option value="HS512">HS512</option>
          </select>
        </div>

        <div className="field">
          <label className="label">Expiración (segundos):</label>
          <input
            type="number"
            className="input"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
          />
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar JWT"}
        </button>
      </form>

      {result && (
        <>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span className="label">Token generado:</span>
            <button className="button button-secondary" type="button" onClick={handleCopy}>
              Copiar token
            </button>
          </div>

          <div className="result-box">{result.token}</div>
        </>
      )}
    </div>
  );
}
