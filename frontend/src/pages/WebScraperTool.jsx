import React, { useState } from "react";
import axios from "axios";

export default function WebScraperTool() {
  const [urlsText, setUrlsText] = useState("https://example.com");
  const [csvFile, setCsvFile] = useState(null);

  const [tag, setTag] = useState("div");
  const [className, setClassName] = useState("");
  const [ids, setIds] = useState("absolute-footer,absolute-header");

  const [loading, setLoading] = useState(false);
  const [jsonOutput, setJsonOutput] = useState(null);

  // =============================
  // 1) GENERAR SALIDA (JSON)
  // =============================
  const handleGenerateOutput = async () => {
    setLoading(true);
    setJsonOutput(null);

    try {
      const formData = new FormData();

      const urls = urlsText
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      formData.append("urls", JSON.stringify(urls));
      formData.append("tag", tag);
      formData.append("class_name", className);
      formData.append("ids", JSON.stringify(ids.split(",").map((i) => i.trim())));
      formData.append("output", "json");

      if (csvFile) {
        formData.append("csv_file", csvFile);
      }

      const res = await axios.post("/api/tools/scrape-tags/", formData);
      setJsonOutput(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al generar la salida");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 2) GENERAR CSV (descarga)
  // =============================
  const handleGenerateCSV = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      const urls = urlsText
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      formData.append("urls", JSON.stringify(urls));
      formData.append("tag", tag);
      formData.append("class_name", className);
      formData.append("ids", JSON.stringify(ids.split(",").map((i) => i.trim())));

      if (csvFile) {
        formData.append("csv_file", csvFile);
      }

      const res = await axios.post("/api/tools/scrape-tags/", formData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "webscraper_results.csv";
      a.click();
    } catch (err) {
      console.error(err);
      alert("No se pudo generar el CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>🔍 Web Scraper</h2>
      <p className="menu-card-desc">
        Busca etiquetas HTML específicas usando tu script.
      </p>

      <div className="field">
        <label className="label">URLs (una por línea):</label>
        <textarea
          className="textarea"
          rows={4}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">Subir CSV (columna 'url'):</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />
      </div>

      <hr />

      <div className="field">
        <label className="label">Etiqueta (tag):</label>
        <input
          className="input"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">Clase (opcional):</label>
        <input
          className="input"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">IDs (separados por coma):</label>
        <input
          className="input"
          value={ids}
          onChange={(e) => setIds(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button className="button" onClick={handleGenerateOutput} disabled={loading}>
          {loading ? "Procesando..." : "Generar salida"}
        </button>

        <button
          className="button button-secondary"
          onClick={handleGenerateCSV}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Generar CSV"}
        </button>
      </div>

      {jsonOutput && (
        <>
          <h4 style={{ marginTop: "1rem" }}>Resultados:</h4>
          <div className="result-box">
            {JSON.stringify(jsonOutput, null, 2)}
          </div>
        </>
      )}
    </div>
  );
}
