"use client";
import React, { useState, useEffect } from "react";
import { getRemitById } from "@/services/printService";
import { getMovementsByProviderId } from "@/services/movementService"; // O el servicio necesario para obtener el saldo

const DeliveryNotePage: React.FC = () => {
  const [remito, setRemito] = useState<any>(null);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const remitoId = 1; // Cambiar por el ID del remito que desees

  // Obtener el remito y el saldo cuando se cargue la página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const remitoData = await getRemitById(remitoId);
        setRemito(remitoData);

        // Obtener los movimientos para el proveedor relacionado con el remito
        const movementsData = await getMovementsByProviderId(
          remitoData.proveedorId
        );
        const totalSaldo = movementsData.reduce(
          (acc: number, movement: any) => acc + movement.monto,
          0
        );
        setSaldo(totalSaldo);
      } catch (err) {
        setError("Error al obtener los datos del remito o saldo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [remitoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Remito</h1>

      {/* Remito */}
      {remito && (
        <div>
          <h2 className='text-xl font-bold'>Remito ID: {remito.id}</h2>
          <p>Proveedor: {remito.proveedorNombre}</p>
          <p>Fecha: {remito.fecha}</p>
          <p>Monto: {remito.monto}</p>

          {/* Mostrar el saldo */}
          {saldo !== null && (
            <div className='mt-4'>
              <h3 className='font-bold'>Saldo del Proveedor:</h3>
              <p>${saldo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryNotePage;
