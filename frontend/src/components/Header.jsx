import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <div className="app-logo">⚙️ ToolHub</div>
        <span className="app-tagline">Backoffice de utilidades para desarrollo y ops</span>
      </div>
      <div className="app-header-right">
        <Link to="/" className="app-nav-link">
          Backoffice
        </Link>
        <a
          href="https://localhost"
          onClick={(e) => e.preventDefault()}
          className="app-nav-link"
        >
          Docs (próximamente)
        </a>
      </div>
    </header>
  );
}
