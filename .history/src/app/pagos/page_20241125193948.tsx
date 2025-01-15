"use client";
import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  tipo: string; // "compra" o "venta"
  monto: number;
  createdAt: string;
}

interface Pago {
  id: number;
  monto: number;
  movimientoId: number;
  createdAt: string;
  updatedAt: string;
}

const PagosPage = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [monto, setMonto] = useState<number>(0);
  const [movimientoId, setMovimientoId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch("/api/pagos");
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

    const fetchMovimientos = async () => {
      try {
        const response = await fetch("/api/movimientos");
        if (!response.ok) {
          throw new Error("Error al obtener los movimientos.");
        }
        const data = await response.json();
        setMovimientos(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error al obtener los movimientos:", error.message);
          setError(error.message);
        } else {
          console.error("Error desconocido:", error);
          setError("Error desconocido al obtener los movimientos.");
        }
      }
    };

    fetchPagos();
    fetchMovimientos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Verificar que el monto sea positivo y que el movimientoId esté presente
    if (monto <= 0 || movimientoId === "") {
      setError("El monto debe ser positivo y el movimientoId es obligatorio.");
      return;
    }

    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monto, movimientoId }), // Solo incluir monto y movimientoId
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el pago.");
      }

      const nuevoPago = await response.json();
      setPagos((prev) => [...prev, nuevoPago]);
      setMonto(0);
      setMovimientoId(""); // Resetear movimientoId
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
        <input
          type='number'
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          placeholder='Monto'
          required
        />
        <select
          value={movimientoId}
          onChange={(e) => setMovimientoId(Number(e.target.value))}
          required
        >
          <option value=''>Selecciona un movimiento</option>
          {movimientos.map((movimiento) => (
            <option key={movimiento.id} value={movimiento.id}>
              {movimiento.tipo} - {movimiento.monto}
            </option>
          ))}
        </select>
        <button type='submit'>Crear Pago</button>
      </form>
      <ul>
        {pagos.map((pago) => (
          <li key={pago.id}>
            Monto: {pago.monto}, Movimiento ID: {pago.movimientoId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagosPage;
