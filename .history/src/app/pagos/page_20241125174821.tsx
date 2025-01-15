"use client";
import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  tipo: string; // "compra" o "venta"
  monto: number;
  proveedorId: number; // Suponiendo que tienes un proveedor asociado
  createdAt: string;
}

interface Pago {
  id: number;
  monto: number;
  proveedorId: number;
  tipoPago: string; // "recibido" o "emitido"
  createdAt: string;
  updatedAt: string;
}

const PagosPage = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [monto, setMonto] = useState<number>(0);
  const [proveedorId, setProveedorId] = useState<number | "">("");
  const [tipoPago, setTipoPago] = useState<string>("recibido");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      // Lógica para obtener pagos
    };

    const fetchMovimientos = async () => {
      // Lógica para obtener movimientos
    };

    fetchPagos();
    fetchMovimientos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (typeof monto !== "number" || !proveedorId) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monto, proveedorId, tipoPago }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el pago.");
      }

      const nuevoPago = await response.json();
      setPagos((prev) => [...prev, nuevoPago]);
      setMonto(0);
      setProveedorId("");
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Gestión de Pagos</h1>

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
            Tipo de Pago:
          </label>
          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value='recibido'>Pago Recibido</option>
            <option value='emitido'>Pago Emitido</option>
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
            <span className='font-semibold'>{pago.proveedorId}</span>, Tipo de
            Pago: <span className='font-semibold'>{pago.tipoPago}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagosPage;
