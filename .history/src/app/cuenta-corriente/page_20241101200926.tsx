// src/app/cuenta-corriente/page.tsx
"use client";
import { useState, useEffect } from "react";

interface Movimiento {
  id: number;
  fecha: string;
  tipo: string;
  monto: number;
  saldo: number;
  referencia?: string;
}

function CuentaCorrientePage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [saldoActual, setSaldoActual] = useState(0);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await fetch("/api/movimientos");
        if (response.ok) {
          const data = await response.json();
          setMovimientos(data.movimientos);
          if (data.movimientos.length > 0) {
            setSaldoActual(data.movimientos[0].saldo);
          }
        }
      } catch (error) {
        console.error("Error fetching movimientos:", error);
      }
    };
    fetchMovimientos();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Cuenta Corriente</h1>
      <div className='flex justify-between items-center mb-6'>
        <span className='text-lg font-semibold'>
          Saldo Actual: ${saldoActual}
        </span>
        <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
          Agregar Movimiento
        </button>
      </div>

      <table className='w-full text-left border-collapse'>
        <thead>
          <tr>
            <th className='border-b p-2'>Fecha</th>
            <th className='border-b p-2'>Tipo</th>
            <th className='border-b p-2'>Monto</th>
            <th className='border-b p-2'>Saldo</th>
            <th className='border-b p-2'>Referencia</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length > 0 ? (
            movimientos.map((movimiento) => (
              <tr
                key={movimiento.id}
                className={
                  movimiento.tipo === "credito" ? "bg-green-100" : "bg-red-100"
                }
              >
                <td className='p-2'>
                  {new Date(movimiento.fecha).toLocaleDateString()}
                </td>
                <td className='p-2'>
                  {movimiento.tipo === "credito" ? "Crédito" : "Débito"}
                </td>
                <td className='p-2'>${movimiento.monto.toFixed(2)}</td>
                <td className='p-2'>${movimiento.saldo.toFixed(2)}</td>
                <td className='p-2'>{movimiento.referencia || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className='text-center p-4'>
                No hay movimientos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CuentaCorrientePage;
