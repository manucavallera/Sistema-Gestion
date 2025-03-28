"use client";
import React, { useState, useEffect } from "react";

// Definimos las interfaces para Cliente y Venta
interface Cliente {
  id: string;
  razonSocial: string; // Cambiado a razón social
}

interface Venta {
  clienteId: string;
  razonSocial: string; // Agregado para mostrar la razón social en la lista
}

const VentasPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data: Cliente[] = await response.json();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cliente = clientes.find((c) => c.id === clienteSeleccionado);
    if (cliente) {
      const nuevaVenta: Venta = {
        clienteId: clienteSeleccionado,
        razonSocial: cliente.razonSocial, // Guardamos la razón social
      };
      setVentas([...ventas, nuevaVenta]);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Registrar Venta</h1>
      <form onSubmit={manejarEnvio} className='mb-4'>
        <label className='block mb-2'>
          Selecciona un Cliente:
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
          >
            <option value=''>Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial} {/* Mostramos la razón social */}
              </option>
            ))}
          </select>
        </label>
        <button
          type='submit'
          className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700'
        >
          Registrar Venta
        </button>
      </form>
      <h2 className='text-xl font-semibold mb-2'>Ventas Registradas</h2>
      <ul className='list-disc pl-5'>
        {ventas.map((venta, index) => (
          <li key={index}>
            Venta a Cliente: {venta.razonSocial}{" "}
            {/* Mostramos la razón social */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VentasPage;
