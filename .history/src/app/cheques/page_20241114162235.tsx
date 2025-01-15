import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      {/* Agrega más campos según sea necesario */}
      <button onClick={() => router.push("/cheques")}>
        Volver a la lista de cheques
      </button>
    </div>
  );
};

export default ChequeDetailPage;
