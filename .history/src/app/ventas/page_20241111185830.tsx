"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
} from "../../services/salesService";
import { format } from "date-fns";

interface Venta {
  id: number;
  clienteId: number;
  monto: number;
  fecha: string;
}

interface Cliente {
  id: number;
  razonSocial: string;
}

const VentasPage: React.FC = (): JSX.Element => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [nuevaVenta, setNuevaVenta] = useState<Omit<Venta, "id">>({
    clienteId: 0,
    monto: 0,
    fecha: "",
  });
  const [ventaEditando, setVentaEditando] = useState<Venta | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cargarVentasYClientes = async () => {
      setLoading(true);
      try {
        const [ventasResponse, clientesResponse] = await Promise.all([
          getAllSales(),
          axios.get("/api/clientes"),
        ]);
        // Asegúrate de que la respuesta de ventas sea un array
        if (Array.isArray(ventasResponse)) {
          setVentas(ventasResponse);
        } else {
          setError("Error: La respuesta de ventas no es un array.");
        }
        setClientes(clientesResponse.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || "Error al cargar las ventas o los clientes"
          );
        } else {
          setError("Error desconocido al cargar los datos");
        }
      } finally {
        setLoading(false);
      }
    };
    cargarVentasYClientes();
  }, []);

  const guardarVenta = async () => {
    if (!nuevaVenta.clienteId || nuevaVenta.monto <= 0 || !nuevaVenta.fecha) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (ventaEditando) {
        const response = await updateSale(ventaEditando.id, nuevaVenta);
        const updatedVenta = response.data;
        setVentas(
          ventas.map((venta) =>
            venta.id === updatedVenta.id ? updatedVenta : venta
          )
        );
      } else {
        const response = await createSale(nuevaVenta);
        const ventaCreada = response.data;
        setVentas([...ventas, ventaCreada]);
      }
      setNuevaVenta({ clienteId: 0, monto: 0, fecha: "" });
      setVentaEditando(null);
    } catch (err) {
      setError("Error al guardar la venta");
    } finally {
      setLoading(false);
    }
  };

  const eliminarVenta = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      setLoading(true);
      try {
        await deleteSale(id);
        setVentas(ventas.filter((venta) => venta.id !== id));
      } catch (err) {
        setError("Error al eliminar la venta");
      } finally {
        setLoading(false);
      }
    }
  };

  const iniciarEdicion = (venta: Venta) => {
    setNuevaVenta(venta);
    setVentaEditando(venta);
    setError(null);
  };

  return (
    <div className='p-4 bg-background'>
      <h1 className='text-2xl font-bold mb-4'>Lista de Ventas</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading && <div className='text-blue-500 mb-4'>Cargando...</div>}
      <div className='mb-4'>
        <select
          value={nuevaVenta.clienteId}
          onChange={(e) =>
            set NuevaVenta({ ...nuevaVenta, clienteId: +e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          <option value='0'>Selecciona un cliente</option>
          {Array.isArray(clientes) && clientes.length > 0 ? (
            clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </option>
            ))
          ) : (
            <option value='0' disabled>
              No hay clientes disponibles
            </option>
          )}
        </select>
        <input
          type='number'
          value={nuevaVenta.monto}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, monto: +e.target.value })
          }
          placeholder='Monto'
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:border-blue-500'
        />
        <input
          type='datetime-local'
          value={nuevaVenta.fecha}
          onChange={(e) =>
            setNuevaVenta({ ...nuevaVenta, fecha: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:border-blue-500'
        />
        <button
          onClick={guardarVenta}
          disabled={loading}
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          {ventaEditando ? "Actualizar Venta" : "Agregar Venta"}
        </button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead>
          <tr>
            <th className='border border-gray-300 p-2'>Cliente</th>
            <th className='border border-gray-300 p-2'>Monto</th>
            <th className='border border-gray-300 p-2'>Fecha</th>
            <th className='border border-gray-300 p-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ventas) && ventas.map((venta) => {
            const cliente = Array.isArray(clientes)
              ? clientes.find((c) => c.id === venta.clienteId)
              : null;
            return (
              <tr key={venta.id}>
                <td className='border border-gray-300 p-2'>
                  {cliente ? cliente.razonSocial : "Cliente no encontrado"}
                </td>
                <td className='border border-gray-300 p-2'>{venta.monto}</td>
                <td className='border border-gray-300 p-2'>
                  {format(new Date(venta.fecha), "dd/MM/yyyy HH:mm")}
                </td>
                <td className='border border-gray-300 p-2'>
                  <button
                    onClick={() => iniciarEdicion(venta)}
                    className='text-blue-500'
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarVenta(venta.id)}
                    className='text-red-500 ml-2'
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VentasPage;