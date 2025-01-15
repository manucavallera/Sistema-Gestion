"use client";

import { useEffect, useState } from "react";

function ArchivadosPage() {
  const [archivedData, setArchivedData] = useState({ compras: [], ventas: [] });

  useEffect(() => {
    const fetchArchivedData = async () => {
      try {
        const response = await fetch("/api/archive");
        const data = await response.json();
        setArchivedData(data);
      } catch (error) {
        console.error("Error fetching archived data:", error);
      }
    };

    fetchArchivedData();
  }, []);

  return (
    <div>
      <h1>Compras Archivadas</h1>
      <ul>
        {archivedData.compras.map((compra) => (
          <li
            key={compra.id}
          >{`Compra ID: ${compra.id}, Total: ${compra.total}`}</li>
        ))}
      </ul>

      <h1>Ventas Archivadas</h1>
      <ul>
        {archivedData.ventas.map((venta) => (
          <li
            key={venta.id}
          >{`Venta ID: ${venta.id}, Total: ${venta.total}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default ArchivadosPage;
