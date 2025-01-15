"use client";
import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  tipo: string; // "compra" o "venta"
  monto: number;
  proveedorId: number; // Suponiendo que tienes un proveedor asociado
  clienteId: number; // Suponiendo que tienes un cliente asociado
  createdAt: string;
}

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
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [monto, setMonto] = useState<number>(0);
  const [proveedorId, setProveedorId] = useState<number | "">("");
  const [clienteId, setClienteId] = useState<number | "">("");
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
        const response = await fetch("/api/movimientos"); // Cambia la URL según tu API
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
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-3 xl font-bold mb-4'>Gestión de Pagos</h1>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Monto:
          </label>
          <input
            type='number'
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Proveedor ID:
          </label>
          <input
            type='number'
            value={proveedorId}
            onChange={(e) => setProveedorId(Number(e.target.value))}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Cliente ID:
          </label>
          <input
            type='number'
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Movimiento ID:
          </label>
          <select
            value={movimientoId}
            onChange={(e) => setMovimientoId(Number(e.target.value))}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value=''>Selecciona un movimiento</option>
            {movimientos.map((movimiento) => (
              <option key={movimiento.id} value={movimiento.id}>
                {movimiento.tipo} - Monto: {movimiento.monto}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Crear Pago
        </button>
      </form>

      <h2 className='text-2xl font-bold mb-2'>Lista de Pagos</h2>
      <ul className='list-disc pl-5'>
        {pagos.map((pago) => (
          <li key={pago.id} className='mb-2'>
            Monto: <span className='font-semibold'>{pago.monto}</span>,
            Proveedor ID:{" "}
            <span className='font-semibold'>{pago.proveedorId}</span>, Cliente
            ID: <span className='font-semibold'>{pago.clienteId}</span>,
            Movimiento ID:{" "}
            <span className='font-semibold'>{pago.movimientoId}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagosPage;
