import React, { useState } from "react";
import axios from "axios";

export default function Tools() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const generateHash = async () => {
    const res = await axios.post("/api/tools/hash/", { text });
    setResult(res.data);
  };

  return (
    <div className="container">
      <h2>🔐 Generador de Hash</h2>
      <input
        type="text"
        value={text}
        placeholder="Escribe un texto"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={generateHash}>Generar</button>

      {result && (
        <div>
          <p><b>MD5:</b> {result.md5}</p>
          <p><b>SHA256:</b> {result.sha256}</p>
        </div>
      )}
    </div>
  );
}
