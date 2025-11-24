import React from "react";

export default function Footer() {
  return (
    <footer className="app-footer">
      ToolHub · Proyecto Django + React + Docker · {new Date().getFullYear()}
    </footer>
  );
}
