"use client";
import { useEffect, useState } from "react";

interface Compra {
  id: number;
  total: number;
  fecha: string;
}

interface Venta {
  id: number;
  total: number;
  fecha: string;
}

function ArchivadosPage() {
  const [archivedData, setArchivedData] = useState<{
    compras: Compra[];
    ventas: Venta[];
  }>({
    compras: [],
    ventas: [],
  });

  useEffect(() => {
    const fetchArchivedData = async () => {
      try {
        // Asegúrate de que la ruta coincida con la del endpoint en tu backend
        const response = await fetch("/api/archive");
        if (response.ok) {
          const data = await response.json();
          console.log("Datos archivados recibidos:", data); // Log para verificar los datos
          setArchivedData(data);
        } else {
          console.error("Error fetching archived data:", response.statusText);
        }
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
        {archivedData.compras.length > 0 ? (
          archivedData.compras.map((compra) => (
            <li key={compra.id}>
              Compra ID: {compra.id}, Total: {compra.total}, Fecha:{" "}
              {new Date(compra.fecha).toLocaleDateString()}
            </li>
          ))
        ) : (
          <p>No hay compras archivadas.</p>
        )}
      </ul>

      <h1>Ventas Archivadas</h1>
      <ul>
        {archivedData.ventas.length > 0 ? (
          archivedData.ventas.map((venta) => (
            <li key={venta.id}>
              Venta ID: {venta.id}, Total: {venta.total}, Fecha:{" "}
              {new Date(venta.fecha).toLocaleDateString()}
            </li>
          ))
        ) : (
          <p>No hay ventas archivadas.</p>
        )}
      </ul>
    </div>
  );
}

export default ArchivadosPage;
