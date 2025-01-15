"use client";
import React, { useState, useEffect } from "react";

// Definimos las interfaces para Cliente y Venta
interface Cliente {
  id: number; // ID del cliente
  razonSocial: string; // Razón social del cliente
  direccion: string; // Dirección del cliente
  cuit: string; // CUIT del cliente
  zona: string; // Zona del cliente
  telefono?: string; // Teléfono del cliente (opcional)
  email?: string; // Email del cliente (opcional)
  saldo: number; // Saldo del cliente
}

interface Venta {
  clienteId: number; // ID del cliente
  razonSocial: string; // Razón social del cliente
  fecha: string; // Fecha de la venta
  total: number; // Total de la venta
}

const VentasPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(
    null
  );
  const [totalVenta, setTotalVenta] = useState<number>(0); // Total de la venta
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
    if (clienteSeleccionado !== null) {
      const cliente = clientes.find((c) => c.id === clienteSeleccionado);
      if (cliente) {
        const nuevaVenta: Venta = {
          clienteId: clienteSeleccionado,
          razonSocial: cliente.razonSocial,
          fecha: new Date().toISOString(), // Fecha actual en formato ISO
          total: totalVenta, // Total de la venta
        };
        setVentas([...ventas, nuevaVenta]);
        setClienteSeleccionado(null); // Resetear selección después de registrar
        setTotalVenta(0); // Resetear total de venta
      }
    }
  };

  const editarVenta = (index: number) => {
    const ventaAEditar = ventas[index];
    setClienteSeleccionado(ventaAEditar.clienteId);
    setTotalVenta(ventaAEditar.total);
    // Eliminar la venta del estado para que no aparezca en la lista
    setVentas(ventas.filter((_, i) => i !== index));
  };

  const eliminarVenta = (index: number) => {
    setVentas(ventas.filter((_, i) => i !==