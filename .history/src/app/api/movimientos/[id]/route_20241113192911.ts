"use client";
import React, { useState, useEffect } from "react";

// Tipo para los movimientos
interface Movement {
  id: number;
  clienteId: number;
  proveedorId?: number;
  monto: number;
  tipo: "ingreso" | "egreso";
}

const MovementsPage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState<Omit<Movement, "id">>({
    clienteId: 0,
    proveedorId: undefined,
    monto: 0,
    tipo: "ingreso",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar los movimientos cuando se monta el componente
  useEffect(() => {
    const cargarMovimientos = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/movimientos");
        if (!response.ok) throw new Error("Error al cargar los movimientos");
        const data = await response.json();
        setMovimientos(data);
      } catch (err) {
        setError("Error al cargar los movimientos");
      } finally {
        setLoading(false);
      }
    };
    cargarMovimientos();
  }, []);

  // Manejar el registro de un nuevo movimiento
  const handleAgregarMovimiento = async () => {
    if (nuevoMovimiento.monto <= 0 || nuevoMovimiento.clienteId <= 0 || !nuevoMovimiento.tipo) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/movimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoMovimiento),
      });

      if (!response.ok) throw new Error("Error al agregar el movimiento");

      const movimientoCreado = await response.json();
      setMovimientos([...movimientos, movimientoCreado]);
      setNuevoMovimiento({ clienteId: 0, proveedorId: undefined, monto: 0, tipo: "ingreso" });
          setSuccessMessage("Movimiento agregado exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000); // Limpiar mensaje después de 3 segundos
    } catch (err) {
      setError("Error al agregar el movimiento: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación de movimiento
  const handleEliminarMovimiento = async (id: number) => {
    setLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const response = await fetch(`/api/movimientos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el movimiento");

      setMovimientos(movimientos.filter((movimiento) => movimiento.id !== id));
      setSuccessMessage("Movimiento eliminado exitosamente.");
      setTimeout(() => setSuccessMessage(null), 3000); // Limpiar mensaje después de 3 segundos
    } catch (err) {
      setError("Error al eliminar el movimiento: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Movimientos de Cuenta Corriente</h1>

      {/* Muestra mensaje de error */}
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {successMessage && <div className='text-green-500 mb-4'>{successMessage}</div>}

      {/* Formulario para agregar un nuevo movimiento */}
      <div className='mb-4'>
        <input
          type='number'
          placeholder='Cliente ID'
          value={nuevoMovimiento.clienteId}
          onChange={(e) =>
            setNuevoMovimiento({ ...nuevoMovimiento, clienteId: +e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        />
        <input
          type='number'
          placeholder='Proveedor ID (opcional)'
          value={nuevoMovimiento.proveedorId || ""}
          onChange={(e) =>
            setNuevoMovimiento({ ...nuevoMovimiento, proveedorId: e.target.value ? +e.target.value : undefined })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        />
        <input
          type='number'
          placeholder='Monto'
          value={nuevoMovimiento.monto}
          onChange={(e) =>
            setNuevoMovimiento({ ...nuevoMovimiento, monto: +e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        />
        <select
          value={nuevoMovimiento.tipo}
          onChange={(e) =>
            setNuevoMovimiento({
              ...nuevoMovimiento,
              tipo: e.target.value as "ingreso" | "egreso",
            })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        >
          <option value='ingreso'>Ingreso</option>
          <option value='egreso'>Egreso</option>
        </select>
        <button
          onClick={handleAgregarMovimiento}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
        >
          Agregar Movimiento
        </button>
      </div>

      {/* Muestra cargando mientras se obtienen los movimientos */}
      {loading && <div className='text-blue-500'>Cargando...</div>}

      {/* Lista de movimientos */}
      <table className='min-w-full border border-gray-200'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2'>Cliente ID</th>
            <th className='px-4 py-2'>Proveedor ID</th>
            <th className='px-4 py-2'>Monto</th>
            <th className='px-4 py-2'>Tipo</th>
            <th className='px-4 py-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td className='px-4 py-2'>{movimiento.clienteId}</td>
              <td className='px-4 py-2'>{movimiento.proveedorId || "N/A"}</td>
              <td className='px-4 py-2'>{movimiento.monto}</td>
              <td className='px-4 py-2'>{movimiento.tipo}</td>
              <td class