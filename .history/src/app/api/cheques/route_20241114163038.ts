"use client";
import { useEffect, useState } from "react";

interface Cheque {
  id: number;
  fecha: string;
  monto: number;
  clienteId: number;
  proveedorId: number;
}

const ChequeList = () => {
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheques = async () => {
      console.log("Iniciando la solicitud para obtener cheques");
      try {
        const response = await fetch("/api/cheques");
        console.log("Respuesta de la API:", response);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }
        const data = await response.json();
        console.log("Cheques obtenidos:", data);
        setCheques(data);
      } catch (error) {
        console.error("Error al obtener los cheques:", error);
        setError((error as Error).message);
      }
    };

    fetchCheques();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (cheques.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Lista de Cheques</h1>
      <ul>
        {cheques.map((cheque) => (
          <li key={cheque.id}>
            <p>ID: {cheque.id}</p>
            <p>Fecha: {new Date(cheque.fecha).toLocaleDateString()}</p>
            <p>Monto: ${cheque.monto.toFixed(2)}</p>
            <p>Cliente ID: {cheque.clienteId}</p>
            <p>Proveedor ID: {cheque.proveedorId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChequeList;
