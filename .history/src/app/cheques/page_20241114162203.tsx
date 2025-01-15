"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ChequeDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Obtener el ID del cheque de la URL
  const [cheque, setCheque] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Función para obtener los detalles del cheque
      const fetchCheque = async () => {
        try {
          const response = await fetch(`/api/cheques/${id}`);
          if (!response.ok) {
            throw new Error("Error al obtener el cheque");
          }
          const data = await response.json();
          setCheque(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchCheque();
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cheque) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Detalles del Cheque</h1>
      <p>ID: {cheque.id}</p>
      <p>Fecha: {new Date(cheque.fecha).toLocaleDateString()}</p>
      <p>Monto: ${cheque.monto.toFixed(2)}</p>
      <p>Cliente ID: {cheque.clienteId}</p>
      <p>Proveedor ID: {cheque.proveedorId}</p>
      {/* Agrega más campos según sea necesario */}
      <button onClick={() => router.push("/cheques")}>
        Volver a la lista de cheques
      </button>
    </div>
  );
};

export default ChequeDetailPage;
