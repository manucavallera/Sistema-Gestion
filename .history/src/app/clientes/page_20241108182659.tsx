import React, { useEffect, useState } from 'react';
import { getAllClients, saveClient, deleteClient } from './api'; // Asegúrate de que estas funciones estén correctamente importadas

type Cliente = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
};

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    id: 0,
    razonSocial: '',
    direccion: '',
    cuit: '',
    zona: '',
  });
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const response = await getAllClients();
      if (Array.isArray(response)) {
        setClientes(response);
      } else {
        setError("La respuesta de la API no es un arreglo.");
      }
    } catch (err) {
      console.error("Error al cargar los clientes:", err);
      setError("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  const guardarCliente = async () => {
    setLoading(true);
    try {
      await saveClient(nuevoCliente);
      setClientes((prev) => [...prev, nuevoCliente]);
      setNuevoCliente({ id: 0, razonSocial: '', direccion: '', cuit: '', zona: '' });
      setError(null);
      setClienteEditando(null);
    } catch (err) {
      console.error("Error al guardar el cliente:", err);
      setError("Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const eliminarCliente = async (id: number) => {
    setLoading(true);
    try {
      await deleteClient(id);
      setClientes((prev) => prev.filter(cliente => cliente.id !== id));
    } catch (err) {
      console.error("Error al eliminar el cliente:", err);
      setError("Error al eliminar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (cliente: Cliente) => {
    setNuevoCliente(cliente);
    setClienteEditando(cliente);
    setError(null);
  };

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
            setNuevoCliente((prev) => ({ ...prev, razonSocial: e.target.value }))
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
          onChange={(e