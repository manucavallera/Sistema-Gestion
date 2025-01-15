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
  const [cliente, setCliente] = useState<Omit<Cliente, "id">>({
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
      setError(null);
      try {
        const response = await getAllClients();
        if (response.data && Array.isArray(response.data)) {
          setClientes(response.data);
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
    if (clienteEditando) {
      // Editar cliente existente
      try {
        const response = await updateClient(clienteEditando.id, cliente);
        if (response.data) {
          setClientes((prevClientes) =>
            prevClientes.map((c) =>
              c.id === response.data.id ? response.data : c
            )
          );
          alert("Cliente actualizado con éxito.");
        }
        setClienteEditando(null);
        resetForm();
      } catch (err) {
        setError(
          "Error al actualizar el cliente: " +
            (err instanceof Error ? err.message : "Error desconocido")
        );
      }
    } else {
      // Agregar nuevo cliente
      try {
        const response = await createClient(cliente);
        if (response.data) {
          setClientes((prevClientes) => [...prevClientes, response.data]);
          alert("Cliente agregado con éxito.");
        }
        resetForm();
      } catch (err) {
        setError(
          "Error al agregar el cliente: " +
            (err instanceof Error ? err.message : "Error desconocido")
        );
      }
    }
  };

  const resetForm = () => {
    setCliente({ razonSocial: "", direccion: "", cuit: "", zona: "" });
  };

  const iniciarEdicion = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setCliente({
      razonSocial: cliente.razonSocial,
      direccion: cliente.direccion,
      cuit: cliente.cuit,
      zona: cliente.zona,
    });
  };

  const confirmarEliminacion = async (id: number) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );
    if (confirmacion) {
      try {
        await deleteClient(id);
        setClientes((prevClientes) => prevClientes.filter((c) => c.id !== id));
        alert("Cliente eliminado con éxito.");
      } catch (err) {
        setError(
          "Error al eliminar el cliente: " +
            (err instanceof Error ? err.message : "Error desconocido")
        );
      }
    }
  };

  return (
    <div className='p-4 bg-background'>
      <h1 className='text-2xl font-bold mb-4'>Lista de Clientes</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading && <div className='text-blue-500 mb-4'>Cargando...</div>}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Razón Social'
          value={cliente.razonSocial}
          onChange={(e) =>
            setCliente((prev) => ({
              ...prev,
              razonSocial: e.target.value,
            }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='text'
          placeholder='Dirección'
          value={cliente.direccion}
          onChange={(e) =>
            setCliente((prev) => ({
              ...prev,
              direccion: e.target.value,
            }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='text'
          placeholder='CUIT'
          value={cliente.cuit}
          onChange={(e) =>
            setCliente((prev) => ({
              ...prev,
              cuit: e.target.value,
            }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input
          type='text'
          placeholder='Zona'
          value={cliente.zona}
          onChange={(e) =>
            setCliente((prev) => ({
              ...prev,
              zona: e.target.value,
            }))
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={guardarCliente}
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          {clienteEditando ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
      </div>
      <ul>
        {clientes.map((cliente) => (
          <li
            key={cliente.id}
            className='flex justify-between items-center mb-2'
          >
            <span>{cliente.razonSocial}</span>
            <div>
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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesPage;
