"use client";
import { useEffect, useState } from "react";

interface Pago {
  id: number;
  monto: number;
  proveedorId: number;
  clienteId: number;
  movimientoId: number;
  createdAt: string;
  updatedAt: string;
}

const PagosPage = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [monto, setMonto] = useState<number>(0);
  const [proveedorId, setProveedorId] = useState<number | "">("");
  const [clienteId, setClienteId] = useState<number | "">("");
  const [movimientoId, setMovimientoId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch("/api/pagos"); // Cambia la URL según tu API
        if (!response.ok) {
          throw new Error("Error al obtener los pagos.");
        }
        const data = await response.json();
        setPagos(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error al obtener los pagos:", error.message);
          setError(error.message);
        } else {
          console.error("Error desconocido:", error);
          setError("Error desconocido al obtener los pagos.");
        }
      }
    };

    fetchPagos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      typeof monto !== "number" ||
      !proveedorId ||
      !clienteId ||
      !movimientoId
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monto, proveedorId, clienteId, movimientoId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el pago.");
      }

      const nuevoPago = await response.json();
      setPagos((prev) => [...prev, nuevoPago]);
      setMonto(0);
      setProveedorId("");
      setClienteId("");
      setMovimientoId("");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al crear el pago:", error.message);
        setError(error.message);
      } else {
        console.error("Error desconocido:", error);
        setError("Error desconocido al crear el pago.");
      }
    }
  };

  return (
    <div>
      <h1>Pagos</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Monto:</label>
          <input
            type='number'
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Proveedor ID:</label>
          <input
            type='number'
            value={proveedorId}
            onChange={(e) => setProveedorId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Cliente ID:</label>
          <input
            type='number'
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Movimiento ID:</label>
          <input
            type='number'
            value={movimientoId}
            onChange={(e) => setMovimientoId(Number(e.target.value))}
            required
          />
        </div>
        <button type='submit'>Crear Pago</button>
      </form>

      <h2>Lista de Pagos</h2>
      <ul>
        {pagos.map((pago) => (
          <li key={pago.id}>
            Monto: {pago.monto}, Proveedor ID: {pago.proveedorId}, Cliente ID:{" "}
            {pago.clienteId}, Movimiento ID: {pago.movimientoId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagosPage;
