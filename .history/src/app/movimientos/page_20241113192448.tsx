"use client";
import React, { useState, useEffect } from "react";
import {
  getAllMovements,
  createMovement,
  deleteMovement, // Asegúrate de tener esta función en tu servicio
} from "../../services/movementService";

// Tipo para los movimientos
interface Movement {
  id: number; // Este es generado por la base de datos, no se debe pasar al crear
  clienteId?: number;
  proveedorId?: number;
  monto: number;
  tipo: "venta" | "compra" | "pago";
  fecha: string;
}

const MovementsPage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState<Omit<Movement, "id">>({
    monto: 0,
    tipo: "venta",
    fecha: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar los movimientos cuando se monta el componente
  useEffect(() => {
    const cargarMovimientos = async () => {
      setLoading(true);
      try {
        const data = await getAllMovements();
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
    if (nuevoMovimiento.monto <= 0 || !nuevoMovimiento.fecha) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    setLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const movimientoCreado = await createMovement(nuevoMovimiento);
      setMovimientos([...movimientos, movimientoCreado]);
      setNuevoMovimiento({ monto: 0, tipo: "venta", fecha: "" }); // Resetear el formulario
      setSuccessMessage("Movimiento agregado exitosamente.");
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
      await deleteMovement(id); // Asegúrate de implementar esta función en tu servicio
      setMovimientos(movimientos.filter((movimiento) => movimiento.id !== id));
      setSuccessMessage("Movimiento eliminado exitosamente.");
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
          placeholder='Monto'
          value={nuevoMovimiento.m          value={nuevoMovimiento.monto}
          onChange={(e) =>
            setNuevoMovimiento({ ...nuevoMovimiento, monto: +e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        />
        <input
          type='date'
          placeholder='Fecha'
          value={nuevoMovimiento.fecha}
          onChange={(e) =>
            setNuevoMovimiento({ ...nuevoMovimiento, fecha: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        />
        <select
          value={nuevoMovimiento.tipo}
          onChange={(e) =>
            setNuevoMovimiento({
              ...nuevoMovimiento,
              tipo: e.target.value as "venta" | "compra" | "pago",
            })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md'
        >
          <option value='venta'>Venta</option>
          <option value='compra'>Compra</option>
          <option value='pago'>Pago</option>
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
            <th className='px-4 py-2'>Fecha</th>
            <th className='px-4 py-2'>Tipo</th>
            <th className='px-4 py-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((movimiento) => (
            <tr key={movimiento.id}>
              <td className='px-4 py-2'>{movimiento.clienteId}</td>
              <td className='px-4 py-2'>{movimiento.proveedorId}</td>
              <td className='px-4 py-2'>{movimiento.monto}</td>
              <td className='px-4 py-2'>{movimiento.fecha}</td>
              <td className='px-4 py-2'>{movimiento.tipo}</td>
              <td className='px-4 py-2'>
                <button
                  onClick={() => handleEliminarMovimiento(movimiento.id)}
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md'
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovementsPage;