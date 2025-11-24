import React, { useState } from "react";
import axios from "axios";

export default function SiteCheckerTool() {
  const [urlsText, setUrlsText] = useState("https://example.com");
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jsonOutput, setJsonOutput] = useState(null);

  // -------------------------
  // 1) GENERAR SALIDA (JSON)
  // -------------------------
  const handleGenerateOutput = async (e) => {
    e.preventDefault();
    setLoading(true);
    setJsonOutput(null);

    try {
      const formData = new FormData();

      const urls = urlsText
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      if (urls.length > 0) {
        formData.append("urls", JSON.stringify(urls));
      }

      if (csvFile) {
        formData.append("csv_file", csvFile);
      }

      formData.append("output", "json");

      const res = await axios.post("/api/tools/site-checker/", formData);

      setJsonOutput(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al verificar los sitios.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // 2) GENERAR CSV
  // -------------------------
  const handleDownloadCSV = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      const urls = urlsText
        .split("\n")
        .map((u) => u.trim())
        .filter((u) => u.length > 0);

      if (urls.length > 0) {
        formData.append("urls", JSON.stringify(urls));
      }

      if (csvFile) {
        formData.append("csv_file", csvFile);
      }

      const res = await axios.post("/api/tools/site-checker/", formData, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "site_check_results.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error al descargar CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>📡 Verificador de sitios web</h2>
      <p className="menu-card-desc">
        Comprueba disponibilidad del sitio y estado del certificado SSL usando tu script.
      </p>

      <div className="field">
        <label className="label">URLs (una por línea):</label>
        <textarea
          className="textarea"
          rows={5}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="label">O subir CSV con columna 'url':</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          className="button"
          onClick={handleGenerateOutput}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Generar salida"}
        </button>

        <button
          className="button button-secondary"
          onClick={handleDownloadCSV}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Generar CSV"}
        </button>
      </div>

      {jsonOutput && (
        <>
          <h4 style={{ marginTop: "1.5rem" }}>Resultados:</h4>
          <div className="result-box">
            {JSON.stringify(jsonOutput, null, 2)}
          </div>
        </>
      )}
    </div>
  );
}
