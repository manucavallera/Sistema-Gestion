"use client";
import React, { useState, useEffect } from "react";
import { getReceiptById } from 
import { getMovementsByClientId } from "../../services/movementService"; // O el servicio necesario para obtener el saldo

const ReceiptPage: React.FC = () => {
  const [recibo, setRecibo] = useState<any>(null);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const receiptId = 1; // Cambiar por el ID del recibo que desees

  // Obtener el recibo y el saldo cuando se cargue la página
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const receiptData = await getReceiptById(receiptId);
        setRecibo(receiptData);

        // Obtener los movimientos para el cliente relacionado con el recibo
        const movementsData = await getMovementsByClientId(
          receiptData.clienteId
        );
        const totalSaldo = movementsData.reduce(
          (acc: number, movement: any) => acc + movement.monto,
          0
        );
        setSaldo(totalSaldo);
      } catch (err) {
        setError("Error al obtener los datos del recibo o saldo");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [receiptId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Recibo</h1>

      {/* Recibo */}
      {recibo && (
        <div>
          <h2 className='text-xl font-bold'>Recibo ID: {recibo.id}</h2>
          <p>Cliente: {recibo.clienteNombre}</p>
          <p>Fecha: {recibo.fecha}</p>
          <p>Monto: {recibo.monto}</p>

          {/* Mostrar el saldo */}
          {saldo !== null && (
            <div className='mt-4'>
              <h3 className='font-bold'>Saldo del Cliente:</h3>
              <p>${saldo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptPage;
