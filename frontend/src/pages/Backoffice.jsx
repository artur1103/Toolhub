import React from "react";
import { Link } from "react-router-dom";

export default function Backoffice() {
  const tools = [
    {
      path: "/tools/scraper",
      title: "Web Scraping de etiquetas",
      desc: "Cuenta etiquetas específicas en uno o varios sitios. Soporta entrada por CSV.",
      badge: "Scraping / HTML",
      emoji: "🕷️",
    },
    {
      path: "/tools/formatter",
      title: "Formateador JSON / XML / YAML",
      desc: "Limpia y formatea estructuras para depuración y documentación.",
      badge: "Parsing / Pretty-print",
      emoji: "🧹",
    },
    {
      path: "/tools/hash",
      title: "Convertidor de Hash",
      desc: "Obtén MD5, SHA256 y bcrypt para un texto dado.",
      badge: "Seguridad / Hashing",
      emoji: "🔐",
    },
    {
      path: "/tools/jwt",
      title: "Generador de JWT",
      desc: "Genera tokens JWT firmados con payload y expiración personalizados.",
      badge: "Auth / Tokens",
      emoji: "🎫",
    },
    {
      path: "/tools/test-matrix",
      title: "Matriz de pruebas",
      desc: "Genera combinaciones de casos de prueba a partir de dimensiones.",
      badge: "QA / Testing",
      emoji: "📊",
    },
    {
      path: "/tools/site-checker",
      title: "Verificador de sitios",
      desc: "Valida disponibilidad de sitios y obtiene información del certificado.",
      badge: "Monitoreo / Health-check",
      emoji: "📡",
    },
    {
      path: "/tools/audit",
      title: "Audítoria",
      desc: "Ver todo el historial de uso y peticiones.",
      badge: "Audítoria / BD",
      emoji: "📜",
    }
  ];

  return (
    <div className="card">
      <h2>Panel de herramientas</h2>
      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
        Elige una herramienta para trabajar con endpoints, datos o monitoreo. Cada módulo
        está pensado para ser reutilizable en distintos proyectos.
      </p>

      <div className="grid-menu">
        {tools.map((tool) => (
          <Link key={tool.path} to={tool.path} className="menu-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="menu-card-title">
                {tool.emoji} {tool.title}
              </span>
              <span className="badge">{tool.badge}</span>
            </div>
            <p className="menu-card-desc">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
