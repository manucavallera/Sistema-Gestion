import {
  getArchivedCompras,
  getArchivedVentas,
} from "@/app/services/dataService";
import { useEffect, useState } from "react";

const ArchivosPage = () => {
  const [comprasArchivadas, setComprasArchivadas] = useState([]);
  const [ventasArchivadas, setVentasArchivadas] = useState([]);

  useEffect(() => {
    const fetchArchivedData = async () => {
      try {
        const compras = await getArchivedCompras();
        const ventas = await getArchivedVentas();
        setComprasArchivadas(compras);
        setVentasArchivadas(ventas);
      } catch (error) {
        console.error("Error fetching archived data:", error);
      }
    };

    fetchArchivedData();
  }, []);

  return (
    <div>
      <h1>Archivos Antiguos</h1>

      <h2>Compras Archivadas</h2>
      <ul>
        {comprasArchivadas.map((compra) => (
          <li key={compra.id}>
            Fecha: {new Date(compra.fecha).toLocaleDateString()}, Total:{" "}
            {compra.total}
          </li>
        ))}
      </ul>

      <h2>Ventas Archivadas</h2>
      <ul>
        {ventasArchivadas.map((venta) => (
          <li key={venta.id}>
            Fecha: {new Date(venta.fecha).toLocaleDateString()}, Total:{" "}
            {venta.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArchivosPage;
