import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    tool: "",
    endpoint: "",
    ip: ""
  });

  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({});

  const fetchLogs = async () => {
    const params = {
      page,
      tool: filters.tool || undefined,
      endpoint: filters.endpoint || undefined,
      ip: filters.ip || undefined
    };

    const res = await axios.get("/api/tools/logs/", { params });
    setLogs(res.data.results);
    setPageInfo({
      count: res.data.count,
      next: res.data.next,
      previous: res.data.previous
    });
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    await axios.delete(`/api/tools/logs/${id}/`);
    fetchLogs();
  };

  const applyFilters = () => {
    setPage(1);
    fetchLogs();
  };

  return (
    <div className="card">
      <h2>📜 Auditoría de ToolHub</h2>
      <p>Registros completos del uso de herramientas y API.</p>

      <div className="filters">
        <input
          placeholder="Tool"
          value={filters.tool}
          onChange={(e) => setFilters({ ...filters, tool: e.target.value })}
        />
        <input
          placeholder="Endpoint"
          value={filters.endpoint}
          onChange={(e) => setFilters({ ...filters, endpoint: e.target.value })}
        />
        <input
          placeholder="IP"
          value={filters.ip}
          onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
        />

        <button onClick={applyFilters}>Filtrar</button>
      </div>

      <table className="audit-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tool</th>
            <th>Endpoint</th>
            <th>IP</th>
            <th>Status</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.tool_name}</td>
              <td>{log.endpoint}</td>
              <td>{log.ip_address}</td>
              <td>{log.status_code}</td>
              <td>{log.created_at}</td>
              <td>
                <button onClick={() => handleDelete(log.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={!pageInfo.previous} onClick={() => setPage(page - 1)}>
          ⬅ Anterior
        </button>
        <button disabled={!pageInfo.next} onClick={() => setPage(page + 1)}>
          Siguiente ➡
        </button>
      </div>
    </div>
  );
}
