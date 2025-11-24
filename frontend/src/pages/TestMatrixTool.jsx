import React, { useState } from "react";
import axios from "axios";

export default function TestMatrixTool() {
  const [dimensions, setDimensions] = useState([
    { name: "Navegador", values: "Chrome,Firefox" },
    { name: "SO", values: "Windows,Linux" },
  ]);
  const [loading, setLoading] = useState(false);

  const updateDimension = (index, key, value) => {
    const copy = [...dimensions];
    copy[index] = { ...copy[index], [key]: value };
    setDimensions(copy);
  };

  const addDimension = () => {
    setDimensions([...dimensions, { name: "", values: "" }]);
  };

  const removeDimension = (index) => {
    setDimensions(dimensions.filter((_, i) => i !== index));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        dimensions: dimensions
          .filter((d) => d.name && d.values)
          .map((d) => ({
            name: d.name,
            values: d.values.split(",").map((v) => v.trim()).filter(Boolean),
          })),
      };

      const res = await axios.post("/api/tools/test-matrix/", payload, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "test_matrix.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error al generar la matriz. Revisa las dimensiones.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📊 Generador de matriz de pruebas</h2>
      <p className="menu-card-desc">
        Define dimensiones (ej. navegador, sistema operativo, entorno) y genera todas las
        combinaciones posibles como CSV.
      </p>

      <form onSubmit={handleGenerate}>
        {dimensions.map((dim, index) => (
          <div
            key={index}
            style={{
              marginBottom: "0.8rem",
              padding: "0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(148,163,184,0.4)",
              background: "rgba(15,23,42,0.8)",
            }}
          >
            <div className="field">
              <label className="label">Nombre de dimensión #{index + 1}</label>
              <input
                className="input"
                value={dim.name}
                onChange={(e) => updateDimension(index, "name", e.target.value)}
                placeholder="Navegador / SO / Entorno"
              />
            </div>
            <div className="field">
              <label className="label">Valores (separados por coma):</label>
              <input
                className="input"
                value={dim.values}
                onChange={(e) => updateDimension(index, "values", e.target.value)}
                placeholder="Chrome,Firefox,Edge"
              />
            </div>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => removeDimension(index)}
              disabled={dimensions.length === 1}
            >
              Eliminar dimensión
            </button>
          </div>
        ))}

        <div style={{ marginBottom: "0.8rem" }}>
          <button type="button" className="button button-secondary" onClick={addDimension}>
            + Agregar dimensión
          </button>
        </div>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Generando..." : "Generar matriz (CSV)"}
        </button>
      </form>
    </div>
  );
}
