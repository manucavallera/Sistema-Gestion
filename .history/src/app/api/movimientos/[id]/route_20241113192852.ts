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
      setSuccessMessage("