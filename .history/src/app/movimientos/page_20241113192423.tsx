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
          value={nuevoMovimiento.m