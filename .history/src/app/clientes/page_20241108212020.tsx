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
        if (response.data && Array.isArray(response.data)) {
          setClientes(response.data);
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
    if (clienteEditando) {
      // Editar cliente existente
      try {
        const response = await updateClient(clienteEditando.id, nuevoCliente);
        setClientes(clientes.map(cliente => (cliente.id === response.data.id ? response.data : cliente)));
        setClienteEditando(null);
        setNuevoCliente({ razonSocial: "", direccion: "", cuit: "", zona: "" });
        alert("Cliente actualizado con éxito.");
      } catch (err) {
       