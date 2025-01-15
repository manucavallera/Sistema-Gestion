"use client";
import { useEffect, useState } from "react";

interface Venta {
  id: number;
  fecha: string;
  total: number;
  clienteId: number;
}

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono: string;
  email: string;
  saldo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

const VentasPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [razonSocial, setRazonSocial] = useState<string>(""); // Cambiado a razonSocial
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasResponse, clientesResponse] = await Promise.all([
          fetch("/api/ventas"),
          fetch("/api/clientes"),
        ]);

        if (!ventasResponse.ok) {
          throw new Error("Error al cargar las ventas");
        }
        if (!clientesResponse.ok) {
          throw new Error("Error al cargar los clientes");
        }

        const ventasData = await ventasResponse.json();
        const clientesData = await clientesResponse.json();

        setVentas(ventasData.ventas || []);
        setClientes(clientesData.clientes || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Buscar el cliente por razon social
    const cliente = clientes.find(
      (cliente) => cliente.razonSocial === razonSocial
    );

    if (!cliente) {
      setError("Cliente no encontrado");
      return;
    }

    const response = await fetch("/api/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ total, clienteId: cliente.id }), // Usar cliente.id
    });

    if (response.ok) {
      const nuevaVenta = await response.json();
      setVentas((prev) => [...prev, nuevaVenta]);
      setTotal(0);
      setRazonSocial(""); // Reiniciar a string vacío
    } else {
      console.error("Error al crear la venta");
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Ventas</h1>
      {error && <p className='text-red-500'>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className='mb-6 bg-white p-4 rounded shadow-md'
      >
        <div className='mb-4'>
          <label
            htmlFor='total'
            className='block text-sm font-medium text-gray-700'
          >
            Total:
          </label>
          <input
            type='number'
            id='total'
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='razonSocial'
            className='block text-sm font-medium text-gray-700'
          >
            Razon Social del Cliente:
          </label>
          <input
            type='text'
            id='razonSocial'
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'
        >
          Crear Venta
        </button>
      </form>

      <h2 className='text-xl font-semibold mb-2'>Lista de Ventas</h2>
      <ul className='bg-white rounded shadow-md'>
        {ventas.length > 0 ? (
          ventas.map((venta) => (
            <li key={venta.id} className='border-b last:border-b-0 p-4'>
              {new Date(venta.fecha).toLocaleDateString()} - Total: $
              {venta.total} - Cliente ID: {venta.clienteId}
            </li>
          ))
        ) : (
          <li className='p-4'>No hay ventas registradas.</li>
        )}
      </ul>
    </div>
  );
};

export default VentasPage;
