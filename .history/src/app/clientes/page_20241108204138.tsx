"use client";
import React, { useState, useEffect } from "react";
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/clientService";

// Definir el tipo para un cliente
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

  // Cargar clientes desde la API al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      setLoading(true);
      try {
        const response = await getAllClients();
        setClientes(response);
      } catch (err) {
        setError("Error al cargar los clientes: " + (err instanceof Error ? err.message : "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };
    cargarClientes();
  }, []);

  // Validar el formato del CUIT
  const esCuitValido = (cuit: string) => {
    return /^\d{2}-\d{8}-\d{1}$/.test(cuit);
  };

  // Función para guardar un cliente nuevo o editado
  const guardarCliente = async () => {
    if (
      nuevoCliente.razonSocial &&
      nuevoCliente.direccion &&
      esCuitValido(nuevoCliente.cuit) &&
      nuevoCliente.zona
    ) {
      setError(null);
      setLoading(true);
      try {
        if (clienteEditando) {
          // Editar cliente existente
          const updatedCliente = await updateClient(clienteEditando.id, nuevoCliente);
          setClientes((prevClientes) =>
            prevClientes.map((cliente) => (cliente.id === updatedCliente.id ? updatedCliente : cliente))
          );
        } else {
          // Agregar nuevo cliente
          const clienteCreado = await createClient(nuevoCliente);
          setClientes((prevClientes) => [...prevClientes, clienteCreado]);
        }

        // Reiniciar el formulario
        setNuevoCliente({ razonSocial: "", direccion: "", cuit: "", zona: "" });
        setClienteEditando(null);
      } catch (err) {
        console.error("Error al guardar el cliente:", err);
        setError("Error al guardar el cliente: " + (err instanceof Error ? err.message : "Error desconocido"));
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.");
    }
  };

  // Función para eliminar un cliente
  const eliminarCliente = async (id: number) => {
    setLoading(true);
    try {
      await deleteClient(id);
      setClientes((prevClientes) => prevClientes.filter((cliente) => cliente.id !== id));
    } catch (err) {
      console.error("Error al eliminar el cliente:", err);
      setError("Error al eliminar el cliente: "      setError("Error al eliminar el cliente: " + (err instanceof Error ? err.message : "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  // Iniciar la edición de un cliente
  const iniciarEdicion = (cliente: Cliente) => {
    setNuevoCliente(cliente);
    setClienteEditando(cliente);
    setError(null);
  };

  // Confirmación antes de eliminar
  const confirmarEliminacion = (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      eliminarCliente(id);
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
              <td colSpan={5} className='