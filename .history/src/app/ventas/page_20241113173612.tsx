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
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
  const [totalVenta, setTotalVenta] = useState<number>(0); // Total de la venta
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaEditandoIndex, setVentaEditandoIndex] = useState<number | null>(null); // Para manejar la edición

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

        if (ventaEditandoIndex !== null) {
          // Si estamos editando, actualizamos la venta existente
          const ventasActualizadas = [...ventas];
          ventasActualizadas[ventaEditandoIndex] = nuevaVenta;
          setVentas(ventasActualizadas);
          setVentaEditandoIndex(null); // Resetear el índice de edición
        } else {
          // Si no estamos editando, añadimos una nueva venta
          setVentas([...ventas, nuevaVenta]);
        }

        // Resetear selección y total de venta
        setClienteSeleccionado(null);
        setTotalVenta(0);
      }
    }
  };

  const editarVenta = (index: number) => {
    const ventaAEditar = ventas[index];
    setClienteSeleccionado(ventaAEditar.clienteId);
    setTotalVenta(ventaAEditar.total);
    setVentaEditandoIndex(index); // Guardar el índice de la venta que se está editando
  };

  const eliminarVenta = (index: number) => {
    setVentas(ventas.filter((_, i) => i !== index));
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Registrar Venta</h1>
      <form onSubmit={manejarEnvio} className='mb-4'>
        <label className='block mb-2'>
          Selecciona un Cliente:
          <select
            value={clienteSeleccionado || ""}
            onChange={(e) => setClienteSeleccionado(Number(e.target.value))}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
          >
            <option value=''>Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial} - {cliente.cuit} - {cliente.telefono}
              </option>
            ))}
          </select>
        </label>
        <label className='block mb-2'>
          Total de la Venta:
          <input
            type='number'
            value={totalVenta}
            onChange