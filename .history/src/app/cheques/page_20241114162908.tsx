"use client";
import { useEffect, useState } from "react";

interface Cheque {
  id: number;
  fecha: string;
  monto: number;
  clienteId: number;
  proveedorId: number;
}

const ChequeDetailPage = ({ params }: { params: { id: string } }) => {
  const { id } = params; // Obtener el ID del cheque de los parámetros
  const [cheque, setCheque] = useState<Cheque | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheque = async () => {
      console.log("Iniciando la solicitud para obtener el cheque con ID:", id);
      try {
        const response = await fetch(`/api/cheques/${id}`);
        console.log("Respuesta de la API:", response);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }
        const data = await response.json();
        console.log("Datos del cheque:", data);
        setCheque(data);
      } catch (error) {
        console.error("Error al obtener el cheque:", error);
        setError((error as Error).message);
      }
    };

    if (id) {
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
      <button onClick={() => window.history.back()}>
        Volver a la lista de cheques
      </button>
    </div>
  );
};

export default ChequeDetailPage;
