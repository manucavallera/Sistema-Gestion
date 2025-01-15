// archivados/page.tsx
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
        const response = await fetch("/api/archive");
        if (response.ok) {
          const data = await response.json();
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
        {archivedData.compras.map((compra) => (
          <li key={compra.id}>
            Compra ID: {compra.id}, Total: {compra.total}, Fecha:{" "}
            {new Date(compra.fecha).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h1>Ventas Archivadas</h1>
      <ul>
        {archivedData.ventas.map((venta) => (
          <li key={venta.id}>
            Venta ID: {venta.id}, Total: {venta.total}, Fecha:{" "}
            {new Date(venta.fecha).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArchivadosPage;
