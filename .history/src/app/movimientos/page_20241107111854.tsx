"use client";
import React, { useState, useEffect } from "react";
import {
  getMovimientos,
  agregarMovimiento,
  eliminarMovimiento,
  editarMovimiento,
} from "../../services/movementService";

// Definir el tipo para un movimiento
interface Movimiento {
  id: number;
  clienteId: number;
  proveedorId: number;
  monto: number;
  fecha: string;
  tipo: "venta" | "compra" | "pago";
}

const MovimientosPage: React.FC = (): JSX.Element => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState<
    Omit<Movimiento, "id">
  >({ clienteId: 0, proveedorId: 0, monto: 0, fecha: "", tipo: "venta" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar movimientos al montar el componente
  useEffect(() => {
    const cargarMovimientos = async () => {
      setLoading(true);
      try {
        const data = await getMovimientos();
        setMovimientos(data);
      } catch (err) {
        setError("Error al cargar los movimientos");
      } finally {
        setLoading(false);
      }
    };
    cargarMovimientos();
  }, []);

  // Función para guardar un movimiento
  const guardarMovimiento = async () => {
    if (
      nuevoMovimiento.monto &&
      nuevoMovimiento.fecha &&
      nuevoMovimiento.tipo
    ) {
      setError(null);
      setLoading(true);
      try {
        await agregarMovimiento(nuevoMovimiento);
        setMovimientos([
          ...movimientos,
          { ...nuevoMovimiento, id: Date.now() },
        ]);
        setNuevoMovimiento({
          clienteId: 0,
          proveedorId: 0,
          monto: 0,
          fecha: "",
          tipo: "venta",
        });
      } catch (err) {
        setError("Error al guardar el movimiento");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.");
    }
  };

  // Función para eliminar un movimiento
  const eliminar = async (id: number) => {
    setLoading(true);
    try {
      await eliminarMovimiento(id);
      setMovimientos(movimientos.filter((movimiento) => movimiento.id !== id));
    } catch (err) {
      setError("Error al eliminar el movimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Lista de Movimientos</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading && <div className='text-blue-500 mb-4'>Cargando...</div>}

      <div className='mb-4'>
        <input
          type='number'
          placeholder='Monto'
          value={nuevoMovimiento.monto}
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
          onClick={guardarMovimiento}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
        >
          Agregar Movimiento
        </button>
      </div>

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
                  onClick={() => eliminar(movimiento.id)}
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

export default MovimientosPage;
