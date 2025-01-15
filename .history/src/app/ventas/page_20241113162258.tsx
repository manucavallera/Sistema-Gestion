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
}

const VentasPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [clienteId, setClienteId] = useState<number>(0);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ventasResponse = await fetch("/api/ventas");
      const clientesResponse = await fetch("/api/clientes");

      const ventasData = await ventasResponse.json();
      const clientesData = await clientesResponse.json();

      setVentas(ventasData.ventas);
      setClientes(clientesData.clientes);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ total, clienteId }),
    });

    if (response.ok) {
      const nuevaVenta = await response.json();
      setVentas((prev) => [...prev, nuevaVenta]);
      setTotal(0);
      setClienteId(0);
    } else {
      console.error("Error al crear la venta");
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Ventas</h1>

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
            htmlFor='clienteId'
            className='block text-sm font-medium text-gray-700'
          >
            Cliente:
          </label>
          <select
            id='clienteId'
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500'
          >
            <option value=''>Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </option>
            ))}
          </select>
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
        {ventas.map((venta) => (
          <li key={venta.id} className='border-b last:border-b-0 p-4'>
            {new Date(venta.fecha).toLocaleDateString()} - Total: ${venta.total}{" "}
            - Cliente ID: {venta.clienteId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VentasPage;
