"use client";
import React, { useState, useEffect } from "react";

// Tipo para los movimientos
interface Movement {
  id: number; // Este es generado por la base de datos, no se debe pasar al crear
  clienteId: number;
  proveedorId?: number;
  monto: number;
  tipo: "ingreso" | "egreso"; // Cambié "venta" y "compra" a "ingreso" y "egreso" según tu ejemplo
  formaPago?: string; // Si necesitas este campo
  descripcion?: string; // Si necesitas este campo
}

const MovementsPage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movement[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState<Omit<Movement, "id">>({
    clienteId: 0,
    proveedorId: 0,
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
    setError(null); // Limpiar errores previos
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
      setNuevoMovimiento({ clienteId: 0, proveedorId: 0, monto: 0, tipo: "ingreso" }); // Resetear el formulario
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
    <div className='p