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
        setError("Error al cargar los clientes");
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
          setClientes(clientes.map((cliente) => (cliente.id === updatedCliente.id ? updatedCliente : cliente)));
        } else {
          // Agregar nuevo cliente
          const clienteCreado = await createClient(nuevoCliente);
          setClientes([...clientes, clienteCreado]);
        }

        // Reiniciar el formulario
        setNuevoCliente({ razonSocial: "", direccion: "", cuit: "", zona: "" });
        setClienteEditando(null);
      } catch (err) {
        console.error("Error al guardar el cliente:", err);
        setError("Error al guardar el cliente");
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
      setClientes(clientes.filter((cliente)