"use client";
import React, { useState, useEffect } from "react";
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/clientService";

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
}

const ClientesPage: React.FC = (): JSX.Element => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevoCliente, setNuevoCliente] = useState<Omit<Cliente, "id">>({
    razonSocial: "",
    direccion: "",
    cuit: "",
    zona: "",
  });
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const response = await getAllClients();
        console.log("Respuesta de la API:", response);
        if (response.data && Array.isArray(response.data)) {
          setClientes(response.data);
          console.log("Clientes cargados:", response.data); // Verifica los clientes
        } else {
          setError("La respuesta de la API no contiene un array de clientes.");
        }
      } catch (err) {
        setError(
          "Error al cargar los clientes: " +
            (err instanceof Error ? err.message : "Error desconocido")
        );
      } finally {
        setLoading(false);
      }
    };
    cargarClientes();
  }, []);

  const guardarCliente = async () => {
    // ... (código existente)
  };

  const eliminarCliente = async (id: number) => {
    // ... (código existente)
  };

  const iniciarEdicion = (cliente: Cliente) => {
    // ... (código existente)
  };

  const confirmarEliminacion = (id: number) => {
    // ... (código existente)
  };

  return (
    <div className='p-4 bg-background'>
      <h1 className='text-2xl font-bold mb-4'>Lista de Clientes</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading && <div className='text-blue-500 mb-4'>Cargando...</div>}
      <div className='mb-4'>
        {" "}
        <input
          type='text'
          placeholder='Razón Social'
          value={nuevoCliente.razonSocial}
          onChange={(e) =>
            setNuevoCliente((prev) => ({
              ...prev,
              razonSocial: e.target.value,
            }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='text'
          placeholder='Dirección'
          value={nuevoCliente.direccion}
          onChange={(e) =>
            setNuevoCliente((prev) => ({ ...prev, direccion: e.target.value }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='text'
          placeholder='CUIT'
          value={nuevoCliente.cuit}
          onChange={(e) =>
            setNuevoCliente((prev) => ({ ...prev, cuit: e.target.value }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='text'
          placeholder='Zona'
          value={nuevoCliente.zona}
          onChange={(e) =>
            setNuevoCliente((prev) => ({ ...prev, zona: e.target.value }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          onClick={guardarCliente}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
        >
          {clienteEditando ? "Editar" : "Agregar"}
        </button>
      </div>
      <table className='min-w-full border border-gray-200'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2'>Razón Social</th>
            <th className='px-4 py-2'>Dirección</th>
            <th className='px-4 py-2'>CUIT</th>
            <th className='px-4 py-2'>Zona</th>
            <th className='px-4 py-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id} className='hover:bg-gray-50'>
                <td className='px-4 py-2'>{cliente.razonSocial}</td>
                <td className='px-4 py-2'>{cliente.direccion}</td>
                <td className='px-4 py-2'>{cliente.cuit}</td>
                <td className='px-4 py-2'>{cliente.zona}</td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => iniciarEdicion(cliente)}
                    className='bg-yellow-500 text-white p-1 rounded-md mr-2'
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmarEliminacion(cliente.id)}
                    className='bg-red-500 text-white p-1 rounded-md'
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className='text-center py-4'>
                No hay clientes disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesPage;
