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
        setError("Error al cargar los clientes: " + (err instanceof Error ? err.message : "Error desconocido"));
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